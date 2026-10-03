/* Service worker: l'app funziona offline dopo la prima apertura (anche in Giappone senza rete).
   data.json: prima la rete, ma se non risponde entro 3 secondi si usa la copia salvata (reti lente in metro).
   Il resto: prima la copia salvata. Cambiare VERSION quando si modificano index.html, app.js o app.css. */
const VERSION = "g26-v4";
const SHELL = ["./", "index.html", "app.css", "app.js", "data.json", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith("data.json")) {
    const net = fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put("data.json", copy)); }
      return res;
    });
    e.waitUntil(net.catch(() => {}));
    e.respondWith(
      Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000))])
        .catch(() => caches.match("data.json").then((hit) => hit || net))
    );
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match("index.html"))));
});
