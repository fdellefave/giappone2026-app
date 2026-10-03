/* Service worker: l'app funziona offline dopo la prima apertura.
   data.json: prima la rete (così gli aggiornamenti arrivano subito), poi la copia salvata.
   Il resto: prima la copia salvata. Cambiare VERSION quando si modificano index.html, app.js o app.css. */
const VERSION = "g26-v2";
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
  const sameOrigin = url.origin === location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return;
  if (sameOrigin && url.pathname.endsWith("data.json")) {
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put("data.json", copy));
      return res;
    }).catch(() => caches.match("data.json")));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok || res.type === "opaque") {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy));
    }
    return res;
  }).catch(() => caches.match("index.html"))));
});
