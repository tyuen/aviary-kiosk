const VER = "v1";

self.addEventListener("install", e => {
  e.waitUntil(
    Promise.all([
      caches.open(VER),
      fetch("./data.json").then(res => res.json()),
    ]).then(([cache, json]) => {
      var files = new Set();
      files.add("./index.html");
      //note we are still missing external JS/CSS files here so
      //after ServiceWorker is activated we need to manually
      //reload page so that "fetch" can get the remaining files
      //so that we can really work offline
      files.add("./data.json");
      files.add("./assets/JustFontFenYuanZiTi.ttf");
      files.add("./assets/75538__ra-gun.wav");
      files.add("./assets/317273__dpoggioli.wav");
      json.list.forEach(i => {
        if (i.img) files.add("./data/" + i.img);
        if (i.audio) files.add("./data/" + i.audio);
      });
      return cache.addAll(Array.from(files.values()));
    }),
  );
  self.skipWaiting();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches
      .match(e.request)
      .then(res => {
        if (res) return res;
        return fetch(e.request).then(res => {
          var clone = res.clone();
          caches.open(VER).then(cache => cache.put(e.request, clone));
          return res;
        });
      })
      .catch(e => console.error(e)),
  );
});
