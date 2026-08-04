# 多邻国生词收集器 - 部署指南

## 需要上传的文件

将以下文件全部上传到 GitHub 仓库根目录：

| 文件 | 作用 |
|------|------|
| `duolingo-words.html` | 主页面（全部功能代码） |
| `manifest.json` | PWA 应用配置 |
| `sw.js` | Service Worker（离线缓存） |
| `icon.svg` | 应用图标 |
| `icon-maskable.svg` | 适配性图标 |
| `.nojekyll` | 禁用 GitHub Pages 的 Jekyll 处理 |

---

## 方法一：网页端上传（无需安装任何工具）

1. 打开 https://github.com/new
2. Repository name 填 `duolingo-words`
3. 选择 **Public**，点击 **Create repository**
4. 点击 **uploading an existing file** 链接
5. 把上述 6 个文件拖进去
6. 点击 **Commit changes**

## 方法二：用 Git 命令行

```bash
git init
git add .
git commit -m "多邻国生词收集器"
git branch -M main
git remote add origin https://github.com/你的用户名/duolingo-words.git
git push -u origin main
```

---

## 开启 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 左侧菜单点击 **Pages**
3. Source 选择 **Deploy from a branch**
4. Branch 选择 `main`，文件夹选 `/ (root)`
5. 点击 **Save**

等待 1-2 分钟后，页面顶部会显示你的线上地址：

```
https://你的用户名.github.io/duolingo-words/duolingo-words.html
```

---

## 手机上安装使用

1. 用手机浏览器打开上面的地址
2. **Android Chrome**：菜单 → 添加到主屏幕
3. **iPhone Safari**：分享 → 添加到主屏幕
4. 安装后像原生 App 一样使用，支持离线

---

## 验证 PWA 是否生效

- 电脑 Chrome 打开线上地址 → F12 → Application 面板
- Manifest 应显示 "多邻国生词收集器"
- Service Workers 显示 "Activated and is running"
- 安装横幅会自动弹出
