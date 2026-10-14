/* Giappone 2026 — back office per il computer (admin.html).
   Legge viaggio.md da GitHub, lo modifica per voci (un giorno, una tappa, un alloggio, una cosa da fare, una nota…),
   rigenera data.json nel browser con lo stesso build.py del repository (admin-worker.js, Python in WebAssembly)
   e pubblica viaggio.md + data.json con un solo commit su main, col token GitHub salvato solo su questo PC.
   L'app per il telefono (index.html) resta com'è e si aggiorna da sola. */
(function () {
  "use strict";
  var GH = { owner: "fdellefave", repo: "giappone2026-app", branch: "main" };
  var API = "https://api.github.com/repos/" + GH.owner + "/" + GH.repo;
  var RAW = "https://raw.githubusercontent.com/" + GH.owner + "/" + GH.repo + "/";

  var CITY = { roma: "Roma", tokyo: "Tokyo", kawaguchiko: "Kawaguchiko", kamakura: "Kamakura", kyoto: "Kyoto", takayama: "Takayama", osaka: "Osaka", shirakawago: "Shirakawa-go" };
  var TYPE = { vedere: ["Da vedere", "pin"], fare: ["Esperienza", "sparkles"], cibo: ["Mangiare", "food"], sposta: ["Spostamento in città", "walk"],
    viaggio: ["Treno, bus o volo", "train"], hotel: ["Hotel", "bed"], bagagli: ["Valigie", "luggage"] };
  var DETAIL = [["testo", "Testo libero"], ["breve", "Breve (sempre visibile)"], ["come", "Come arrivare"], ["costo", "Costo"], ["orari", "Orari"],
    ["binario", "Binario"], ["bagagli", "Valigie"], ["prenotazione", "Prenotazione"], ["attenzione", "Attenzione"], ["alternativa", "In alternativa"]];
  var GUIDE = [["senso", "Il senso della giornata"], ["mangiare", "Dove mangiare"], ["prenotare", "Da avere con sé"], ["attenzione", "Attenzione"],
    ["anticipo", "Se avanza tempo"], ["stanchi", "Se siete stanchi"], ["camminata", "A piedi e pause"]];
  var ATTR = [["posto", "posto: ", "place"], ["alloggio", "alloggio: ", "hotel"], ["treno", "treno: ", "train"], ["città", "città: ", "city"],
    ["zona", "zona: ", "zone"], ["dove", "dove: ", "text"], ["foto", "foto: ", "text"], ["fuso", "fuso: ", "tz"], ["via mezzi", "via mezzi: ", "via"],
    ["via piedi", "via piedi: ", "via"], ["via taxi", "via taxi: ", "via"], ["prenotare", "prenotare", "flag"], ["prenotato", "prenotato", "flag"],
    ["deposito", "deposito", "flag"], ["ritiro", "ritiro", "flag"], ["altro", "", "text"]];
  var SCHEMA = {
    "Alloggi": [["nome"], ["città", "city"], ["dal", "date"], ["al", "date"], ["prezzo", "text", "es. €80,56 o ¥12.000 (totale per 2)"], ["euro", "num"], ["yen", "num"],
      ["pagato", "sel", ["sì", "no", "gruppo"]], ["pagato da"], ["diviso", "sel", ["", "sì", "no"]], ["saldato", "sel", ["", "sì", "no"]], ["pagamento"], ["cancellazione"],
      ["indirizzo"], ["arrivo"], ["orari"], ["camera"], ["telefono"], ["app", "url"], ["maps", "text", "testo della ricerca su Google Maps"], ["nota", "area"]],
    "Treni": [["data", "date"], ["tratta"], ["mezzo"], ["orario"], ["prezzo"], ["euro", "num"], ["stato", "sel", ["pagato", "prenotato", "da comprare", "sul posto"]],
      ["pagato da"], ["conferma", "date"], ["link", "url"], ["nota", "area"]],
    "Da fare": [["cosa"], ["tipo", "sel", ["prenotare", "gestire"]], ["tappa", "slots"], ["giorno", "day"], ["apre", "date"], ["entro", "date"], ["quando"],
      ["costo"], ["link", "links"], ["priorità", "sel", ["alta", "media", "bassa"]], ["nota", "area"], ["fatto", "date"]],
    "Altre spese": [["cosa"], ["prezzo"], ["euro", "num"], ["stato", "sel", ["pagato", "da pagare"]], ["pagato da"], ["nota", "area"]],
    "Posti": [["nome"], ["tipo", "text", "emoji + tipo, es. ⛩ Tempio"], ["città", "city"], ["giorno", "text", "g/m, es. 6/11"], ["nota", "area"], ["maps"],
      ["tripadvisor", "url"], ["tabelog", "url"], ["sito", "url"], ["voto"], ["mappa", "sel", ["", "no"]], ["foto", "text", "titolo della pagina di Wikipedia in inglese"]],
    "Zone": [["nome"], ["cosa"], ["posti", "text", "id dei Posti e @id degli alloggi, separati da virgola"]],
    "Note": [["titolo"], ["giorno", "day"], ["testo", "multi"], ["data", "text", "AAAA-MM-GG HH:MM"]]
  };
  SCHEMA["Voli"] = SCHEMA["Treni"];
  var FIELD_HELP = { tappa: "Le tappe a cui si riferisce: l'app mette lì la notifica", fatto: "Data in cui è stata fatta: sui telefoni risulta spuntata", apre: "Da quando si può prenotare", entro: "Scadenza" };
  var NOTE_INTRO = "## Note\n\nNote e aggiornamenti, scritti di solito dal back office (admin.html dal PC). L'app li mostra nel giorno indicato\n(«Note del giorno» in fondo) e tutte insieme nel menu «Note e aggiornamenti». Il sito è pubblico: niente dati privati.\nCampi: `data` (AAAA-MM-GG HH:MM, quando è stata scritta), `giorno` (facoltativo, AAAA-MM-GG del viaggio), `titolo`,\n`testo` (si va a capo con righe rientrate di 2 spazi).\n";
  var PRIV = [
    [/\b(?:\d[ -]?){13,19}\b/, "sembra un numero di carta"], [/\b[A-Z]{2}\d{2}[A-Z]\d{10}[0-9A-Z]{12}\b/, "sembra un IBAN"],
    [/\bPIN\b/, "nomina un PIN"], [/passaport\w*\s*(n|num|:)/i, "numero di passaporto?"], [/\bHM[A-Z0-9]{8}\b/, "sembra un codice Airbnb"],
    [/\b\d{10}\b/, "numero di 10 cifre: conferma Booking?"], [/[?&](token|pincode|pin|auth|key|confirmation\w*)=/i, "link con un codice dentro"]
  ];
  var WD = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"], WDL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var MONTHS = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

  var ST = {
    base: null,          // {commit, sha, text, build}: com'è su GitHub
    work: "",            // testo con le modifiche
    data: null, dataFor: null, dataJson: "",
    build: { busy: true, code: null, errors: [], warnings: [], summary: "" },
    view: "home", sel: null, formDirty: false,
    commits: null, filter: { todo: "open", q: {} }, loadErr: null
  };
  var IDX = { place: {}, hotel: {}, train: {}, todo: {}, day: {}, dayN: {} };

  // ---------- utilità ----------
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function icon(n, c) { return '<svg class="ic' + (c ? " " + c : "") + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function fmt(opt) { return new Intl.DateTimeFormat("sv-SE", Object.assign({ timeZone: "Europe/Rome" }, opt)).format(new Date()); }
  function todayRome() { return fmt({ year: "numeric", month: "2-digit", day: "2-digit" }); }
  function nowRome() { return fmt({ year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "").slice(0, 16); }
  function isoD(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function dShort(s) { var d = isoD(s); return WD[d.getDay()] + " " + d.getDate() + "/" + (d.getMonth() + 1); }
  function dLong(s) { var d = isoD(s); return WDL[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  function dm(s) { var d = isoD(s); return d.getDate() + "/" + (d.getMonth() + 1); }
  function daysTo(s) { return Math.round((isoD(s) - isoD(todayRome())) / 86400000); }
  function ago(iso) {
    var m = Math.round((Date.now() - Date.parse(iso)) / 60000);
    if (m < 1) return "adesso"; if (m < 60) return m + " min fa"; if (m < 1440) return Math.round(m / 60) + " h fa";
    var d = Math.round(m / 1440); return d === 1 ? "ieri" : d + " giorni fa";
  }
  function eur(n) { return "€" + Number(n).toLocaleString("it-IT", { maximumFractionDigits: 0 }); }
  function cityVar(c) { return "var(--" + (CITY[c] ? c : "roma") + ")"; }
  function toast(msg, bad) {
    var t = document.createElement("div"); t.className = "toast" + (bad ? " bad" : ""); t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.classList.add("out"); }, 2600); setTimeout(function () { t.remove(); }, 3000);
  }
  var LS = {
    get: function (k) { try { return JSON.parse(localStorage.getItem("g26a:" + k)); } catch (e) { return null; } },
    set: function (k, v) { try { if (v == null) localStorage.removeItem("g26a:" + k); else localStorage.setItem("g26a:" + k, JSON.stringify(v)); } catch (e) { /* pieno o bloccato */ } }
  };
  function token() { try { return localStorage.getItem("g26a:token") || sessionStorage.getItem("g26a:token") || ""; } catch (e) { return ""; } }
  function setToken(t, remember) {
    try { localStorage.removeItem("g26a:token"); sessionStorage.removeItem("g26a:token"); if (t) (remember ? localStorage : sessionStorage).setItem("g26a:token", t); } catch (e) { /* niente */ }
  }

  // ---------- GitHub ----------
  function gh(path, opt) {
    opt = opt || {};
    var h = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, t = opt.token != null ? opt.token : token();
    if (t) h.Authorization = "Bearer " + t;
    if (opt.body) h["Content-Type"] = "application/json";
    return fetch(path.indexOf("http") === 0 ? path : API + path, { method: opt.method || "GET", headers: h, body: opt.body ? JSON.stringify(opt.body) : undefined, cache: "no-store" })
      .then(function (r) {
        return r.text().then(function (txt) {
          var j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) { /* non JSON */ }
          if (!r.ok) {
            var msg = (j && j.message) || ("HTTP " + r.status);
            if (r.status === 403 && /rate limit/i.test(msg)) msg = "GitHub limita le letture senza token (60 l'ora): inserisci il token in «Accesso a GitHub»";
            if (r.status === 401) msg = "Token GitHub non valido o scaduto";
            var e = new Error(msg); e.status = r.status; throw e;
          }
          return j;
        });
      });
  }
  function raw(commit, path) {
    return fetch(RAW + commit + "/" + path, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(path + ": HTTP " + r.status); return r.text(); });
  }
  function b64utf8(b64) {
    var bin = atob(String(b64).replace(/\s/g, "")), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(u);
  }
  function fetchRemote() {
    return gh("/git/ref/heads/" + GH.branch).then(function (ref) {
      var c = ref.object.sha;
      return Promise.all([gh("/contents/viaggio.md?ref=" + c), raw(c, "build.py")]).then(function (r) {
        return { commit: c, sha: r[0].sha, text: b64utf8(r[0].content), build: r[1] };
      });
    });
  }
  function loadCommits() {
    return gh("/commits?sha=" + GH.branch + "&per_page=15").then(function (list) { ST.commits = list; }).catch(function () { ST.commits = []; });
  }

  // ---------- viaggio.md a blocchi: «## Sezione» (descrizione) e «### voce» ----------
  function splitBlocks(text) {
    var out = [], cur = { key: "_top", sec: null, id: null, lines: [] }, sec = null;
    out.push(cur);
    text.split("\n").forEach(function (line) {
      if (line.indexOf("## ") === 0) { sec = line.slice(3).trim(); cur = { key: sec + "/", sec: sec, id: "", lines: [] }; out.push(cur); }
      else if (line.indexOf("### ") === 0 && sec) { var id = line.slice(4).trim(); cur = { key: sec + "/" + id, sec: sec, id: id, lines: [] }; out.push(cur); }
      cur.lines.push(line);
    });
    var seen = {};
    return out.filter(function (b) { return b.lines.length; }).map(function (b) {
      if (seen[b.key]) { var k = b.key; b.key = k + "#" + seen[k]; seen[k]++; } else seen[b.key] = 1;
      b.text = b.lines.join("\n");
      return b;
    });
  }
  function joinBlocks(bs) { var L = []; bs.forEach(function (b) { L.push.apply(L, b.lines); }); return L.join("\n"); }
  function normLines(text) { var L = String(text).replace(/\s+$/, "").split("\n"); L.push(""); return L; }
  function getBlock(key) { return splitBlocks(ST.work).filter(function (b) { return b.key === key; })[0] || null; }
  function blocksOf(sec) { return splitBlocks(ST.work).filter(function (b) { return b.sec === sec && b.id; }); }
  function setWork(text, why) {
    if (text === ST.work) return;
    ST.work = text;
    saveDraft();
    scheduleBuild();
    renderStatus();
    if (why !== "quiet") renderMain(true);
  }
  function setBlock(key, text) {
    var bs = splitBlocks(ST.work), b = bs.filter(function (x) { return x.key === key; })[0];
    if (!b) { toast("Voce non trovata: " + key, true); return false; }
    b.lines = normLines(text);
    setWork(joinBlocks(bs));
    return true;
  }
  function deleteBlock(key) {
    var bs = splitBlocks(ST.work).filter(function (x) { return x.key !== key; });
    setWork(joinBlocks(bs));
  }
  function insertBlock(sec, text, afterKey) {
    var bs = splitBlocks(ST.work), at = -1;
    bs.forEach(function (b, i) { if (afterKey ? b.key === afterKey : b.sec === sec) at = i; });
    if (at < 0) return false;
    var prev = bs[at];
    if (prev.lines[prev.lines.length - 1] !== "") prev.lines.push("");
    bs.splice(at + 1, 0, { key: "new", lines: normLines(text) });
    setWork(joinBlocks(bs));
    return true;
  }
  function ensureSection(sec, intro, beforeSec) {
    if (splitBlocks(ST.work).some(function (b) { return b.key === sec + "/"; })) return;
    var bs = splitBlocks(ST.work), at = bs.length;
    bs.forEach(function (b, i) { if (b.key === beforeSec + "/") at = i; });
    var prev = bs[at - 1];
    if (prev && prev.lines[prev.lines.length - 1] !== "") prev.lines.push("");
    bs.splice(at, 0, { key: sec + "/", lines: normLines(intro) });
    ST.work = joinBlocks(bs);
  }
  function sectionText(sec) { return splitBlocks(ST.work).filter(function (b) { return b.sec === sec; }).map(function (b) { return b.lines.join("\n"); }).join("\n"); }
  function setSectionText(sec, text) {
    var bs = splitBlocks(ST.work), first = -1, last = -1;
    bs.forEach(function (b, i) { if (b.sec === sec) { if (first < 0) first = i; last = i; } });
    if (first < 0) return;
    if (!/^## /.test(text.trim())) { toast("Il testo deve iniziare con «## " + sec + "»", true); return; }
    var fresh = splitBlocks(text.replace(/\s+$/, "") + "\n").filter(function (b) { return b.key !== "_top"; });
    Array.prototype.splice.apply(bs, [first, last - first + 1].concat(fresh));
    setWork(joinBlocks(bs));
  }

  // ---------- voci «chiave: valore» ----------
  var KV_RE = /^([a-zà-ù ]+):\s*(.*)$/;
  function parseEntry(text) {
    var L = text.split("\n"), e = { id: L[0].slice(4).trim(), fields: [], extra: [] };
    for (var i = 1; i < L.length; i++) {
      var line = L[i], m = KV_RE.exec(line.trim());
      if (!line.trim()) continue;
      if (m && line === line.trimStart()) e.fields.push({ k: m[1].trim(), v: m[2].trim(), more: [] });
      else if (/^\s/.test(line) && e.fields.length) e.fields[e.fields.length - 1].more.push(line.trim());
      else e.extra.push(line);
    }
    return e;
  }
  function serializeEntry(e) {
    var L = ["### " + e.id];
    e.fields.forEach(function (f) { L.push(f.k + ":" + (f.v !== "" ? " " + f.v : "")); f.more.forEach(function (m) { L.push("  " + m); }); });
    e.extra.forEach(function (x) { L.push(x); });
    return L.join("\n") + "\n";
  }
  function fieldOf(e, k) { var f = e.fields.filter(function (x) { return x.k === k; })[0]; return f ? f.v : ""; }
  function setField(e, k, v, more) {
    var f = e.fields.filter(function (x) { return x.k === k; })[0];
    if (v === "" && !(more && more.length)) { e.fields = e.fields.filter(function (x) { return x.k !== k; }); return; }
    if (f) { f.v = v; f.more = more || []; } else e.fields.push({ k: k, v: v, more: more || [] });
  }

  // ---------- giorni: intestazione, tappe, guida ----------
  var ITEM_RE = /^- (\d{2}:\d{2}) ([a-z]+) (.+)$/;
  function parseItemLine(line) {
    var m = ITEM_RE.exec(line.trim());
    if (!m) return { raw: line, det: [] };
    var parts = m[3].split(" | ").map(function (p) { return p.trim(); });
    return { t: m[1], k: m[2], title: parts[0], attrs: parts.slice(1), det: [] };
  }
  function itemLine(it) { return it.raw != null ? it.raw : "- " + it.t + " " + it.k + " " + [it.title].concat(it.attrs).join(" | "); }
  function parseDay(text) {
    var L = text.split("\n"), d = { id: L[0].slice(4).trim(), head: [], items: [], guide: [], hasGuide: false, stray: [] }, mode = "head";
    for (var n = 1; n < L.length; n++) {
      var line = L[n];
      if (line.indexOf("#### Guida") === 0) { mode = "guide"; d.hasGuide = true; continue; }
      if (mode !== "guide" && line.indexOf("- ") === 0) { mode = "items"; d.items.push(parseItemLine(line)); continue; }
      if (mode === "items" && line.indexOf("  ") === 0 && line.trim()) { d.items[d.items.length - 1].det.push(line.trim()); continue; }
      if (!line.trim()) continue;
      var m = KV_RE.exec(line.trim()), top = line === line.trimStart();
      if (mode === "head") d.head.push(m && top ? { k: m[1].trim(), v: m[2].trim() } : { raw: line });
      else if (mode === "guide" && m && top) d.guide.push({ k: m[1].trim(), first: m[2].trim(), more: [] });
      else if (mode === "guide" && d.guide.length) d.guide[d.guide.length - 1].more.push(line.trim());
      else d.stray.push(line);
    }
    return d;
  }
  function serializeDay(d) {
    var L = ["### " + d.id];
    d.head.forEach(function (h) { L.push(h.raw != null ? h.raw : h.k + ":" + (h.v ? " " + h.v : "")); });
    d.items.forEach(function (it) { L.push(itemLine(it)); it.det.forEach(function (x) { L.push("  " + x); }); });
    d.stray.forEach(function (x) { L.push(x); });
    if (d.hasGuide || d.guide.length) {
      L.push("", "#### Guida");
      d.guide.forEach(function (g) { L.push(g.k + ":" + (g.first ? " " + g.first : "")); g.more.forEach(function (x) { L.push("  " + x); }); });
    }
    return L.join("\n") + "\n";
  }
  function headOf(d, k) { var h = d.head.filter(function (x) { return x.k === k; })[0]; return h ? h.v : ""; }
  function setHead(d, k, v) {
    var h = d.head.filter(function (x) { return x.k === k; })[0];
    if (!v) { d.head = d.head.filter(function (x) { return x.k !== k; }); return; }
    if (h) h.v = v; else d.head.push({ k: k, v: v });
  }
  function dayModel(id) { var b = getBlock("Giorni/" + id); return b ? parseDay(b.text) : null; }
  function saveDay(d) { return setBlock("Giorni/" + d.id, serializeDay(d)); }
  function attrKey(a) {
    for (var i = 0; i < ATTR.length - 1; i++) {
      var x = ATTR[i];
      if (x[2] === "flag" ? a === x[1] : a.indexOf(x[1]) === 0) return { k: x[0], v: x[2] === "flag" ? "" : a.slice(x[1].length) };
    }
    return { k: "altro", v: a };
  }

  // ---------- confronto e unione con GitHub ----------
  function blockMap(text) { var m = {}, order = []; splitBlocks(text).forEach(function (b) { m[b.key] = b.text; order.push(b.key); }); return { m: m, order: order }; }
  function changes(baseText, workText) {
    var B = blockMap(baseText), W = blockMap(workText), out = [];
    W.order.forEach(function (k, i) {
      if (!(k in B.m)) out.push({ key: k, kind: "add", after: W.order[i - 1], mine: W.m[k], base: "" });
      else if (B.m[k] !== W.m[k]) out.push({ key: k, kind: "mod", mine: W.m[k], base: B.m[k] });
    });
    B.order.forEach(function (k) { if (!(k in W.m)) out.push({ key: k, kind: "del", mine: "", base: B.m[k] }); });
    return out;
  }
  function rebase(baseText, workText, remoteText, keep) {
    keep = keep || {};
    var R = splitBlocks(remoteText), conflicts = [];
    function idx(k) { for (var i = 0; i < R.length; i++) if (R[i].key === k) return i; return -1; }
    changes(baseText, workText).forEach(function (c) {
      var i = idx(c.key), theirs = i >= 0 ? R[i].text : null;
      var clash = c.kind === "add" ? theirs != null && theirs !== c.mine : theirs !== c.base && theirs !== c.mine;
      if (clash && keep[c.key] === "theirs") return;
      if (clash && keep[c.key] !== "mine") { conflicts.push({ key: c.key, kind: c.kind, mine: c.mine, base: c.base, theirs: theirs }); return; }
      if (c.kind === "del") { if (i >= 0) R.splice(i, 1); return; }
      var nb = { key: c.key, lines: c.mine.split("\n") };
      if (i >= 0) { R[i] = nb; return; }
      var at = c.after ? idx(c.after) : -1, sec = c.key.split("/")[0];
      if (at < 0) R.forEach(function (b, j) { if (b.sec === sec) at = j; });
      if (at < 0) at = R.length - 1;
      var prev = R[at]; if (prev && prev.lines[prev.lines.length - 1] !== "") prev.lines.push("");
      R.splice(at + 1, 0, nb);
    });
    return { text: joinBlocks(R), conflicts: conflicts };
  }
  function lineDiff(a, b) {
    var A = a ? a.split("\n") : [], B = b ? b.split("\n") : [], n = A.length, m = B.length, T = [];
    for (var i = 0; i <= n; i++) { T.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) T[i][j] = A[i] === B[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    var out = []; i = 0; j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && A[i] === B[j]) { out.push([" ", A[i]]); i++; j++; }
      else if (j < m && (i >= n || T[i][j + 1] >= T[i + 1][j])) { out.push(["+", B[j]]); j++; }
      else { out.push(["-", A[i]]); i++; }
    }
    return out;
  }
  function diffHtml(a, b) {
    var d = lineDiff(a, b), keep = d.map(function (x, i) { return x[0] !== " " || (d[i - 1] && d[i - 1][0] !== " ") || (d[i + 1] && d[i + 1][0] !== " "); });
    var h = "", gap = false;
    d.forEach(function (x, i) {
      if (!keep[i]) { if (!gap) h += '<div class="dl gap">⋯</div>'; gap = true; return; }
      gap = false;
      h += '<div class="dl ' + (x[0] === "+" ? "add" : x[0] === "-" ? "del" : "") + '"><i>' + (x[0] === " " ? "" : x[0]) + "</i>" + esc(x[1] || " ") + "</div>";
    });
    return '<div class="diff">' + h + "</div>";
  }
  function blockLabel(key) {
    if (key === "_top") return "Intestazione del file";
    var p = key.split("/"), sec = p[0], id = p.slice(1).join("/").replace(/#\d+$/, "");
    if (!id) return "Sezione «" + sec + "» (descrizione)";
    if (sec === "Giorni") return "Giorno " + dShort(id);
    var b = getBlock(key) || { text: "" }, e = b.text ? parseEntry(b.text) : null;
    var name = e && (fieldOf(e, "nome") || fieldOf(e, "cosa") || fieldOf(e, "titolo") || fieldOf(e, "tratta"));
    return sec + " · " + (name || id);
  }

  // ---------- build.py nel browser ----------
  var W = { worker: null, ready: false, failed: null, seq: 0, pending: {} };
  function startWorker() {
    try { W.worker = new Worker("admin-worker.js"); } catch (e) { W.failed = String(e); return; }
    W.worker.onmessage = function (e) {
      var m = e.data;
      if (m.type === "ready") { W.ready = true; renderStatus(); }
      else if (m.type === "fail") { W.failed = m.error; ST.build.busy = false; renderStatus(); }
      else if (m.type === "result") { var cb = W.pending[m.id]; delete W.pending[m.id]; if (cb) cb(m); }
    };
    W.worker.onerror = function (e) { W.failed = e.message || "errore"; ST.build.busy = false; renderStatus(); };
  }
  function runBuild(text) {
    return new Promise(function (res) {
      if (!W.worker || W.failed) return res({ code: 3, out: "ERRORE: Python nel browser non disponibile (" + (W.failed || "worker") + ")", data: "" });
      var id = ++W.seq; W.pending[id] = res;
      W.worker.postMessage({ id: id, text: text, build: ST.base.build });
    });
  }
  function parseOut(out) {
    var r = { errors: [], warnings: [], summary: "" };
    String(out || "").split("\n").forEach(function (l) {
      if (l.indexOf("ERRORE: ") === 0) r.errors.push(l.slice(8));
      else if (l.indexOf("avviso: ") === 0) r.warnings.push(l.slice(8));
      else if (l.indexOf("ok: ") === 0) r.summary = l.slice(4);
    });
    return r;
  }
  var buildTimer = null;
  function scheduleBuild() { clearTimeout(buildTimer); ST.build.busy = true; buildTimer = setTimeout(doBuild, 350); }
  function doBuild() {
    var text = ST.work;
    return runBuild(text).then(function (m) {
      if (text !== ST.work) return;
      var p = parseOut(m.out);
      ST.build = { busy: false, code: m.code, errors: p.errors, warnings: p.warnings, summary: p.summary, text: text };
      if (m.code === 0 && m.data) { useData(JSON.parse(m.data), text, m.data); sendPreview(); }
      renderStatus();
      if (!ST.mainDirty) renderMain(true); // non cancellare un testo che si sta scrivendo nella pagina
    });
  }
  function useData(data, text, json) {
    ST.data = data; ST.dataFor = text; ST.dataJson = json || "";
    IDX = { place: data.places || {}, hotel: {}, train: {}, todo: {}, day: {}, dayN: {} };
    data.hotels.forEach(function (h) { IDX.hotel[h.id] = h; });
    data.trains.concat(data.flights || []).forEach(function (t) { IDX.train[t.id] = t; });
    data.todo.forEach(function (t) { IDX.todo[t.id] = t; });
    data.days.forEach(function (d, i) { IDX.day[d.id] = d; IDX.dayN[d.id] = i; });
  }
  function problemKey(msg) {
    var m = /^(\d{4}-\d{2}-\d{2})/.exec(msg);
    if (m) return "Giorni/" + m[1];
    m = /^([A-Z][^/:]*)\/([a-z0-9-]+)/i.exec(msg);
    if (m) return m[1] + "/" + m[2];
    return null;
  }

  // ---------- bozza locale: le modifiche non pubblicate sopravvivono alla chiusura della pagina ----------
  var draftTimer = null;
  function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(function () {
      if (!ST.base) return;
      LS.set("draft", ST.work === ST.base.text ? null : { sha: ST.base.sha, base: ST.base.text, work: ST.work, at: nowRome() });
    }, 300);
  }
  function dirtyCount() { return ST.base ? changes(ST.base.text, ST.work).length : 0; }

  // ---------- stato in alto ----------
  function renderStatus() {
    var el = $("#status");
    if (!el || !ST.base) return;
    var b = ST.build, n = dirtyCount(), h = "";
    if (W.failed) h += '<button class="chip bad" data-go="problems">' + icon("alert") + "Python non disponibile</button>";
    else if (b.busy || !W.ready && b.code == null) h += '<span class="chip">' + '<span class="spin"></span>' + (W.ready ? "Controllo…" : "Preparo il controllo…") + "</span>";
    else if (b.errors.length) h += '<button class="chip bad" data-go="problems">' + icon("alert") + b.errors.length + (b.errors.length === 1 ? " errore" : " errori") + "</button>";
    else h += '<button class="chip ok" data-go="problems" title="' + esc(b.summary) + '">' + icon("circle-check") + "Dati ok" + (b.warnings.length ? " · " + b.warnings.length + " avvisi" : "") + "</button>";
    h += '<button class="chip' + (n ? " warn" : "") + '" data-go="changes">' + icon("undo") + (n ? n + (n === 1 ? " modifica" : " modifiche") + " da pubblicare" : "Tutto pubblicato") + "</button>";
    h += '<button class="btn go" data-act="publish"' + (n ? "" : " disabled") + ">" + icon("upload") + "Pubblica</button>";
    el.innerHTML = h;
    var nav = $("#nav"); if (nav) nav.innerHTML = navHtml();
    document.title = (n ? "• " : "") + "Back office · Giappone 2026";
  }

  // ---------- navigazione ----------
  var NAV = [["home", "Panoramica", "dash"], ["todo", "Da fare", "alert"], ["notes", "Note", "sticky"], ["sec:Alloggi", "Alloggi", "bed"],
    ["sec:Treni", "Treni e bus", "train"], ["sec:Voli", "Voli", "plane"], ["sec:Altre spese", "Altre spese", "wallet"], ["sec:Posti", "Posti", "landmark"], ["sec:Zone", "Zone", "map"],
    ["budget", "Soldi e budget", "wallet"], ["sec:Glossario", "Glossario", "book"], ["text:Note per Claude", "Note per Claude", "info"],
    ["text:Info", "Info generali", "info"], ["text:Sintassi", "Sintassi del file", "file"], ["raw", "Tutto il file", "file"], ["changes", "Modifiche", "undo"]];
  function openCount() { return ST.data ? ST.data.todo.filter(function (t) { return !t.done; }).length : 0; }
  function dayOpen(d) {
    var ids = {};
    d.items.forEach(function (it) { (it.todos || []).forEach(function (id) { if (IDX.todo[id] && !IDX.todo[id].done) ids[id] = 1; }); });
    return Object.keys(ids).length + d.items.filter(function (it) { return it.status === "todo" && !(it.todos || []).length; }).length;
  }
  function navHtml() {
    var h = "", v = ST.view, ch = dirtyCount(), changedDays = {};
    if (ST.base) changes(ST.base.text, ST.work).forEach(function (c) { if (c.key.indexOf("Giorni/") === 0) changedDays[c.key.slice(7)] = 1; });
    function item(k, label, ic, badge, extra) {
      return '<button class="nv' + (v === k ? " on" : "") + '" data-go="' + esc(k) + '"' + (extra || "") + ">" + icon(ic) + "<span>" + esc(label) + "</span>" + (badge || "") + "</button>";
    }
    h += item(NAV[0][0], NAV[0][1], NAV[0][2]);
    h += '<div class="nv-h">Giorni</div><div class="nv-days">';
    (ST.data ? ST.data.days : []).forEach(function (d) {
      var c = d.route.filter(function (x) { return x !== "roma"; }), city = c[c.length - 1] || "roma", n = dayOpen(d);
      h += '<button class="nv day' + (v === "day:" + d.id ? " on" : "") + '" data-go="day:' + d.id + '" style="--c:' + cityVar(city) + '"><i></i><span><b>' + esc(dShort(d.id)) + "</b> " +
        esc(d.route.map(function (r) { return CITY[r] || r; }).filter(function (r, k, a) { return a.indexOf(r) === k; }).join(" › ")) + "</span>" +
        (changedDays[d.id] ? '<em class="dot" title="Modificato, non pubblicato"></em>' : "") + (n ? '<b class="nb">' + n + "</b>" : "") + "</button>";
    });
    h += '</div><div class="nv-h">Gestione</div>';
    NAV.slice(1).forEach(function (x) {
      var badge = x[0] === "todo" && openCount() ? '<b class="nb">' + openCount() + "</b>" : x[0] === "changes" && ch ? '<b class="nb warn">' + ch + "</b>" :
        x[0] === "notes" && ST.data && (ST.data.notes || []).length ? '<b class="nb soft">' + ST.data.notes.length + "</b>" : "";
      h += item(x[0], x[1], x[2], badge);
    });
    return h;
  }
  function go(view, sel, keepHash) {
    if (!confirmLeaveForm()) return;
    var keepPv = !sel && ST.sel && ST.sel.type === "preview" && view.indexOf("day:") === 0 && $("#pv");
    ST.view = view; ST.sel = keepPv ? ST.sel : sel || null; ST.formDirty = false;
    if (!keepHash) { var hsh = "#" + encodeURIComponent(view); if (location.hash !== hsh) history.pushState(null, "", hsh); }
    renderStatus();
    renderMain();
    if (keepPv) { var f = $("#pv"); if (f.contentWindow) f.contentWindow.postMessage({ type: "g26-day", day: IDX.dayN[view.slice(4)] || 0 }, location.origin); }
    else renderSide();
    $("#main").scrollTop = 0;
  }
  function select(sel) {
    if (!confirmLeaveForm()) return;
    ST.sel = sel; ST.formDirty = false;
    renderMain(true);
    renderSide();
  }
  function confirmLeaveForm() {
    if (ST.mainDirty) {
      var mf = $("#main form");
      if (mf && confirm("Nella pagina ci sono modifiche non applicate. Applicarle prima di andare avanti?")) applyForm(mf);
      ST.mainDirty = false;
    }
    if (!ST.formDirty) return true;
    var f = $("#side form");
    if (f && confirm("Nel modulo a destra ci sono modifiche non applicate. Applicarle prima di andare avanti?")) { applyForm(f); }
    ST.formDirty = false;
    return true;
  }

  // ---------- vista principale ----------
  function renderMain(keepScroll) {
    var m = $("#main"); if (!m) return;
    var y = m.scrollTop, v = ST.view, h;
    if (!ST.data) h = '<div class="empty"><span class="spin big"></span><p>Carico i dati…</p></div>';
    else if (v === "home") h = viewHome();
    else if (v.indexOf("day:") === 0) h = viewDay(v.slice(4));
    else if (v === "todo") h = viewTodo();
    else if (v === "notes") h = viewNotes();
    else if (v.indexOf("sec:") === 0) h = viewSection(v.slice(4));
    else if (v === "budget") h = viewBudget();
    else if (v.indexOf("text:") === 0) h = viewText(v.slice(5));
    else if (v === "raw") h = viewRaw();
    else if (v === "changes") h = viewChanges();
    else if (v === "problems") h = viewProblems();
    else h = viewHome();
    m.innerHTML = h;
    if (keepScroll) m.scrollTop = y;
    document.body.classList.toggle("has-side", !!sideWanted());
  }
  function stale() { return ST.dataFor !== ST.work ? '<p class="banner warn">' + icon("alert") + "Le ultime modifiche hanno un errore: qui vedi i dati dell'ultima versione corretta. <button class=\"lnk\" data-go=\"problems\">Vedi gli errori</button></p>" : ""; }
  function pageHead(title, sub, actions) {
    return '<header class="ph"><div><h1>' + title + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + "</div>" + (actions ? '<div class="ph-a">' + actions + "</div>" : "") + "</header>" + stale();
  }
  function todoKeyDate(t) { return t.opens && t.opens > todayRome() ? t.opens : t.due || t.day || "9999"; }
  function todoPill(t) {
    var today = todayRome();
    if (t.done) return '<span class="pill ok">Fatto il ' + dm(t.done) + "</span>";
    if (t.opens && today < t.opens) { var o = daysTo(t.opens); return '<span class="pill ' + (o <= 3 ? "warn" : "info") + '">Dal ' + dm(t.opens) + (o <= 14 ? " · tra " + o + " g" : "") + "</span>"; }
    if (t.due) { var n = daysTo(t.due); return n < 0 ? '<span class="pill bad">Scaduto il ' + dm(t.due) + "</span>" : '<span class="pill ' + (n <= 7 ? "bad" : "muted") + '">' + (n === 0 ? "Entro oggi" : "Entro il " + dm(t.due) + " · " + n + " g") + "</span>"; }
    if (/^subito/i.test(t.when || "") || t.prio === "alta") return '<span class="pill bad">Subito</span>';
    return "";
  }
  function slotLabel(t) {
    if (!t.at || !t.at.length) return "";
    var a = t.at[0], d = ST.data.days[a.d], it = d && d.items[a.i];
    return it ? dShort(d.id) + " " + it.t + " · " + it.title : "";
  }

  function viewHome() {
    var D = ST.data, open = D.todo.filter(function (t) { return !t.done; }), dep = (D.departure || "").slice(0, 10), n = dep ? daysTo(dep) : null;
    var book = open.filter(function (t) { return t.kind === "prenotare"; }).length, soon = open.filter(function (t) { var k = todoKeyDate(t); return k !== "9999" && daysTo(k) <= 7; }).length;
    var est = budgetRows().reduce(function (s, r) { return s + r.eur; }, 0);
    var h = pageHead("Panoramica", "Giappone 5–18 novembre 2026 · dati del " + esc(D.generated || ""), '<a class="btn" href="./" target="_blank" rel="noopener">' + icon("phone-s") + "Apri l'app</a>");
    h += '<div class="kpis">' +
      kpi(n == null ? "–" : n > 0 ? n : n === 0 ? "oggi" : "via!", n > 0 ? "giorni alla partenza" : n === 0 ? "si parte" : "in viaggio o già tornati", "plane") +
      kpi(open.length, "cose aperte · " + book + " da prenotare", "alert", open.length ? "todo" : "", open.length ? "bad" : "ok") +
      kpi(soon, "scadenze nei prossimi 7 giorni", "clock", "todo", soon ? "warn" : "") +
      kpi(eur(est), "budget stimato a testa", "wallet", "budget") + "</div>";
    h += '<div class="cols home"><section class="card"><div class="card-h"><h2>' + icon("alert") + 'Prossime scadenze</h2><button class="lnk" data-go="todo">Tutte</button></div>';
    var list = open.slice().sort(function (a, b) { return todoKeyDate(a) < todoKeyDate(b) ? -1 : 1; }).slice(0, 8);
    h += list.length ? '<div class="rows">' + list.map(function (t) {
      return '<button class="rowb" data-act="sel-todo" data-id="' + esc(t.id) + '"><span class="k ' + (t.kind === "prenotare" ? "bad" : "warn") + '"></span><span class="rb-t"><b>' + esc(t.task) + "</b><small>" + esc(slotLabel(t) || t.when || "") + "</small></span>" + todoPill(t) + "</button>";
    }).join("") + "</div>" : '<p class="muted">Niente di aperto.</p>';
    h += '</section><div class="stack">';
    h += '<section class="card"><div class="card-h"><h2>' + icon("sticky") + 'Note recenti</h2><button class="lnk" data-act="new-note">+ Nuova nota</button></div>' +
      ((D.notes || []).length ? '<div class="rows">' + D.notes.slice(0, 5).map(noteRow).join("") + "</div>" : '<p class="muted">Ancora nessuna nota. Scrivine una: si vede anche sull\'app.</p>') + "</section>";
    h += '<section class="card"><div class="card-h"><h2>' + icon("git") + "Ultimi aggiornamenti pubblicati</h2></div>" + commitsHtml() + "</section></div></div>";
    h += '<h2 class="sec-t">Il programma</h2><div class="cal">' + D.days.map(dayCard).join("") + "</div>";
    return h;
  }
  function kpi(v, label, ic, goTo, cls) {
    return "<" + (goTo ? 'button data-go="' + goTo + '"' : "div") + ' class="kpi ' + (cls || "") + '">' + icon(ic) + '<b class="num">' + v + "</b><span>" + esc(label) + "</span></" + (goTo ? "button" : "div") + ">";
  }
  function commitsHtml() {
    if (ST.commits == null) return '<p class="muted"><span class="spin"></span> Carico…</p>';
    if (!ST.commits.length) return '<p class="muted">Non disponibili.</p>';
    return '<div class="rows">' + ST.commits.slice(0, 8).map(function (c) {
      var msg = (c.commit.message || "").split("\n")[0];
      return '<a class="rowb" href="' + esc(c.html_url) + '" target="_blank" rel="noopener"><span class="k git"></span><span class="rb-t"><b>' + esc(msg) + "</b><small>" +
        esc((c.commit.author && c.commit.author.name) || "") + " · " + esc(ago(c.commit.author.date)) + "</small></span></a>";
    }).join("") + "</div>";
  }
  function dayCard(d) {
    var n = dayOpen(d), c = d.route.filter(function (x) { return x !== "roma"; }), city = c[c.length - 1] || "roma";
    var stops = d.items.filter(function (it) { return !it.merged && !it.start; });
    return '<button class="dc" data-go="day:' + d.id + '" style="--c:' + cityVar(city) + '"><div class="dc-h"><b>' + esc(dShort(d.id)) + "</b>" + (n ? '<span class="nb">' + n + "</span>" : "") +
      '<span class="dc-r">' + d.route.map(function (r) { return '<i style="--c:' + cityVar(r) + '">' + esc(CITY[r] || r) + "</i>"; }).filter(function (x, k, a) { return a.indexOf(x) === k; }).join("") + "</span></div>" +
      '<ul class="dc-l">' + stops.map(function (it) {
        var bad = (it.todos || []).some(function (id) { return IDX.todo[id] && !IDX.todo[id].done; }) || (it.status === "todo" && !(it.todos || []).length);
        return '<li class="t-' + it.k + (bad ? " bad" : "") + (it.group ? " grp" : "") + '"><span class="num">' + it.t + "</span>" + esc(it.title) + "</li>";
      }).join("") + '</ul><div class="dc-f">' + icon("bed") + esc(d.sleepName) + "</div></button>";
  }
  function noteRow(n) {
    return '<button class="rowb" data-act="sel-note" data-id="' + esc(n.id) + '"><span class="k note"></span><span class="rb-t"><b>' + esc(n.title || "Nota") + "</b><small>" +
      esc((n.day ? dShort(n.day) + " · " : "") + "scritta il " + n.when) + "</small>" + (n.text ? '<span class="clip">' + esc(n.text.replace(/\n/g, " · ")) + "</span>" : "") + "</span></button>";
  }

  // ----- giorno -----
  function viewDay(id) {
    var dd = IDX.day[id], model = dayModel(id);
    if (!dd || !model) return pageHead("Giorno non trovato", "");
    var i = IDX.dayN[id], src = model.items, dataItems = dd.items.filter(function (x) { return !x.start; }), map = dataItems.length === src.length;
    var prev = ST.data.days[i - 1], next = ST.data.days[i + 1];
    var acts = (prev ? '<button class="btn icon" data-go="day:' + prev.id + '" title="Giorno prima">' + icon("left") + "</button>" : "") +
      (next ? '<button class="btn icon" data-go="day:' + next.id + '" title="Giorno dopo">' + icon("right") + "</button>" : "") +
      '<button class="btn" data-act="sel" data-sel="preview">' + icon("phone-s") + "Anteprima telefono</button>" +
      '<button class="btn icon" data-act="sel" data-sel="raw-day" title="Testo del giorno (viaggio.md)">' + icon("file") + "</button>";
    var h = pageHead('<span class="dot-c" style="--c:' + cityVar(dd.route[dd.route.length - 1]) + '"></span>' + esc(dLong(id).replace(/^./, function (c) { return c.toUpperCase(); })) + ' <small class="muted">giorno ' + dd.n + "</small>",
      dd.route.map(function (r) { return '<span class="city" style="--c:' + cityVar(r) + '">' + esc(CITY[r] || r) + "</span>"; }).join(" › "), acts);
    var probs = ST.build.errors.concat(ST.build.warnings).filter(function (p) { return problemKey(p) === "Giorni/" + id; });
    if (probs.length) h += '<div class="banner ' + (ST.build.errors.some(function (p) { return problemKey(p) === "Giorni/" + id; }) ? "bad" : "warn") + '">' + icon("alert") + "<ul>" + probs.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>";
    var sel = ST.sel || {};
    h += '<button class="dayhead' + (sel.type === "dayhead" ? " sel" : "") + '" data-act="sel" data-sel="dayhead">' +
      '<span><small>Si dorme</small><b>' + icon("bed") + esc(dd.sleepName) + "</b></span>" +
      "<span><small>Con</small><b>" + esc(dd.with || "–") + "</b></span>" +
      (dd.group ? "<span><small>Col gruppo</small><b class=\"grp\">" + esc(dd.group.from === "00:00" && dd.group.to === "23:59" ? "tutto il giorno" : (dd.group.from !== "00:00" ? "dalle " + dd.group.from : "") + (dd.group.to !== "23:59" ? " fino alle " + dd.group.to : "")) + "</b></span>" : "") +
      (dd.tz !== "tokyo" ? "<span><small>Orari</small><b>ora italiana</b></span>" : "") + '<em class="edit">' + icon("pencil") + "Modifica</em></button>";
    h += '<div class="plan">';
    src.forEach(function (it, k) {
      var di = map ? dataItems[k] : null;
      h += insBtn(k);
      h += stopRow(it, k, di, sel.type === "stop" && sel.day === id && sel.i === k && !sel.isNew);
    });
    h += insBtn(src.length) + "</div>";
    if (!map) h += '<p class="banner warn">' + icon("alert") + "Alcune righe non sono riconosciute: correggile nel «Testo del giorno».</p>";
    var notes = (ST.data.notes || []).filter(function (n) { return n.day === id; });
    h += '<div class="cols two"><section class="card"><div class="card-h"><h2>' + icon("sparkles") + 'Consigli per la giornata</h2><button class="lnk" data-act="sel" data-sel="guide">Modifica</button></div>' + guideHtml(dd.guide) + "</section>" +
      '<section class="card"><div class="card-h"><h2>' + icon("sticky") + 'Note del giorno</h2><button class="lnk" data-act="new-note" data-day="' + id + '">+ Nuova nota</button></div>' +
      (notes.length ? '<div class="rows">' + notes.map(noteRow).join("") + "</div>" : '<p class="muted">Nessuna nota per questo giorno.</p>') + "</section></div>";
    return h;
  }
  function insBtn(k) { return '<button class="ins" data-act="new-stop" data-i="' + k + '" title="Aggiungi una tappa qui">' + icon("plus") + "<span>tappa</span></button>"; }
  function stopRow(it, k, di, on) {
    if (it.raw != null) return '<div class="stop raw" data-act="sel" data-sel="raw-day"><span class="st-t">?</span><div class="st-b"><b>' + esc(it.raw) + "</b><small>riga non riconosciuta</small></div></div>";
    var tags = [], short = "";
    it.attrs.forEach(function (a) {
      var x = attrKey(a);
      if (x.k === "posto") tags.push('<span class="tag">' + icon("pin") + esc((IDX.place[x.v] || {}).name || x.v) + "</span>");
      else if (x.k === "treno") tags.push('<span class="tag">' + icon("train") + esc((IDX.train[x.v] || {}).route || x.v) + "</span>");
      else if (x.k === "alloggio") tags.push('<span class="tag">' + icon("bed") + esc((IDX.hotel[x.v] || {}).name || x.v) + "</span>");
      else if (x.k === "prenotare") tags.push('<span class="tag bad">da prenotare</span>');
      else if (x.k === "prenotato") tags.push('<span class="tag ok">' + (di && di.status === "paid" ? "pagato" : "prenotato") + "</span>");
      else if (x.k === "deposito" || x.k === "ritiro") tags.push('<span class="tag">' + icon("luggage") + "valigie: " + x.k + "</span>");
      else if (x.k === "città") tags.push('<span class="tag city" style="--c:' + cityVar(x.v) + '">→ ' + esc(CITY[x.v] || x.v) + "</span>");
      else if (x.k.indexOf("via") === 0) tags.push('<span class="tag">' + icon(x.k === "via piedi" ? "walk" : x.k === "via taxi" ? "taxi" : "tram") + esc((/\(([^)]+)\)\s*$/.exec(x.v) || [0, x.k])[1]) + "</span>");
      else if (x.k === "fuso") tags.push('<span class="tag">ora italiana</span>');
    });
    it.det.forEach(function (x) { if (x.indexOf("breve:") === 0) short = x.slice(6).trim(); });
    if (di && di.zone && ST.data.zones[di.zone]) tags.push('<span class="tag soft">' + icon("map") + esc(ST.data.zones[di.zone].name) + "</span>");
    if (di && di.group) tags.push('<span class="tag grp">' + icon("users") + "col gruppo</span>");
    var todos = di ? (di.todos || []).map(function (tid) { var t = IDX.todo[tid]; return t ? '<button class="tag ' + (t.done ? "ok" : "bad") + '" data-act="sel-todo" data-id="' + esc(tid) + '">' + icon(t.done ? "circle-check" : "alert") + esc(t.task) + "</button>" : ""; }).join("") : "";
    var bad = di && ((di.todos || []).some(function (tid) { return IDX.todo[tid] && !IDX.todo[tid].done; }) || (di.status === "todo" && !(di.todos || []).length));
    return '<div class="stop t-' + esc(it.k) + (on ? " sel" : "") + (bad ? " bad" : "") + (di && di.merged ? " leg" : "") + '" data-act="sel-stop" data-i="' + k + '">' +
      '<span class="st-t num">' + esc(it.t) + '</span><span class="st-k" title="' + esc((TYPE[it.k] || ["?"])[0]) + '">' + icon((TYPE[it.k] || [0, "info"])[1]) + "</span>" +
      '<div class="st-b"><b>' + esc(it.title) + "</b>" + (di && di.merged ? '<small class="leg-l">come arrivare alla tappa dopo</small>' : "") + (short ? "<small>" + esc(short) + "</small>" : "") +
      (tags.length || todos ? '<div class="tags">' + tags.join("") + todos + "</div>" : "") + "</div>" +
      '<div class="st-a"><button class="ib" data-act="mv-stop" data-i="' + k + '" data-d="-1" title="Sposta su">' + icon("up") + '</button><button class="ib" data-act="mv-stop" data-i="' + k + '" data-d="1" title="Sposta giù">' + icon("down") + "</button>" +
      '<button class="ib" data-act="dup-stop" data-i="' + k + '" title="Duplica">' + icon("copy") + '</button><button class="ib del" data-act="del-stop" data-i="' + k + '" title="Elimina">' + icon("trash") + "</button></div></div>";
  }
  function guideHtml(g) {
    var secs = GUIDE.filter(function (x) { return g && g[x[0]]; });
    if (!secs.length) return '<p class="muted">Nessun consiglio.</p>';
    return '<div class="guide">' + secs.map(function (x) {
      var lines = g[x[0]].split("\n").map(function (l) { return l.trim().replace(/^•\s*/, ""); }).filter(Boolean);
      return "<div><h3>" + esc(x[1]) + "</h3>" + (lines.length > 1 ? "<ul>" + lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : "<p>" + esc(lines[0] || "") + "</p>") + "</div>";
    }).join("") + "</div>";
  }

  // ----- da fare -----
  function viewTodo() {
    var D = ST.data, f = ST.filter.todo, q = norm(ST.filter.q.todo || "");
    var all = D.todo.slice().sort(function (a, b) { return todoKeyDate(a) < todoKeyDate(b) ? -1 : 1; });
    var open = all.filter(function (t) { return !t.done; }), done = all.filter(function (t) { return t.done; });
    var list = (f === "open" ? open : f === "done" ? done : all).filter(function (t) { return !q || norm(t.task + " " + t.note + " " + t.when).indexOf(q) >= 0; });
    var h = pageHead("Da prenotare o sistemare", "Ogni voce è agganciata a una tappa: sull'app compare lì come avviso rosso. «Fatto» qui vale per tutti e due i telefoni.",
      '<button class="btn go" data-act="new-entry" data-sec="Da fare">' + icon("plus") + "Nuova cosa da fare</button>");
    h += '<div class="toolbar"><div class="seg">' + [["open", "Aperte", open.length], ["done", "Fatte", done.length], ["all", "Tutte", all.length]].map(function (x) {
      return '<button data-act="filter" data-f="todo" data-v="' + x[0] + '"' + (f === x[0] ? ' class="on"' : "") + ">" + x[1] + " <b>" + x[2] + "</b></button>";
    }).join("") + '</div><input type="search" class="search-in" data-q="todo" placeholder="Filtra…" value="' + esc(ST.filter.q.todo || "") + '"></div>';
    h += '<table class="tbl"><thead><tr><th class="w-ck"></th><th>Cosa</th><th>Quando</th><th>Tappa</th><th>Prior.</th></tr></thead><tbody>';
    list.forEach(function (t) {
      var on = ST.sel && ST.sel.type === "entry" && ST.sel.key === "Da fare/" + t.id, gen = t.id.indexOf("klook-") === 0;
      h += '<tr class="' + (on ? "sel " : "") + (t.done ? "done" : "") + '" data-act="sel-todo" data-id="' + esc(t.id) + '"><td class="w-ck">' +
        (gen ? '<span class="ck gen" title="Generata da build.py dal treno: si gestisce sul telefono">' + icon("train") + "</span>" :
          '<button class="ck' + (t.done ? " on" : "") + '" data-act="toggle-done" data-id="' + esc(t.id) + '" title="' + (t.done ? "Riapri" : "Segna fatto") + '">' + icon("check") + "</button>") +
        '</td><td><span class="k ' + (t.kind === "prenotare" ? "bad" : "warn") + '"></span><b>' + esc(t.task) + "</b><small>" + esc([t.kind === "prenotare" ? "da prenotare" : "da sistemare", t.cost].filter(Boolean).join(" · ")) + "</small></td>" +
        "<td>" + todoPill(t) + "<small>" + esc(t.when || "") + "</small></td><td><small>" + esc(slotLabel(t)) + "</small></td><td><span class=\"prio " + esc(t.prio) + '">' + esc(t.prio) + "</span></td></tr>";
    });
    h += "</tbody></table>" + (list.length ? "" : '<p class="muted pad">Niente da mostrare.</p>');
    return h;
  }

  // ----- note -----
  function viewNotes() {
    var notes = ST.data.notes || [];
    var h = pageHead("Note e aggiornamenti", "Si pubblicano sul sito: l'app le mostra nel giorno scelto e nel menu «Note e aggiornamenti». Niente dati privati.",
      '<button class="btn go" data-act="new-note">' + icon("plus") + "Nuova nota</button>");
    if (!notes.length) return h + '<div class="empty small"><p>Ancora nessuna nota.</p><button class="btn go" data-act="new-note">Scrivi la prima</button></div>';
    h += '<div class="notes">' + notes.map(function (n) {
      var on = ST.sel && ST.sel.key === "Note/" + n.id;
      return '<article class="note' + (on ? " sel" : "") + '" data-act="sel-note" data-id="' + esc(n.id) + '"><header><b>' + esc(n.title || "Nota") + "</b><small>" + esc(n.when) +
        (n.day ? ' · <span class="tag">' + icon("cal") + esc(dShort(n.day)) + "</span>" : "") + "</small></header>" +
        (n.text ? n.text.split("\n").map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") : "") + "</article>";
    }).join("") + "</div>";
    return h;
  }

  // ----- sezioni a voci (alloggi, treni, voli, posti, zone, glossario) -----
  var COLS = {
    "Alloggi": [["Nome", function (e, x) { return "<b>" + esc(fieldOf(e, "nome")) + "</b><small>" + esc(x ? x.city + " · " + x.nights + (x.nights === 1 ? " notte" : " notti") : "") + "</small>"; }],
      ["Date", function (e) { return fieldOf(e, "dal") ? esc(dm(fieldOf(e, "dal")) + " → " + dm(fieldOf(e, "al"))) : ""; }], ["Prezzo", function (e) { return esc(fieldOf(e, "prezzo")); }],
      ["Pagato", function (e) { var p = fieldOf(e, "pagato"); return '<span class="pill ' + (p === "sì" ? "ok" : p === "gruppo" ? "grp" : "bad") + '">' + esc(p === "gruppo" ? "del gruppo" + (fieldOf(e, "saldato") === "sì" ? ", saldato" : "") : p) + "</span>"; }]],
    "Treni": [["Tratta", function (e) { return "<b>" + esc(fieldOf(e, "tratta")) + "</b><small>" + esc(fieldOf(e, "mezzo")) + "</small>"; }],
      ["Data", function (e) { return fieldOf(e, "data") ? esc(dShort(fieldOf(e, "data"))) + "<small>" + esc(fieldOf(e, "orario")) + "</small>" : ""; }],
      ["Prezzo", function (e) { return esc(fieldOf(e, "prezzo")); }], ["Stato", function (e) { var s = fieldOf(e, "stato"); return '<span class="pill ' + (s === "pagato" || s === "prenotato" ? "ok" : s === "da comprare" ? "bad" : "muted") + '">' + esc(s) + "</span>"; }]],
    "Posti": [["Nome", function (e) { return "<b>" + esc(fieldOf(e, "nome")) + "</b><small>" + esc(fieldOf(e, "tipo")) + "</small>"; }],
      ["Città", function (e) { var c = fieldOf(e, "città"); return '<span class="city" style="--c:' + cityVar(c) + '">' + esc(CITY[c] || c) + "</span>"; }],
      ["Giorno", function (e) { return esc(fieldOf(e, "giorno")); }], ["Usato", function (e) { var n = placeUse(e.id); return n.length ? n.map(function (x) { return '<span class="tag">' + esc(x) + "</span>"; }).join("") : '<span class="muted">mai</span>'; }]],
    "Zone": [["Zona", function (e) { return "<b>" + esc(fieldOf(e, "nome")) + "</b><small>" + esc(fieldOf(e, "cosa")) + "</small>"; }], ["Posti", function (e) { return "<small>" + esc(fieldOf(e, "posti")) + "</small>"; }]]
  };
  COLS["Voli"] = COLS["Treni"];
  COLS["Altre spese"] = [["Cosa", function (e) { return "<b>" + esc(fieldOf(e, "cosa")) + "</b><small>" + esc(fieldOf(e, "nota")) + "</small>"; }], ["Prezzo", function (e) { return esc(fieldOf(e, "prezzo")); }],
    ["Stato", function (e) { var s = fieldOf(e, "stato"); return '<span class="pill ' + (s === "pagato" ? "ok" : "bad") + '">' + esc(s) + "</span>"; }]];
  function placeUse(pid) {
    var out = [];
    ST.data.days.forEach(function (d) { if (d.items.some(function (it) { return it.place === pid; })) out.push(dShort(d.id)); });
    return out;
  }
  function viewSection(sec) {
    var bs = blocksOf(sec), q = norm(ST.filter.q[sec] || ""), intro = getBlock(sec + "/");
    var h = pageHead(esc(sec), intro ? esc(intro.lines.slice(1).join(" ").replace(/`/g, "").trim().slice(0, 260)) : "",
      (intro ? '<button class="btn" data-act="sel-block" data-key="' + esc(sec + "/") + '">' + icon("file") + "Descrizione</button>" : "") +
      '<button class="btn" data-act="sel" data-sel="raw-section" data-sec="' + esc(sec) + '">' + icon("file") + "Tutta la sezione come testo</button>" +
      '<button class="btn go" data-act="new-entry" data-sec="' + esc(sec) + '">' + icon("plus") + "Nuova voce</button>");
    h += '<div class="toolbar"><input type="search" class="search-in" data-q="' + esc(sec) + '" placeholder="Filtra ' + esc(sec.toLowerCase()) + '…" value="' + esc(ST.filter.q[sec] || "") + '"><span class="muted">' + bs.length + " voci</span></div>";
    var cols = COLS[sec];
    if (sec === "Glossario") {
      return h + bs.map(function (b) {
        var terms = b.lines.filter(function (l) { return /^- /.test(l); }).filter(function (l) { return !q || norm(l).indexOf(q) >= 0; });
        return '<section class="card click' + (ST.sel && ST.sel.key === b.key ? " sel" : "") + '" data-act="sel-block" data-key="' + esc(b.key) + '"><div class="card-h"><h2>' + esc(b.id) + '</h2><span class="muted">' + terms.length + " termini</span></div><dl class=\"gl\">" +
          terms.map(function (l) { var m = /^- (.+?):\s+(.+)$/.exec(l) || [0, l, ""]; return "<dt>" + esc(m[1]) + "</dt><dd>" + esc(m[2]) + "</dd>"; }).join("") + "</dl></section>";
      }).join("");
    }
    h += '<table class="tbl"><thead><tr><th>id</th>' + (cols || [["Contenuto"]]).map(function (c) { return "<th>" + c[0] + "</th>"; }).join("") + "</tr></thead><tbody>";
    bs.forEach(function (b) {
      if (q && norm(b.text).indexOf(q) < 0) return;
      var e = parseEntry(b.text), x = sec === "Alloggi" ? IDX.hotel[e.id] : null, on = ST.sel && ST.sel.key === b.key;
      h += '<tr class="' + (on ? "sel" : "") + '" data-act="sel-entry" data-key="' + esc(b.key) + '"><td><code>' + esc(e.id) + "</code></td>" +
        (cols ? cols.map(function (c) { return "<td>" + c[1](e, x) + "</td>"; }).join("") : "<td><small>" + esc(b.lines.slice(1).join(" · ").slice(0, 160)) + "</small></td>") + "</tr>";
    });
    return h + "</tbody></table>";
  }

  // ----- budget -----
  function budgetRows() {
    var b = getBlock("Budget/"); if (!b) return [];
    return b.lines.map(function (l) { var m = /^- (.+?):\s*([\d.]+)\s*(?:\|\s*(.*))?$/.exec(l.trim()); return m ? { item: m[1], eur: parseFloat(m[2]), note: (m[3] || "").trim() } : null; }).filter(Boolean);
  }
  function viewBudget() {
    var rows = budgetRows(), tot = rows.reduce(function (s, r) { return s + r.eur; }, 0), D = ST.data;
    var hotels = D.hotelsEach || 0, trains = D.trains.filter(function (t) { return t.status === "pagato" && t.eur; }).reduce(function (s, t) { return s + t.eur / 2; }, 0);
    var extras = (D.extras || []).filter(function (x) { return x.status === "pagato" && x.eur; }).reduce(function (s, x) { return s + x.eur / 2; }, 0);
    var h = pageHead("Soldi e budget", "Stima a persona in euro (sezione «Budget» di viaggio.md). I conti veri vengono da Alloggi, Treni e Altre spese.",
      '<button class="btn" data-act="sel-block" data-key="Budget/">' + icon("file") + "Testo</button>");
    h += '<div class="kpis">' + kpi(eur(tot), "stima a testa", "wallet") + kpi(eur(tot * 2), "stima per 2", "users") +
      kpi(eur(hotels + trains + extras), "già pagato a testa (alloggi, treni, extra)", "circle-check", "", "ok") + kpi(eur(Math.max(0, tot - hotels - trains - extras)), "ancora da spendere (stima)", "yen") + "</div>";
    h += '<form class="card budget" data-form="budget"><table class="tbl edit"><thead><tr><th>Voce</th><th class="r">€ a testa</th><th>Nota</th><th></th></tr></thead><tbody>' +
      rows.map(budgetRow).join("") + '</tbody><tfoot><tr><td><button type="button" class="lnk" data-act="budget-add">+ Aggiungi voce</button></td><td class="r num"><b>' + eur(tot) + '</b></td><td></td><td></td></tr></tfoot></table>' +
      '<div class="form-a"><button type="submit" class="btn go">Applica</button><span class="muted">Le modifiche vanno poi pubblicate.</span></div></form>';
    h += '<div class="cols two"><section class="card"><div class="card-h"><h2>' + icon("bed") + "Alloggi</h2></div>" + D.hotels.map(function (x) {
      return '<div class="kv"><span>' + esc(x.name) + "<small>" + esc(dm(x.in) + " → " + dm(x.out)) + "</small></span><b>" + esc(x.price || "") + "</b></div>";
    }).join("") + '<div class="kv tot"><span>Totale vero a testa</span><b>' + eur(hotels) + "</b></div></section>" +
      '<section class="card"><div class="card-h"><h2>' + icon("train") + "Treni pagati e altre spese</h2></div>" + D.trains.concat(D.extras || []).filter(function (t) { return t.eur; }).map(function (t) {
        return '<div class="kv"><span>' + esc(t.route || t.task) + "<small>" + esc(t.status) + "</small></span><b>" + esc(t.price) + "</b></div>";
      }).join("") + "</section></div>";
    return h;
  }
  function budgetRow(r) {
    return '<tr class="br"><td><input name="item" value="' + esc(r.item) + '"></td><td class="r"><input name="eur" type="number" step="1" min="0" class="num" value="' + esc(r.eur) + '"></td><td><input name="note" value="' + esc(r.note) + '"></td>' +
      '<td><button type="button" class="ib del" data-act="budget-del" title="Togli">' + icon("trash") + "</button></td></tr>";
  }

  // ----- testo (sezioni descrittive, file intero, modifiche, problemi) -----
  function viewText(sec) {
    var b = getBlock(sec + "/");
    if (!b) return pageHead(esc(sec), "Sezione non trovata.");
    return pageHead(esc(sec), sec === "Note per Claude" ? "Regole, cose già verificate e punti aperti: Claude le legge all'inizio di ogni chat." : "Testo così come sta in viaggio.md.") +
      '<form class="card" data-form="block" data-key="' + esc(b.key) + '"><textarea class="code tall" name="text" spellcheck="false">' + esc(b.lines.join("\n").replace(/\s+$/, "")) + "</textarea>" +
      '<div class="form-a"><button type="submit" class="btn go">Applica</button><span class="muted">Ctrl+Invio applica.</span></div></form>';
  }
  function viewRaw() {
    return pageHead("Tutto il file", "viaggio.md completo, per le modifiche fuori dagli schemi. «Applica» lo controlla subito con build.py.") +
      '<form class="card" data-form="raw"><textarea class="code full" name="text" spellcheck="false">' + esc(ST.work) + "</textarea>" +
      '<div class="form-a"><button type="submit" class="btn go">Applica</button><span class="muted">Ctrl+Invio applica.</span></div></form>';
  }
  function viewChanges() {
    var ch = ST.base ? changes(ST.base.text, ST.work) : [];
    var h = pageHead("Modifiche da pubblicare", ch.length ? "Rispetto a GitHub (commit " + esc(ST.base.commit.slice(0, 7)) + "). Restano salvate su questo PC finché non le pubblichi." : "Niente da pubblicare: è tutto uguale a GitHub.",
      ch.length ? '<button class="btn" data-act="discard-all">' + icon("undo") + 'Annulla tutto</button><button class="btn go" data-act="publish">' + icon("upload") + "Pubblica</button>" : "");
    return h + ch.map(function (c) {
      return '<section class="card"><div class="card-h"><h2>' + esc(blockLabel(c.key)) + ' <span class="pill ' + (c.kind === "add" ? "ok" : c.kind === "del" ? "bad" : "info") + '">' + { add: "nuova", del: "tolta", mod: "modificata" }[c.kind] + "</span></h2>" +
        '<button class="lnk" data-act="revert" data-key="' + esc(c.key) + '">Annulla questa modifica</button></div>' + diffHtml(c.base, c.mine) + "</section>";
    }).join("");
  }
  function viewProblems() {
    var b = ST.build;
    var h = pageHead("Controllo dei dati", W.failed ? "Python nel browser non si è caricato (" + esc(W.failed) + "): ricarica la pagina." : b.summary ? esc(b.summary) : "build.py controlla riferimenti, orari e campi.");
    function list(arr, cls, label) {
      if (!arr.length) return "";
      return '<section class="card"><div class="card-h"><h2>' + label + " (" + arr.length + ')</h2></div><div class="rows">' + arr.map(function (p) {
        var k = problemKey(p);
        return '<button class="rowb" ' + (k ? 'data-act="goto-key" data-key="' + esc(k) + '"' : "disabled") + '><span class="k ' + cls + '"></span><span class="rb-t"><b>' + esc(p) + "</b>" + (k ? "<small>" + esc(blockLabel(k)) + "</small>" : "") + "</span></button>";
      }).join("") + "</div></section>";
    }
    h += list(b.errors, "bad", "Errori: vanno corretti prima di pubblicare") + list(b.warnings, "warn", "Avvisi");
    if (!b.errors.length && !b.warnings.length && !W.failed) h += '<p class="banner ok">' + icon("circle-check") + "Tutto a posto.</p>";
    return h;
  }

  // ---------- pannello a destra: moduli di modifica e anteprima ----------
  function sideWanted() { return ST.sel && ST.data; }
  function renderSide() {
    var s = $("#side"); if (!s) return;
    document.body.classList.toggle("has-side", !!sideWanted());
    if (!sideWanted()) { s.innerHTML = ""; return; }
    var sel = ST.sel, h = "";
    try {
      if (sel.type === "preview") h = sidePreview();
      else if (sel.type === "stop") h = formStop(sel);
      else if (sel.type === "dayhead") h = formDayHead();
      else if (sel.type === "guide") h = formGuide();
      else if (sel.type === "raw-day") h = formBlock("Giorni/" + curDay(), "Testo del giorno " + dShort(curDay()));
      else if (sel.type === "raw-section") h = formSection(sel.sec);
      else if (sel.type === "entry") h = formEntry(sel.key);
      else if (sel.type === "new-entry") h = formEntry(null, sel.sec, sel.preset);
      else if (sel.type === "block") h = formBlock(sel.key, blockLabel(sel.key));
    } catch (e) { h = sideWrap("Errore", '<p class="banner bad">' + esc(e.message) + "</p>"); }
    s.innerHTML = h;
    s.scrollTop = 0;
    $$("textarea[name=dv]", s).forEach(function (x) { x.style.height = x.scrollHeight + 2 + "px"; });
    var first = $("#side [autofocus]"); if (first) first.focus();
    if (sel.type === "preview") setTimeout(sendPreview, 50);
  }
  function curDay() { return ST.view.indexOf("day:") === 0 ? ST.view.slice(4) : ST.sel && ST.sel.day; }
  function sideWrap(title, body, sub) {
    return '<div class="side-h"><div><h2>' + title + "</h2>" + (sub ? "<p>" + sub + "</p>" : "") + '</div><button class="ib" data-act="close-side" title="Chiudi (Esc)">' + icon("x") + "</button></div>" + body;
  }
  function formFoot(del) {
    return '<div class="form-a sticky"><button type="submit" class="btn go">Applica</button><button type="button" class="btn" data-act="close-side">Annulla</button>' +
      (del ? '<button type="button" class="btn danger" data-act="' + del + '">' + icon("trash") + "Elimina</button>" : "") + '<span class="muted">Ctrl+Invio</span></div>';
  }
  function opts(list, cur) { return list.map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o || "—"; return '<option value="' + esc(v) + '"' + (v === cur ? " selected" : "") + ">" + esc(l) + "</option>"; }).join(""); }
  function datalists() {
    var D = ST.data;
    return '<datalist id="dl-place">' + Object.keys(D.places).map(function (k) { return '<option value="' + esc(k) + '">' + esc(D.places[k].name + " · " + D.places[k].city) + "</option>"; }).join("") + "</datalist>" +
      '<datalist id="dl-hotel">' + D.hotels.map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.name) + "</option>"; }).join("") + "</datalist>" +
      '<datalist id="dl-train">' + D.trains.concat(D.flights || []).map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.route + " · " + (x.date || "")) + "</option>"; }).join("") + "</datalist>" +
      '<datalist id="dl-zone">' + Object.keys(D.zones).map(function (k) { return '<option value="' + esc(k) + '">' + esc(D.zones[k].name) + "</option>"; }).join("") + "</datalist>" +
      '<datalist id="dl-city">' + Object.keys(CITY).map(function (k) { return '<option value="' + k + '">' + CITY[k] + "</option>"; }).join("") + "</datalist>" +
      '<datalist id="dl-tz"><option value="roma">ora italiana</option></datalist>';
  }
  function sidePreview() {
    return sideWrap("Anteprima telefono", '<p class="muted">Com\'è l\'app con le modifiche di adesso (anche non pubblicate). Si aggiorna da sola a ogni modifica.</p>' +
      '<div class="phone"><iframe id="pv" src="index.html?anteprima=1" title="Anteprima dell\'app"></iframe></div>');
  }
  function sendPreview() {
    var f = $("#pv"); if (!f || !f.contentWindow || !ST.data) return;
    var d = curDay();
    f.contentWindow.postMessage({ type: "g26-data", data: ST.data, day: d && IDX.dayN[d] != null ? IDX.dayN[d] : 0 }, location.origin);
  }
  window.addEventListener("message", function (e) { if (e.origin === location.origin && e.data && e.data.type === "g26-ready") sendPreview(); });

  function formStop(sel) {
    var d = dayModel(sel.day); if (!d) return "";
    var it = sel.isNew ? { t: (d.items[sel.i - 1] || d.items[0] || { t: "12:00" }).t, k: "vedere", title: "", attrs: [], det: [] } : d.items[sel.i];
    if (!it) return sideWrap("Tappa", '<p class="muted">Tappa non trovata.</p>');
    if (it.raw != null) return formBlock("Giorni/" + sel.day, "Testo del giorno");
    var attrs = it.attrs.map(attrKey), det = it.det.map(function (x) { var m = KV_RE.exec(x); return m && DETAIL.some(function (d) { return d[0] === m[1]; }) ? { k: m[1], v: m[2] } : { k: "testo", v: x }; });
    var h = '<form data-form="stop" data-day="' + esc(sel.day) + '" data-i="' + sel.i + '"' + (sel.isNew ? ' data-new="1"' : "") + ">" + datalists() +
      '<div class="grid2"><label>Ora<input name="t" type="time" required value="' + esc(it.t) + '"></label>' +
      '<label>Tipo<select name="k">' + Object.keys(TYPE).map(function (k) { return '<option value="' + k + '"' + (k === it.k ? " selected" : "") + ">" + TYPE[k][0] + "</option>"; }).join("") + "</select></label></div>" +
      '<label>Titolo<input name="title" required autofocus value="' + esc(it.title) + '" placeholder="Solo il posto o la cosa, es. Kiyomizu-dera (tempio)"><small>Corto, con la spiegazione dei nomi giapponesi tra parentesi. Per «Spostamento» è la destinazione.</small></label>' +
      '<fieldset><legend>Attributi</legend><div class="rows-ed" data-list="attr">' + attrs.map(attrRow).join("") + '</div><button type="button" class="lnk" data-act="add-row" data-list="attr">+ attributo</button>' +
      "<small>posto/alloggio/treno = collegamento alle schede · «via» = indicazioni (DA &gt; A (etichetta), con #posto o @alloggio) · prenotare = rosso sull'app</small></fieldset>" +
      '<fieldset><legend>Dettagli (si aprono toccando la tappa)</legend><div class="rows-ed" data-list="det">' + det.map(detRow).join("") + '</div><button type="button" class="lnk" data-act="add-row" data-list="det">+ dettaglio</button>' +
      "<small>[[id]] nel testo = link a un posto.</small></fieldset>";
    var di = !sel.isNew && IDX.day[sel.day] ? IDX.day[sel.day].items.filter(function (x) { return !x.start; })[sel.i] : null;
    if (di && di.todos && di.todos.length) h += '<fieldset><legend>Cose da fare su questa tappa</legend>' + di.todos.map(function (tid) { var t = IDX.todo[tid]; return t ? '<button type="button" class="rowb" data-act="sel-todo" data-id="' + esc(tid) + '"><span class="k ' + (t.done ? "ok" : "bad") + '"></span><span class="rb-t"><b>' + esc(t.task) + "</b></span>" + todoPill(t) + "</button>" : ""; }).join("") + "</fieldset>";
    if (!sel.isNew) h += '<button type="button" class="lnk" data-act="new-entry" data-sec="Da fare" data-slot="' + esc(sel.day + " " + it.t) + '">+ cosa da prenotare o sistemare su questa tappa</button>';
    h += formFoot(sel.isNew ? "" : "del-stop-form") + "</form>";
    return sideWrap(sel.isNew ? "Nuova tappa" : "Tappa delle " + esc(it.t), h, esc(dLong(sel.day)));
  }
  function attrRow(a) {
    var x = ATTR.filter(function (y) { return y[0] === a.k; })[0] || ATTR[ATTR.length - 1], flag = x[2] === "flag";
    var dl = { place: "dl-place", hotel: "dl-hotel", train: "dl-train", city: "dl-city", zone: "dl-zone", tz: "dl-tz" }[x[2]];
    return '<div class="re"><select name="ak" data-act-change="attr-kind">' + opts(ATTR.map(function (y) { return y[0]; }), a.k) + "</select>" +
      '<input name="av" value="' + esc(a.v) + '"' + (dl ? ' list="' + dl + '"' : "") + (flag ? ' disabled placeholder="(nessun valore)"' : "") + (x[2] === "via" ? ' placeholder="#posto > @alloggio (etichetta)"' : "") + ">" +
      '<button type="button" class="ib del" data-act="del-row" title="Togli">' + icon("x") + "</button></div>";
  }
  function detRow(x) {
    return '<div class="re"><select name="dk">' + opts(DETAIL, x.k) + '</select><textarea name="dv" rows="1">' + esc(x.v) + "</textarea>" +
      '<button type="button" class="ib del" data-act="del-row" title="Togli">' + icon("x") + "</button></div>";
  }
  function readStop(f) {
    var attrs = [], det = [];
    $$('[data-list="attr"] .re', f).forEach(function (r) {
      var k = $("[name=ak]", r).value, v = $("[name=av]", r).value.trim(), x = ATTR.filter(function (y) { return y[0] === k; })[0];
      if (x[2] === "flag") attrs.push(x[1]); else if (v) attrs.push(x[1] + v);
    });
    $$('[data-list="det"] .re', f).forEach(function (r) {
      var k = $("[name=dk]", r).value, v = $("[name=dv]", r).value.replace(/\s*\n\s*/g, " ").trim();
      if (v) det.push(k === "testo" ? v : k + ": " + v);
    });
    var title = f.elements.title.value.replace(/\s*\|\s*/g, " / ").trim();
    return { t: f.t.value, k: f.k.value, title: title, attrs: attrs, det: det };
  }
  function formDayHead() {
    var id = curDay(), d = dayModel(id), dd = IDX.day[id];
    var h = '<form data-form="dayhead" data-day="' + esc(id) + '">' +
      '<label>Percorso<input name="percorso" value="' + esc(headOf(d, "percorso")) + '" placeholder="tokyo > kamakura > tokyo"><small>Città separate da &gt;: ' + Object.keys(CITY).join(", ") + ". Una città in mezzo = gita in giornata.</small></label>" +
      '<label>Si dorme<select name="dorme">' + opts([["volo", "In volo"]].concat(ST.data.hotels.map(function (x) { return [x.id, x.name + " (" + dm(x.in) + "–" + dm(x.out) + ")"]; })), headOf(d, "dorme")) + "</select></label>" +
      '<label>Con<input name="con" value="' + esc(headOf(d, "con")) + '" placeholder="voi due"></label>' +
      '<label>Col gruppo<input name="gruppo" value="' + esc(headOf(d, "gruppo")) + '" placeholder="vuoto, tutto, 14:00-, -18:20 o 06:35-18:20"><small>Quando siete insieme al gruppo: fascia rosa sull\'app.</small></label>' +
      '<label>Orari<select name="fuso">' + opts([["", "ora di Tokyo"], ["roma", "ora italiana"]], headOf(d, "fuso")) + "</select></label>" +
      '<div class="tools"><button type="button" class="btn small" data-act="sort-stops">Riordina le tappe per orario</button></div>' +
      formFoot() + "</form>";
    return sideWrap("Intestazione del giorno", h, esc(dLong(id)) + (dd ? " · giorno " + dd.n : ""));
  }
  function formGuide() {
    var id = curDay(), d = dayModel(id), g = {};
    d.guide.forEach(function (x) { g[x.k] = [x.first].concat(x.more).filter(Boolean).join("\n"); });
    var h = '<form data-form="guide" data-day="' + esc(id) + '"><p class="muted">Un punto per riga, che inizia con «•». Testo semplice, nomi giapponesi spiegati tra parentesi.</p>' +
      GUIDE.map(function (x) { return "<label>" + x[1] + '<textarea name="' + x[0] + '" rows="' + Math.max(2, (g[x[0]] || "").split("\n").length + 1) + '">' + esc(g[x[0]] || "") + "</textarea></label>"; }).join("") + formFoot() + "</form>";
    return sideWrap("Consigli per la giornata", h, esc(dLong(id)));
  }
  function formBlock(key, title) {
    var b = getBlock(key);
    if (!b) return sideWrap(esc(title), '<p class="muted">Non trovato.</p>');
    return sideWrap(esc(title), '<form data-form="block" data-key="' + esc(key) + '"><textarea class="code" name="text" spellcheck="false" autofocus>' + esc(b.lines.join("\n").replace(/\s+$/, "")) + "</textarea>" +
      formFoot(key.indexOf("Giorni/") === 0 || !b.id ? "" : "del-block") + "</form>", "Testo di viaggio.md");
  }
  function formSection(sec) {
    return sideWrap("Sezione «" + esc(sec) + "»", '<form data-form="section" data-sec="' + esc(sec) + '"><textarea class="code" name="text" spellcheck="false">' + esc(sectionText(sec).replace(/\s+$/, "")) + "</textarea>" + formFoot() + "</form>", "Testo di viaggio.md");
  }
  function formEntry(key, sec, preset) {
    var e, isNew = !key;
    if (isNew) { e = { id: (preset && preset.__id) || "", fields: [], extra: [] }; Object.keys(preset || {}).forEach(function (k) { if (k !== "__id") setField(e, k, preset[k]); }); }
    else { var b = getBlock(key); if (!b) return sideWrap("Voce", '<p class="muted">Non trovata.</p>'); e = parseEntry(b.text); sec = b.sec; }
    var schema = SCHEMA[sec];
    if (!schema) return formBlock(key, blockLabel(key));
    if (!isNew && serializeEntry(e).replace(/\s+$/, "") !== getBlock(key).text.replace(/\s+$/, "")) {
      return formBlock(key, blockLabel(key)).replace("</h2>", ' <span class="pill warn">come testo</span></h2>');
    }
    var known = {}, h = '<form data-form="entry" data-sec="' + esc(sec) + '"' + (isNew ? ' data-new="1"' : ' data-key="' + esc(key) + '"') + ">" + datalists();
    h += '<label>id<input name="__id" required pattern="[a-z0-9\\-]+" value="' + esc(e.id) + '"' + (isNew ? " autofocus" : "") + ' placeholder="minuscole-con-trattini"><small>Identificativo usato nei collegamenti' + (isNew ? "" : ": se lo cambi, aggiorna anche dove è usato") + ".</small></label>";
    schema.forEach(function (s) {
      var k = s[0], type = s[1] || "text", f = e.fields.filter(function (x) { return x.k === k; })[0], v = f ? f.v : "";
      known[k] = 1;
      h += fieldHtml(k, type, v, s[2], f ? f.more : []);
    });
    var extra = e.fields.filter(function (x) { return !known[x.k]; });
    if (extra.length) h += '<fieldset><legend>Altri campi</legend>' + extra.map(function (x) { return '<label>' + esc(x.k) + '<input name="x:' + esc(x.k) + '" value="' + esc(x.v) + '"></label>'; }).join("") + "</fieldset>";
    if (e.extra.length) h += '<label>Altre righe<textarea name="__extra" class="code" rows="3">' + esc(e.extra.join("\n")) + "</textarea></label>";
    if (sec === "Da fare" && !isNew) {
      var t = IDX.todo[e.id];
      h += '<div class="tools">' + (fieldOf(e, "fatto") ? '<button type="button" class="btn small" data-act="toggle-done" data-id="' + esc(e.id) + '">Riapri</button>' :
        '<button type="button" class="btn small ok" data-act="toggle-done" data-id="' + esc(e.id) + '">' + icon("check") + "Segna fatta oggi</button>") +
        (t && t.at && t.at[0] ? '<button type="button" class="btn small" data-go="day:' + ST.data.days[t.at[0].d].id + '">Vai alla tappa</button>' : "") + "</div>";
    }
    h += formFoot(isNew ? "" : "del-block") + "</form>";
    var title = isNew ? (sec === "Note" ? "Nuova nota" : sec === "Da fare" ? "Nuova cosa da fare" : "Nuova voce · " + esc(sec)) : esc(blockLabel(key));
    return sideWrap(title, h, isNew ? "" : "viaggio.md › " + esc(sec) + " › " + esc(e.id));
  }
  function fieldHtml(k, type, v, help, more) {
    var lab = esc(k.charAt(0).toUpperCase() + k.slice(1)), hint = help || FIELD_HELP[k] || "", n = "f:" + k, inp;
    if (type === "date") inp = '<input type="date" name="' + n + '" value="' + esc(v) + '">';
    else if (type === "num") inp = '<input type="number" step="0.01" name="' + n + '" value="' + esc(v) + '">';
    else if (type === "sel") inp = '<select name="' + n + '">' + opts(help.indexOf(v) >= 0 ? help : help.concat([v]), v) + "</select>", hint = "";
    else if (type === "city") inp = '<select name="' + n + '">' + opts([""].concat(Object.keys(CITY)).map(function (c) { return [c, CITY[c] || "—"]; }), v) + "</select>";
    else if (type === "day") inp = '<select name="' + n + '">' + opts([["", "—"]].concat(ST.data.days.map(function (d) { return [d.id, dShort(d.id) + " · " + d.route.map(function (r) { return CITY[r]; }).join(" › ")]; })), v) + "</select>";
    else if (type === "area") inp = '<textarea name="' + n + '" rows="3">' + esc(v) + "</textarea>";
    else if (type === "multi") inp = '<textarea name="' + n + '" rows="6">' + esc([v].concat(more || []).filter(Boolean).join("\n")) + "</textarea>", hint = hint || "Puoi andare a capo: ogni riga diventa un paragrafo sull'app.";
    else if (type === "url") inp = '<input type="url" name="' + n + '" value="' + esc(v) + '" placeholder="https://…">';
    else if (type === "links") return linksHtml(v);
    else if (type === "slots") return slotsHtml(v);
    else inp = '<input name="' + n + '" value="' + esc(v) + '">';
    var half = /^(date|num|sel|city|day)$/.test(type) && !hint;
    return "<label" + (half ? ' class="half"' : "") + ">" + lab + inp + (hint ? "<small>" + esc(hint) + "</small>" : "") + "</label>";
  }
  function linksHtml(v) {
    var list = String(v || "").split(" ; ").map(function (p) { p = p.trim(); if (!p) return null; var i = p.lastIndexOf(" = "); return i >= 0 ? { l: p.slice(0, i), u: p.slice(i + 3) } : { l: "", u: p }; }).filter(Boolean);
    return '<fieldset><legend>Link (il primo è il pulsante principale)</legend><div class="rows-ed" data-list="link">' + list.map(linkRow).join("") +
      '</div><button type="button" class="lnk" data-act="add-row" data-list="link">+ link</button></fieldset>';
  }
  function linkRow(x) {
    return '<div class="re"><input name="ll" placeholder="Etichetta, es. Prenota" value="' + esc(x.l) + '"><input name="lu" placeholder="https://… o tel:+81…" value="' + esc(x.u) + '">' +
      '<button type="button" class="ib del" data-act="del-row" title="Togli">' + icon("x") + "</button></div>";
  }
  function allSlots() {
    var out = [];
    ST.data.days.forEach(function (d) { d.items.forEach(function (it) { if (!it.merged && !it.start) out.push([d.id + " " + it.t, dShort(d.id) + " " + it.t + " · " + it.title]); }); });
    return out;
  }
  function slotsHtml(v) {
    var cur = String(v || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean), all = allSlots();
    return '<fieldset><legend>Tappe a cui si riferisce</legend><div class="rows-ed" data-list="slot">' + cur.map(function (s) { return slotRow(s, all); }).join("") +
      '</div><button type="button" class="lnk" data-act="add-row" data-list="slot">+ tappa</button><small>' + esc(FIELD_HELP.tappa) + ". Senza tappa finisce sulla partenza.</small></fieldset>";
  }
  function slotRow(s, all) {
    all = all || allSlots();
    var has = all.some(function (x) { return x[0] === s; });
    return '<div class="re"><select name="slot">' + opts((has || !s ? [] : [[s, s + " (non trovata)"]]).concat(all), s) + '</select><button type="button" class="ib del" data-act="del-row" title="Togli">' + icon("x") + "</button></div>";
  }

  function applyForm(f) {
    var kind = f.dataset.form;
    if (kind === "stop") {
      var d = dayModel(f.dataset.day), i = +f.dataset.i, it = readStop(f);
      if (!/^\d{2}:\d{2}$/.test(it.t) || !it.title) { toast("Servono ora e titolo", true); return; }
      if (f.dataset.new) d.items.splice(i, 0, it); else d.items[i] = it;
      saveDay(d); ST.formDirty = false;
      ST.sel = { type: "stop", day: d.id, i: i }; renderSide(); toast(f.dataset.new ? "Tappa aggiunta" : "Tappa aggiornata");
    } else if (kind === "dayhead") {
      var dh = dayModel(f.dataset.day);
      ["percorso", "dorme", "con", "gruppo", "fuso"].forEach(function (k) { setHead(dh, k, f[k].value.trim()); });
      saveDay(dh); ST.formDirty = false; toast("Giorno aggiornato");
    } else if (kind === "guide") {
      var dg = dayModel(f.dataset.day), old = {};
      dg.guide.forEach(function (g) { old[g.k] = g; });
      dg.guide = GUIDE.map(function (x) {
        var lines = f[x[0]].value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
        if (!lines.length) return null;
        var o = old[x[0]];
        if (o && [o.first].concat(o.more).filter(Boolean).join("\n") === lines.join("\n")) return o;
        if (lines.length === 1) return { k: x[0], first: lines[0], more: [] };
        return lines[0].indexOf("•") === 0 ? { k: x[0], first: "", more: lines } : { k: x[0], first: lines[0], more: lines.slice(1) };
      }).filter(Boolean);
      dg.guide = dg.guide.concat(Object.keys(old).filter(function (k) { return !GUIDE.some(function (x) { return x[0] === k; }); }).map(function (k) { return old[k]; }));
      dg.hasGuide = dg.hasGuide || dg.guide.length > 0;
      saveDay(dg); ST.formDirty = false; toast("Consigli aggiornati");
    } else if (kind === "block") {
      var key = f.dataset.key, txt = f.elements.text.value;
      if (key.indexOf("/") > 0 && key.split("/")[1] && !/^### /.test(txt.trim())) { toast("La voce deve iniziare con «### id»", true); return; }
      setBlock(key, txt); ST.formDirty = false; toast("Testo applicato");
      if (ST.sel && ST.sel.type === "block") { var nb = splitBlocks(ST.work).filter(function (b) { return b.text.replace(/\s+$/, "") === txt.replace(/\s+$/, ""); })[0]; if (nb) ST.sel.key = nb.key; }
    } else if (kind === "section") {
      setSectionText(f.dataset.sec, f.elements.text.value); ST.formDirty = false; toast("Sezione applicata");
    } else if (kind === "raw") {
      var t = f.elements.text.value; if (!/\n$/.test(t)) t += "\n";
      setWork(t, "quiet"); ST.formDirty = false; toast("File applicato: controllo in corso");
    } else if (kind === "budget") {
      var b = getBlock("Budget/"), rows = $$(".br", f).map(function (r) {
        var it = $("[name=item]", r).value.replace(/:/g, " ").trim(), e = $("[name=eur]", r).value.trim(), n = $("[name=note]", r).value.trim();
        return it && e !== "" ? "- " + it + ": " + Math.round(+e) + (n ? " | " + n : "") : null;
      }).filter(Boolean);
      var head = [], seen = false;
      b.lines.forEach(function (l) { if (/^- .+:\s*[\d.]+/.test(l.trim())) seen = true; else if (!seen) head.push(l); });
      while (head.length && !head[head.length - 1].trim()) head.pop();
      setBlock("Budget/", head.concat([""], rows).join("\n")); toast("Budget aggiornato");
    } else if (kind === "entry") {
      applyEntry(f);
    }
    renderStatus();
  }
  function applyEntry(f) {
    var sec = f.dataset.sec, isNew = !!f.dataset.new, id = f.__id.value.trim();
    if (!/^[a-z0-9-]+$/.test(id)) { toast("id: solo minuscole, numeri e trattini", true); return; }
    var e = isNew ? { id: id, fields: [], extra: [] } : parseEntry(getBlock(f.dataset.key).text);
    if ((isNew || id !== e.id) && getBlock(sec + "/" + id)) { toast("Esiste già una voce «" + id + "»", true); return; }
    e.id = id;
    (SCHEMA[sec] || []).forEach(function (s) {
      var k = s[0], type = s[1] || "text";
      if (type === "links") {
        setField(e, k, $$('[data-list="link"] .re', f).map(function (r) { var l = $("[name=ll]", r).value.replace(/ ; | = /g, " ").trim(), u = $("[name=lu]", r).value.trim(); return u ? (l ? l + " = " + u : u) : null; }).filter(Boolean).join(" ; "));
      } else if (type === "slots") {
        var seen = {};
        setField(e, k, $$('[data-list="slot"] [name=slot]', f).map(function (s) { return s.value; }).filter(function (s) { if (!s || seen[s]) return false; seen[s] = 1; return true; }).join(", "));
      } else if (type === "multi") {
        var L = f["f:" + k].value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
        setField(e, k, L[0] || "", L.slice(1));
      } else {
        var el = f["f:" + k]; if (!el) return;
        setField(e, k, el.value.replace(/\s*\n\s*/g, " ").trim());
      }
    });
    $$("[name^='x:']", f).forEach(function (el) { setField(e, el.name.slice(2), el.value.trim()); });
    if (f.__extra) e.extra = f.__extra.value.split("\n").filter(function (l) { return l.trim(); });
    if (sec === "Note" && !fieldOf(e, "data")) setField(e, "data", nowRome());
    var txt = serializeEntry(e);
    if (isNew) {
      if (sec === "Note") ensureSection("Note", NOTE_INTRO, "Altre spese");
      if (!insertBlock(sec, txt)) { toast("Sezione «" + sec + "» non trovata", true); return; }
    } else setBlock(f.dataset.key, txt);
    ST.formDirty = false;
    ST.sel = { type: "entry", key: sec + "/" + id };
    renderSide(); renderMain(true);
    toast(isNew ? "Aggiunto" : "Aggiornato");
  }

  // ---------- pubblicazione ----------
  function privacyHits(ch) {
    var hits = [];
    ch.forEach(function (c) {
      var old = {}; c.base.split("\n").forEach(function (l) { old[l] = 1; });
      c.mine.split("\n").forEach(function (l) { if (old[l] || !l.trim()) return; PRIV.forEach(function (p) { if (p[0].test(l.replace(/tel:\+?\d+/g, ""))) hits.push({ key: c.key, line: l, why: p[1] }); }); });
    });
    return hits;
  }
  function defaultMessage(ch) {
    var labels = ch.map(function (c) { return blockLabel(c.key); });
    var s = "Back office: " + labels.slice(0, 3).join(", ") + (labels.length > 3 ? " e altre " + (labels.length - 3) : "");
    return s.length > 120 ? s.slice(0, 117) + "…" : s;
  }
  function openPublish() {
    if (!confirmLeaveForm()) return;
    var ch = changes(ST.base.text, ST.work);
    if (!ch.length) { toast("Niente da pubblicare"); return; }
    if (!token()) { openToken(true); return; }
    var hits = privacyHits(ch), b = ST.build, ready = !b.busy && b.code === 0 && b.text === ST.work;
    var h = '<form data-form="publish"><h2>' + icon("upload") + "Pubblica " + ch.length + (ch.length === 1 ? " modifica" : " modifiche") + "</h2>" +
      '<p class="muted">Un commit su <b>main</b> con viaggio.md e data.json rigenerato. Il sito si aggiorna in un minuto, i telefoni alla prossima apertura.</p>';
    if (W.failed) h += '<p class="banner bad">' + icon("alert") + "Python nel browser non si è caricato: non posso rigenerare data.json. Ricarica la pagina e riprova.</p>";
    else if (b.errors.length) h += '<div class="banner bad">' + icon("alert") + "<div><b>Ci sono errori: correggili prima.</b><ul>" + b.errors.slice(0, 6).map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div></div>";
    else if (!ready) h += '<p class="banner">' + '<span class="spin"></span>Controllo in corso…</p>';
    else h += '<p class="banner ok">' + icon("circle-check") + "Dati controllati: " + esc(b.summary) + (b.warnings.length ? " · " + b.warnings.length + " avvisi" : "") + "</p>";
    if (hits.length) h += '<div class="banner warn">' + icon("alert") + "<div><b>Il sito è pubblico: controlla queste righe.</b><ul>" + hits.slice(0, 8).map(function (x) { return "<li><code>" + esc(x.line.trim().slice(0, 110)) + "</code> — " + esc(x.why) + "</li>"; }).join("") +
      '</ul><label class="ck-l"><input type="checkbox" name="privok"> Ho controllato: niente codici, PIN, passaporti o dati di pagamento</label></div></div>';
    h += '<label>Descrizione del commit<input name="msg" value="' + esc(defaultMessage(ch)) + '" maxlength="200"></label>' +
      '<details><summary>Vedi le modifiche (' + ch.length + ")</summary>" + ch.map(function (c) { return "<h3>" + esc(blockLabel(c.key)) + "</h3>" + diffHtml(c.base, c.mine); }).join("") + "</details>" +
      '<div class="form-a"><button type="submit" class="btn go"' + (b.errors.length || W.failed ? " disabled" : "") + ">" + icon("upload") + 'Pubblica</button><button type="button" class="btn" data-act="close-modal">Annulla</button></div></form>';
    modal(h, "wide");
  }
  function publish(f) {
    if (f.privok && !f.privok.checked) { toast("Spunta il controllo dei dati privati", true); return; }
    var msg = (f.msg.value.trim() || defaultMessage(changes(ST.base.text, ST.work))) + "\n\nPubblicato dal back office (admin.html).";
    var btn = $("button[type=submit]", f); btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Pubblico…';
    doPublish(msg, 0).then(function (ok) {
      if (!ok) { btn.disabled = false; btn.innerHTML = icon("upload") + "Pubblica"; return; }
      closeModal(); toast("Pubblicato su GitHub: il sito si aggiorna in un minuto");
      loadCommits().then(function () { if (ST.view === "home") renderMain(true); });
    }).catch(function (e) {
      btn.disabled = false; btn.innerHTML = icon("upload") + "Riprova";
      toast("Non pubblicato: " + (e.status === 403 || e.status === 404 ? "il token non può scrivere in questo repository (serve «Contents: Read and write»)" : e.message), true);
    });
  }
  function doPublish(msg, attempt) {
    return fetchRemote().then(function (remote) {
      var text = ST.work;
      if (remote.sha !== ST.base.sha) {
        var r = rebase(ST.base.text, ST.work, remote.text);
        if (r.conflicts.length) { closeModal(); openConflicts(r.conflicts, remote); return false; }
        text = r.text;
        toast("Su GitHub c'era una versione più nuova: unita alle tue modifiche");
      }
      ST.base.build = remote.build;
      return runBuild(text).then(function (m) {
        var p = parseOut(m.out);
        if (m.code !== 0 || !m.data) {
          ST.base = remote; ST.work = text; saveDraft(); scheduleBuild(); renderStatus(); renderMain(true);
          toast("Dopo l'unione con GitHub ci sono errori: " + (p.errors[0] || "controlla"), true);
          return false;
        }
        return gh("/git/commits/" + remote.commit).then(function (c) {
          return gh("/git/trees", { method: "POST", body: { base_tree: c.tree.sha, tree: [
            { path: "viaggio.md", mode: "100644", type: "blob", content: text },
            { path: "data.json", mode: "100644", type: "blob", content: m.data }] } });
        }).then(function (tree) {
          var vm = tree.tree.filter(function (x) { return x.path === "viaggio.md"; })[0];
          return gh("/git/commits", { method: "POST", body: { message: msg, tree: tree.sha, parents: [remote.commit] } }).then(function (nc) {
            return gh("/git/refs/heads/" + GH.branch, { method: "PATCH", body: { sha: nc.sha, force: false } }).then(function () {
              ST.base = { commit: nc.sha, sha: vm ? vm.sha : remote.sha, text: text, build: remote.build };
              ST.work = text; LS.set("draft", null);
              useData(JSON.parse(m.data), text, m.data);
              ST.build = { busy: false, code: 0, errors: [], warnings: p.warnings, summary: p.summary, text: text };
              renderStatus(); renderMain(true); renderSide();
              return true;
            });
          });
        }).catch(function (e) {
          if ((e.status === 422 || e.status === 409) && attempt < 1) return doPublish(msg, attempt + 1); // qualcuno ha pubblicato nel frattempo
          throw e;
        });
      });
    });
  }
  function openConflicts(list, remote) {
    var h = '<form data-form="conflicts"><h2>' + icon("alert") + "Stesse voci cambiate anche su GitHub</h2>" +
      '<p class="muted">Mentre lavoravi qui, qualcuno (o Claude dalla chat) ha cambiato le stesse voci. Scegli quale versione tenere per ognuna.</p>' +
      list.map(function (c, i) {
        return '<section class="card"><div class="card-h"><h2>' + esc(blockLabel(c.key)) + '</h2></div><div class="grid2"><div><h3>La tua versione</h3>' + diffHtml(c.base, c.mine) +
          '<label class="ck-l"><input type="radio" name="c' + i + '" value="mine" checked> Tieni la mia</label></div><div><h3>Su GitHub</h3>' + diffHtml(c.base, c.theirs || "") +
          '<label class="ck-l"><input type="radio" name="c' + i + '" value="theirs"> Tieni quella su GitHub</label></div></div></section>';
      }).join("") + '<div class="form-a"><button type="submit" class="btn go">Unisci</button><button type="button" class="btn" data-act="close-modal">Più tardi</button></div></form>';
    modal(h, "wide");
    PENDING_CONFLICT = { list: list, remote: remote };
  }
  var PENDING_CONFLICT = null;
  function resolveConflicts(f) {
    var pc = PENDING_CONFLICT; if (!pc) return closeModal();
    var keep = {};
    pc.list.forEach(function (c, i) { keep[c.key] = (f["c" + i].value || "mine"); });
    var r = rebase(ST.base.text, ST.work, pc.remote.text, keep);
    ST.base = pc.remote; ST.work = r.text; PENDING_CONFLICT = null;
    saveDraft(); scheduleBuild(); closeModal(); renderStatus(); renderMain(true); renderSide();
    toast("Unito: controlla e poi pubblica");
  }

  // ---------- accesso a GitHub ----------
  function openToken(thenPublish) {
    var t = token(), remember = (function () { try { return !!localStorage.getItem("g26a:token"); } catch (e) { return false; } })();
    var h = '<form data-form="token"' + (thenPublish ? ' data-then="publish"' : "") + "><h2>" + icon("key") + "Accesso a GitHub</h2>" +
      "<p>Per pubblicare serve un <b>token</b> di GitHub che può scrivere solo in questo repository. Resta su questo computer: non va nel sito né in viaggio.md.</p>" +
      '<ol class="steps"><li>Apri <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">GitHub › Fine-grained token</a>.</li>' +
      "<li>Nome: «Back office Giappone». Scadenza: fine novembre 2026.</li><li>Repository access: <b>Only select repositories</b> › <code>" + GH.owner + "/" + GH.repo + "</code>.</li>" +
      "<li>Permissions › Repository › <b>Contents: Read and write</b> (il resto lascialo com'è).</li><li>Genera e incolla qui sotto.</li></ol>" +
      '<label>Token<input name="tok" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" value="' + esc(t) + '"></label>' +
      '<label class="ck-l"><input type="checkbox" name="remember"' + (remember || !t ? " checked" : "") + "> Ricorda su questo computer (altrimenti fino alla chiusura della scheda)</label>" +
      '<p class="tok-st muted"></p><div class="form-a"><button type="submit" class="btn go">Verifica e salva</button>' + (t ? '<button type="button" class="btn danger" data-act="forget-token">Dimentica il token</button>' : "") +
      '<button type="button" class="btn" data-act="close-modal">Chiudi</button></div></form>';
    modal(h);
  }
  function saveTokenForm(f) {
    var t = f.tok.value.trim(), st = $(".tok-st", f);
    if (!t) { toast("Incolla il token", true); return; }
    st.innerHTML = '<span class="spin"></span>Verifico…';
    gh("", { token: t }).then(function (r) {
      if (!r.permissions || !r.permissions.push) throw new Error("il token può leggere ma non scrivere: serve «Contents: Read and write»");
      setToken(t, f.remember.checked);
      st.innerHTML = icon("circle-check") + " Ok: puoi pubblicare.";
      toast("Token salvato");
      setTimeout(function () { closeModal(); if (f.dataset.then === "publish") openPublish(); }, 500);
    }).catch(function (e) { st.textContent = "Non va: " + e.message; st.className = "tok-st bad"; });
  }

  // ---------- finestre ----------
  function modal(html, cls) {
    closeModal();
    var m = document.createElement("div"); m.id = "modal"; m.className = "modal-bg";
    m.innerHTML = '<div class="modal ' + (cls || "") + '" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(m);
    var inp = $("#modal input:not([type=checkbox]):not([type=radio])"); if (inp) inp.focus();
  }
  function closeModal() { var m = $("#modal"); if (m) m.remove(); }

  // ---------- ricerca globale ----------
  function search(q) {
    var n = norm(q).trim(), out = [];
    if (n.length < 2) return out;
    var words = n.split(/\s+/);
    splitBlocks(ST.work).forEach(function (b) {
      if (!b.sec || ["Sintassi"].indexOf(b.sec) >= 0) return;
      b.lines.forEach(function (l, i) {
        var nl = norm(l);
        if (words.every(function (w) { return nl.indexOf(w) >= 0; })) out.push({ key: b.key, line: l.trim(), li: i });
      });
    });
    return out.slice(0, 40);
  }
  function renderSearch(q) {
    var box = $("#sres"), r = search(q);
    if (!q || norm(q).trim().length < 2) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = r.length ? r.map(function (x, i) {
      return '<button class="sr' + (i === 0 ? " on" : "") + '" data-act="goto-key" data-key="' + esc(x.key) + '" data-line="' + esc(x.line) + '"><b>' + esc(blockLabel(x.key)) + "</b><small>" + esc(x.line.slice(0, 140)) + "</small></button>";
    }).join("") : '<p class="muted pad">Niente.</p>';
  }
  function gotoKey(key, line) {
    var sec = key.split("/")[0], id = key.slice(sec.length + 1).replace(/#\d+$/, "");
    $("#sres").hidden = true;
    if (sec === "Giorni" && id) {
      var d = dayModel(id), idx = -1;
      if (d && line) d.items.forEach(function (it, i) { if (idx < 0 && (itemLine(it).trim() === line || it.det.some(function (x) { return x === line; }))) idx = i; });
      go("day:" + id, idx >= 0 ? { type: "stop", day: id, i: idx } : null);
      if (idx >= 0) setTimeout(function () { var el = $('.stop[data-i="' + idx + '"]'); if (el) el.scrollIntoView({ block: "center" }); }, 30);
    } else if (sec === "Note" && id) go("notes", { type: "entry", key: key });
    else if (sec === "Da fare" && id) go("todo", { type: "entry", key: key });
    else if (SCHEMA[sec] && id) go("sec:" + sec, { type: "entry", key: key });
    else if (["Note per Claude", "Info", "Sintassi"].indexOf(sec) >= 0) go("text:" + sec);
    else if (sec === "Budget") go("budget");
    else if (id) go("sec:" + sec, { type: "block", key: key });
    else go("sec:" + sec, { type: "block", key: key });
  }

  // ---------- eventi ----------
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-go],[data-act]");
    if (!t) { if (!ev.target.closest(".search")) { var sr = $("#sres"); if (sr) sr.hidden = true; } return; }
    if (t.hasAttribute("disabled")) return;
    var ds = t.dataset, a = ds.act;
    if (ds.go && !a) { ev.preventDefault(); go(ds.go); return; }
    if (t.closest("a[href]") && !a) return;
    if (!a) return;
    ev.stopPropagation();
    var day = curDay();
    if (a === "sel") {
      var map = { preview: { type: "preview", day: day }, "raw-day": { type: "raw-day", day: day }, dayhead: { type: "dayhead", day: day }, guide: { type: "guide", day: day }, "raw-section": { type: "raw-section", sec: ds.sec } };
      select(map[ds.sel]);
    } else if (a === "sel-stop") { if (ev.target.closest(".tag[data-act]")) return; select({ type: "stop", day: day, i: +ds.i }); }
    else if (a === "new-stop") select({ type: "stop", day: day, i: +ds.i, isNew: true });
    else if (a === "mv-stop" || a === "dup-stop" || a === "del-stop" || a === "del-stop-form") {
      var i = a === "del-stop-form" ? ST.sel.i : +ds.i, d = dayModel(day);
      if (a === "mv-stop") { var j = i + +ds.d; if (j < 0 || j >= d.items.length) return; var x = d.items[i]; d.items[i] = d.items[j]; d.items[j] = x; if (ST.sel && ST.sel.i === i) ST.sel.i = j; }
      else if (a === "dup-stop") { d.items.splice(i + 1, 0, JSON.parse(JSON.stringify(d.items[i]))); }
      else { if (!confirm("Eliminare la tappa «" + (d.items[i].title || "") + "»?")) return; d.items.splice(i, 1); if (ST.sel && ST.sel.type === "stop") ST.sel = null; ST.formDirty = false; renderSide(); }
      saveDay(d);
    } else if (a === "sort-stops") {
      var ds2 = dayModel(day); ds2.items = ds2.items.map(function (it, k) { return [it, k]; }).sort(function (p, q) { return p[0].t < q[0].t ? -1 : p[0].t > q[0].t ? 1 : p[1] - q[1]; }).map(function (p) { return p[0]; });
      saveDay(ds2); toast("Tappe in ordine di orario");
    } else if (a === "sel-todo") { ev.preventDefault(); if (ds.id.indexOf("klook-") === 0) { toast("Questa la genera build.py dal treno: si spunta sul telefono"); return; } if (ST.view !== "todo") go("todo", { type: "entry", key: "Da fare/" + ds.id }); else select({ type: "entry", key: "Da fare/" + ds.id }); }
    else if (a === "sel-note") { if (ST.view !== "notes") go("notes", { type: "entry", key: "Note/" + ds.id }); else select({ type: "entry", key: "Note/" + ds.id }); }
    else if (a === "sel-entry") select({ type: "entry", key: ds.key });
    else if (a === "sel-block") select({ type: "block", key: ds.key });
    else if (a === "new-entry") {
      var preset = {};
      if (ds.sec === "Da fare") { preset = { tipo: "gestire", "priorità": "media" }; if (ds.slot) { preset.tappa = ds.slot; preset.giorno = ds.slot.split(" ")[0]; } }
      if (ST.view !== "todo" && ds.sec === "Da fare") go("todo", { type: "new-entry", sec: "Da fare", preset: preset });
      else select({ type: "new-entry", sec: ds.sec, preset: preset });
    } else if (a === "new-note") {
      var nid = "n-" + nowRome().replace(/[-: ]/g, "").slice(0, 12), sfx = 1;
      while (getBlock("Note/" + nid + (sfx > 1 ? "-" + sfx : ""))) sfx++;
      var pre = { __id: nid + (sfx > 1 ? "-" + sfx : ""), data: nowRome() }; if (ds.day) pre.giorno = ds.day;
      var sel = { type: "new-entry", sec: "Note", preset: pre };
      if (ST.view === "notes" || ST.view.indexOf("day:") === 0) select(sel); else go("notes", sel);
      setTimeout(function () { var ti = $("#side [name='f:titolo']"); if (ti) ti.focus(); }, 0);
    } else if (a === "toggle-done") {
      var key = "Da fare/" + ds.id, b = getBlock(key); if (!b) return;
      var e = parseEntry(b.text), was = !!fieldOf(e, "fatto");
      setField(e, "fatto", was ? "" : todayRome());
      setBlock(key, serializeEntry(e)); toast(was ? "Riaperta" : "Segnata fatta oggi (da pubblicare)");
      if (ST.sel && ST.sel.key === key) renderSide();
    } else if (a === "del-block") {
      var k = ST.sel && ST.sel.key; if (!k || !confirm("Eliminare «" + blockLabel(k) + "»?")) return;
      deleteBlock(k); ST.sel = null; ST.formDirty = false; renderSide(); toast("Eliminata (da pubblicare)");
    } else if (a === "add-row") {
      var list = t.parentNode.querySelector('[data-list="' + ds.list + '"]');
      var html = ds.list === "attr" ? attrRow({ k: "posto", v: "" }) : ds.list === "det" ? detRow({ k: "come", v: "" }) : ds.list === "link" ? linkRow({ l: "", u: "" }) : slotRow("");
      list.insertAdjacentHTML("beforeend", html); ST.formDirty = true;
      var last = list.lastElementChild.querySelector("input:not([disabled]),textarea,select"); if (last) last.focus();
    } else if (a === "del-row") { t.closest(".re").remove(); ST.formDirty = true; }
    else if (a === "budget-add") { $("form[data-form=budget] tbody").insertAdjacentHTML("beforeend", budgetRow({ item: "", eur: 0, note: "" })); ST.mainDirty = true; }
    else if (a === "budget-del") { t.closest("tr").remove(); ST.mainDirty = true; }
    else if (a === "close-side") { if (ST.formDirty && !confirm("Chiudere senza applicare le modifiche?")) return; ST.formDirty = false; ST.sel = null; renderSide(); renderMain(true); }
    else if (a === "filter") { ST.filter[ds.f] = ds.v; renderMain(true); }
    else if (a === "publish") openPublish();
    else if (a === "token") openToken();
    else if (a === "forget-token") { setToken(""); closeModal(); toast("Token dimenticato"); }
    else if (a === "close-modal") closeModal();
    else if (a === "revert") {
      var bk = blockMap(ST.base.text), c = changes(ST.base.text, ST.work).filter(function (x) { return x.key === ds.key; })[0];
      if (!c) return;
      var bs = splitBlocks(ST.work);
      if (c.kind === "add") bs = bs.filter(function (x) { return x.key !== c.key; });
      else if (c.kind === "mod") bs.forEach(function (x) { if (x.key === c.key) x.lines = bk.m[c.key].split("\n"); });
      else { var tmp = rebaseOne(c.key); if (!tmp) return; bs = splitBlocks(tmp); }
      setWork(joinBlocks(bs)); toast("Modifica annullata");
    } else if (a === "discard-all") {
      if (!confirm("Buttare via tutte le modifiche non pubblicate?")) return;
      ST.sel = null; setWork(ST.base.text); renderSide(); toast("Tornato com'è su GitHub");
    } else if (a === "goto-key") gotoKey(ds.key, ds.line);
  });
  function rebaseOne(key) { // rimette una voce tolta, nella posizione che aveva
    var base = splitBlocks(ST.base.text), work = splitBlocks(ST.work), i = -1;
    base.forEach(function (b, k) { if (b.key === key) i = k; });
    if (i < 0) return null;
    var after = i > 0 ? base[i - 1].key : null, at = -1;
    work.forEach(function (b, k) { if (b.key === after) at = k; });
    var prev = work[at]; if (prev && prev.lines[prev.lines.length - 1] !== "") prev.lines.push("");
    work.splice(at + 1, 0, { key: key, lines: base[i].lines.slice() });
    return joinBlocks(work);
  }
  document.addEventListener("submit", function (ev) {
    var f = ev.target; ev.preventDefault();
    if (f.closest("#main")) ST.mainDirty = false;
    if (f.dataset.form === "publish") publish(f);
    else if (f.dataset.form === "token") saveTokenForm(f);
    else if (f.dataset.form === "conflicts") resolveConflicts(f);
    else applyForm(f);
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "q") { renderSearch(t.value); return; }
    if (t.dataset.q) { ST.filter.q[t.dataset.q] = t.value; var pos = t.selectionStart; renderMain(true); var n = $('[data-q="' + t.dataset.q + '"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } return; }
    if (t.closest("#side form")) ST.formDirty = true;
    if (t.closest("#main form")) ST.mainDirty = true;
    if (t.tagName === "TEXTAREA" && t.name === "dv") { t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }
  });
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.closest("#side form")) ST.formDirty = true;
    if (t.dataset.actChange === "attr-kind") {
      var row = t.closest(".re"), v = $("[name=av]", row).value;
      row.outerHTML = attrRow({ k: t.value, v: (ATTR.filter(function (y) { return y[0] === t.value; })[0] || [])[2] === "flag" ? "" : v });
    }
  });
  document.addEventListener("keydown", function (ev) {
    var mod = ev.ctrlKey || ev.metaKey;
    if (mod && ev.key === "s") { ev.preventDefault(); if (ST.formDirty) { var f = $("#side form"); if (f) applyForm(f); } openPublish(); return; }
    if (mod && ev.key === "k") { ev.preventDefault(); $("#q").focus(); $("#q").select(); return; }
    if (mod && ev.key === "Enter") { var form = ev.target.closest && ev.target.closest("form"); if (form) { ev.preventDefault(); form.requestSubmit(); } return; }
    if (ev.key === "Escape") {
      if ($("#modal")) { closeModal(); return; }
      var sr = $("#sres"); if (sr && !sr.hidden) { sr.hidden = true; return; }
      if (ST.sel && !ST.formDirty) { ST.sel = null; renderSide(); renderMain(true); }
    }
    if (ev.target.id === "q" && (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "Enter")) {
      var items = $$("#sres .sr"), cur = items.findIndex(function (x) { return x.classList.contains("on"); });
      if (ev.key === "Enter") { if (items[cur]) items[cur].click(); ev.preventDefault(); return; }
      ev.preventDefault();
      if (items[cur]) items[cur].classList.remove("on");
      var nx = items[Math.max(0, Math.min(items.length - 1, cur + (ev.key === "ArrowDown" ? 1 : -1)))]; if (nx) { nx.classList.add("on"); nx.scrollIntoView({ block: "nearest" }); }
    }
  });
  window.addEventListener("beforeunload", function (ev) { if (ST.formDirty || ST.mainDirty) { ev.preventDefault(); ev.returnValue = ""; } });
  window.addEventListener("popstate", function () { fromHash(); });
  function fromHash() {
    var v = decodeURIComponent(location.hash.slice(1)) || "home";
    ST.view = v; ST.sel = null; ST.formDirty = false; ST.mainDirty = false;
    renderStatus(); renderMain(); renderSide();
  }

  // ---------- avvio ----------
  function boot() {
    $("#tokbtn").addEventListener("click", function () { openToken(); });
    startWorker();
    renderMain();
    fetchRemote().then(function (remote) {
      ST.base = remote; ST.work = remote.text;
      var dr = LS.get("draft");
      if (dr && dr.work && dr.work !== remote.text) {
        if (dr.sha === remote.sha) { ST.work = dr.work; toast("Ripristinate le modifiche non pubblicate del " + dr.at); }
        else {
          var r = rebase(dr.base, dr.work, remote.text);
          if (!r.conflicts.length) { ST.work = r.text; toast("Modifiche del " + dr.at + " unite alla versione nuova di GitHub"); }
          else { ST.work = remote.text; setTimeout(function () { var tmpBase = ST.base; ST.base = { commit: tmpBase.commit, sha: dr.sha, text: dr.base, build: tmpBase.build }; ST.work = dr.work; openConflicts(r.conflicts, tmpBase); }, 600); }
        }
      }
      return raw(remote.commit, "data.json").then(function (j) { if (!ST.data) useData(JSON.parse(j), remote.text, j); });
    }).then(function () {
      fromHash();
      scheduleBuild();
      loadCommits().then(function () { if (ST.view === "home") renderMain(true); });
    }).catch(function (e) {
      $("#main").innerHTML = '<div class="empty"><h1>Non riesco a leggere i dati da GitHub</h1><p>' + esc(e.message) + '</p><div class="form-a"><button class="btn go" onclick="location.reload()">Riprova</button><button class="btn" data-act="token">Accesso a GitHub</button></div></div>';
    });
    if (window.matchMedia && matchMedia("(max-width: 760px)").matches) toast("Il back office è pensato per il computer: sul telefono usa l'app");
  }
  boot();
})();
