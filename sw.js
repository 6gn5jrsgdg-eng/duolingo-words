// ============================================
// Service Worker - 多邻国生词收集器
// 功能：离线缓存 + 资源回退
// ============================================

const CACHE_NAME = 'duo-words-v2';
const CORE_ASSETS = [
    './duolingo-words.html',
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

// 请求拦截：缓存优先，网络回退
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // 仅处理 GET 请求
    if (req.method !== 'GET') return;

    // 忽略非 http(s) 请求
    const url = new URL(req.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;

            return fetch(req)
                .then((resp) => {
                    // 只缓存有效的同源响应
                    if (resp && resp.ok && url.origin === self.location.origin) {
                        const clone = resp.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return resp;
                })
                .catch(() => {
                    // 离线时回退到主页
                    if (req.mode === 'navigate') {
                        return caches.match('./duolingo-words.html');
                    }
                });
        })
    );
});
