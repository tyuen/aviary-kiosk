const VER = "v2";

self.addEventListener("install", e => {
  e.waitUntil(
    fetch("./data.json")
      .then(res => res.json())
      .then(json => {
        var files = new Set();
        files.add("./");
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
          if (i.img) i.img.forEach(s => files.add("./data/" + s));
          if (i.audio) files.add("./data/" + i.audio);
        });
        files = Array.from(files.values());
        return caches.open(VER).then(c => c.addAll(files));
      }),
  );
  self.skipWaiting();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) return res;
      return fetch(e.request).then(res => {
        var clone = res.clone();
        caches.open(VER).then(cache => cache.put(e.request, clone));
        return res;
      });
    }),
  );
});
