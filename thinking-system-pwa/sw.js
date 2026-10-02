/* ============================================================
   sw.js —— 思考与判断体系 PWA Service Worker (离线可读与快速加载)
   ============================================================ */
const CACHE_NAME = 'thinking-pwa-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './critical-thinking.html',
  './structured-engineering.html',
  './systems-thinking.html',
  './discussion-baseline.html',
  './dialogue.html',
  './judgment-system.html',
  './metacognition.html',
  './notes.html',
  './mental-models.html',
  './manifest.webmanifest',
  './assets/css/site.css',
  './assets/js/nav.js',
  './assets/js/models-data.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon.png',
  './assets/icons/icon.svg'
];

// 安装：预缓存静态核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 激活：清除旧缓存并立即接管客户端
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截：Stale-While-Revalidate 策略（优先缓存立即响应，后台静默更新）
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // 只处理同源资源
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // 网络失败时的兜底（例如离线时跳转主页）
        if (event.request.mode === 'navigate') {
          return cache.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
