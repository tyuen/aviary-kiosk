self.addEventListener("install", (e) => {
  e.waitUntil(
    Promise.all([
      caches.open("aviary"),
      fetch("./data.json").then((res) => res.json()),
    ]).then(([cache, json]) => {
      var files = new Set();
      files.add("./data.json");
      files.add("./assets/JustFontFenYuanZiTi.ttf");
      json.list.forEach((i) => {
        if (i.img) files.add("./data/" + i.img);
        if (i.audio) files.add("./data/" + i.audio);
      });
      cache.addAll(Array.from(files.values()));
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
