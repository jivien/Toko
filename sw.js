// Nama cache untuk aplikasi kita
const CACHE_NAME = 'monggo-store-cache-v1';

// File-file penting yang akan disimpan agar bisa diakses offline
// Karena semua kode ada di index.html, hanya file ini yang perlu kita simpan
const urlsToCache = [
  '/',
  '/index.html'
];

// Event 'install': Menyimpan file-file penting ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka dan file inti disimpan');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Menyajikan file dari cache jika tersedia (membuatnya bisa offline)
self.addEventListener('fetch', event => {
  // Kita hanya cache request GET utama, bukan request ke Firebase atau API lain
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, langsung sajikan dari cache
        if (response) {
          return response;
        }

        // Jika tidak, ambil dari jaringan, sajikan, dan simpan ke cache untuk nanti
        return fetch(event.request).then(
          networkResponse => {
            // Cek jika response valid
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Buat salinan response karena response hanya bisa dibaca sekali
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

// Event 'activate': Membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
