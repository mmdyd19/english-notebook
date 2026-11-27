'use strict';
// 오프라인에서도 열리도록 앱 파일만 캐시한다. 학습 데이터는 캐시하지 않는다(localStorage).
// 업데이트가 바로 반영되도록: 항상 서버에 새 버전이 있는지 확인(no-cache)하고, 안 될 때만 캐시를 쓴다.
const CACHE = 'en-notebook-v11';
const FILES = ['./', 'index.html', 'style.css', 'config.js',
  'grammar/1-basics.js', 'grammar/2-verbs.js', 'grammar/3-sentences.js', 'grammar/4-more.js',
  'app.js', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 네트워크 우선(브라우저 캐시도 건너뜀), 실패하면 저장해 둔 사본 (같은 출처 요청만)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(url.pathname, copy));
        }
        return res;
      })
      .catch(() => caches.match(url.pathname, { ignoreSearch: true })
        .then((r) => r || caches.match(e.request, { ignoreSearch: true }))
        .then((r) => r || caches.match('index.html')))
  );
});
