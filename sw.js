// ============================================
// Service Worker - 多邻国生词收集器
// 功能：离线缓存 + 资源回退
// 策略：HTML 页面 network-first，其他资源 cache-first
// ============================================

const CACHE_NAME = 'duo-words-v9';
const CORE_ASSETS = [
    './duolingo-words.html',
    './dict-data.json',
    './manifest.json',
    './icon.svg',
    './icon-maskable.svg'
];

// 安装：预缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// 请求拦截
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // 仅处理 GET 请求
    if (req.method !== 'GET') return;

    // 忽略非 http(s) 请求
    const url = new URL(req.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // 跨域请求（如词典 API）不经过 Service Worker，直接由浏览器处理
    if (url.origin !== self.location.origin) return;

    // HTML 导航请求：network-first，确保总是获取最新版本
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((resp) => {
                    if (resp && resp.ok) {
                        const clone = resp.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return resp;
                })
                .catch(() => {
                    return caches.match('./duolingo-words.html');
                })
        );
        return;
    }

    // 其他同源资源：cache-first
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;

            return fetch(req)
                .then((resp) => {
                    if (resp && resp.ok) {
                        const clone = resp.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return resp;
                })
                .catch(() => {
                    // 离线时尝试缓存回退
                    return caches.match(req);
                });
        })
    );
});
