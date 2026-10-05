/* Giappone 2026 — guida tascabile. Una sola pagina: l'itinerario giorno per giorno.
   Tutti i dati arrivano da data.json, generato da viaggio.md con build.py: qui non c'è nessun dato scritto a mano.
   Per provare un'ora diversa: aggiungere ?ora=2026-11-11T10:00+09:00 all'indirizzo. */
(function () {
  "use strict";
  var APP_V = "20"; // uguale al numero di VERSION in sw.js

  var CITY = { tokyo: "Tokyo", kawaguchiko: "Kawaguchiko", kamakura: "Kamakura", kyoto: "Kyoto", takayama: "Takayama", osaka: "Osaka", roma: "Roma" };
  var TYPE = {
    vedere: { n: "Da vedere", i: "pin" }, fare: { n: "Esperienza", i: "sparkles" }, cibo: { n: "Mangiare", i: "food" },
    sposta: { n: "Spostamento", i: "walk" }, viaggio: { n: "Treno, bus o volo", i: "train" }, hotel: { n: "Hotel", i: "bed" },
    bagagli: { n: "Valigie", i: "luggage" }
  };
  var MODE = { transit: "train", walking: "walk", driving: "taxi" };
  var GUIDE = [["mangiare", "Dove mangiare"], ["prenotare", "Da avere con sé"], ["attenzione", "Attenzione"],
    ["anticipo", "Se avanza tempo"], ["stanchi", "Se siete stanchi"], ["camminata", "A piedi e pause"]];
  var MONTHS = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var WDAYS = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var WD3 = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  var D = null, RATE = 185, TL = [], TRAINS = {}, HOTELS = {}, TODO = {}, USED = {};
  var S = { day: 0, open: {}, fold: {}, q: "", searching: false, menu: null };
  var PREF = (function () { var p = {}; try { p = JSON.parse(localStorage.getItem("g26:prefs") || "{}") || {}; } catch (e) {}
    return { maps: p.maps || "google", theme: p.theme || "auto", size: p.size || "m", openNow: p.openNow !== false }; })();
  var PHOTO = store("photos") || {}; // titolo Wikipedia → indirizzo della miniatura ("" = nessuna foto)
  var view = document.getElementById("view");
  var lastHidden = 0;

  // ---------- utilità ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem("g26:" + k));
      localStorage.setItem("g26:" + k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function icon(name, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function link(href, label, cls, ic) {
    return '<a class="btn ' + (cls || "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + (ic ? icon(ic) : "") + "<span>" + label + "</span></a>";
  }
  function mapsQ(q) { return PREF.maps === "apple" ? "https://maps.apple.com/?q=" + encodeURIComponent(q) : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  // Indicazioni da dove siete fino a q: il mezzo (a piedi, mezzi, taxi) lo scegliete in Google Maps.
  function goto(q) { return PREF.maps === "apple" ? "https://maps.apple.com/?daddr=" + encodeURIComponent(q) : "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q); }
  function yen(n) { return "¥" + Math.round(n).toLocaleString("it-IT"); }
  function cityVar(c) { return "var(--" + (CITY[c] ? c : "roma") + ")"; }
  function shortName(n) { return String(n).replace(/\s*\([^)]*\)\s*$/, ""); }
  function toast(msg) {
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  // ---------- foto (miniature di Wikipedia, salvate dal service worker per l'offline) ----------
  function photoOf(it) { var u = it && it.photo && PHOTO[it.photo]; return u || null; }
  function loadPhotos() {
    var want = {};
    D.days.forEach(function (d) { d.items.forEach(function (it) { if (it.photo) want[it.photo] = 1; }); });
    var todo = Object.keys(want).filter(function (t) { return !(t in PHOTO); });
    if (!todo.length) { warmPhotos(); return; }
    var chunks = [];
    for (var k = 0; k < todo.length; k += 40) chunks.push(todo.slice(k, k + 40));
    Promise.all(chunks.map(function (ch) {
      var u = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=480&titles=" +
        encodeURIComponent(ch.join("|"));
      return fetch(u).then(function (r) { return r.json(); }).then(function (j) {
        var q = j.query || {}, map = {}, by = {};
        (q.normalized || []).concat(q.redirects || []).forEach(function (n) { map[n.from] = n.to; });
        Object.keys(q.pages || {}).forEach(function (id) { var pg = q.pages[id]; by[pg.title] = pg.thumbnail ? pg.thumbnail.source : ""; });
        ch.forEach(function (t) { var x = t; for (var g = 0; g < 4 && map[x]; g++) x = map[x]; PHOTO[t] = by[x] || ""; });
      });
    })).then(function () {
      store("photos", PHOTO);
      if (!S.searching) { var y = window.scrollY; render(true); window.scrollTo(0, y); }
      warmPhotos();
    }).catch(function () { /* offline: si riprova alla prossima apertura */ });
  }
  function warmPhotos() {
    setTimeout(function () {
      Object.keys(PHOTO).forEach(function (t) { if (PHOTO[t]) fetch(PHOTO[t], { mode: "no-cors" }).catch(function () {}); });
    }, 2500);
  }

  // ---------- ora ----------
  var OVERRIDE = (function () {
    var m = /[?&]ora=([^&]+)/.exec(location.search);
    if (!m) return null;
    var t = Date.parse(decodeURIComponent(m[1]).replace(" ", "+"));
    return isNaN(t) ? null : t - Date.now();
  })();
  function now() { return Date.now() + (OVERRIDE || 0); }
  function partsIn(ms, tz) {
    var p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ms));
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    return { date: o.year + "-" + o.month + "-" + o.day, hm: o.hour + ":" + o.minute };
  }
  function tokyoToday() { return partsIn(now(), "Asia/Tokyo").date; }
  function romeToday() { return partsIn(now(), "Europe/Rome").date; }
  function isoDate(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function dLong(iso) { var d = isoDate(iso); return WDAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  function dShort(iso) { var d = isoDate(iso); return WD3[d.getDay()] + " " + d.getDate() + "/" + (d.getMonth() + 1); }
  function dm(iso) { var d = isoDate(iso); return d.getDate() + "/" + (d.getMonth() + 1); }
  function daysUntil(iso, today) { return Math.round((isoDate(iso) - isoDate(today)) / 86400000); }
  function inMinutes(ms) {
    var m = Math.round(ms / 60000);
    if (m < 1) return "adesso";
    if (m < 60) return "tra " + m + "′";
    var h = Math.floor(m / 60), r = m % 60;
    return "tra " + h + " h" + (r ? " " + r + "′" : "");
  }

  // Linea del tempo di tutto il viaggio: ogni tappa con il suo istante assoluto (fuso di Roma o di Tokyo).
  function buildTimeline() {
    TL = [];
    D.days.forEach(function (d, di) {
      d.items.forEach(function (it, ii) { TL.push({ d: di, i: ii, at: Date.parse(it.at) }); });
    });
    TL.sort(function (a, b) { return a.at - b.at; });
  }
  function phase() {
    var n = now();
    if (n < TL[0].at) return "before";
    if (n > TL[TL.length - 1].at + 3 * 3600000) return "after";
    return "live";
  }
  function curIndex() {
    var n = now(), k = -1;
    for (var j = 0; j < TL.length; j++) if (TL[j].at <= n) k = j;
    return k;
  }
  function tlPos(d, i) {
    for (var j = 0; j < TL.length; j++) if (TL[j].d === d && TL[j].i === i) return j;
    return -1;
  }
  function itemAt(e) { return D.days[e.d].items[e.i]; }
  // Di notte (più di 3 ore dopo l'ultima tappa) si guarda già alla prima tappa del mattino.
  function resting() {
    var c = curIndex();
    return c >= 0 && TL[c + 1] && now() - TL[c].at > 3 * 3600000;
  }
  function nowTarget() {
    var c = curIndex();
    if (c < 0) return null;
    if (resting()) return { d: TL[c + 1].d, i: TL[c + 1].i, travel: false, rest: true };
    var e = TL[c], it = itemAt(e);
    if (it.merged && TL[c + 1]) return { d: TL[c + 1].d, i: TL[c + 1].i, travel: true };
    return { d: e.d, i: e.i, travel: false };
  }
  function stateOf(d, i) {
    var ph = phase();
    if (ph === "before") return "";
    if (ph === "after") return "past";
    var c = curIndex(), p = tlPos(d, i), it = D.days[d].items[i];
    if (resting()) return p <= c ? "past" : "";
    if (it.leg != null && TL[c] && TL[c].d === d && TL[c].i === it.leg) return "travel";
    return p < c ? "past" : (p === c ? "now" : "");
  }
  function currentDay() {
    var ph = phase();
    if (ph === "before") return 0;
    if (ph === "after") return D.days.length - 1;
    var t = nowTarget();
    return t ? t.d : TL[0].d;
  }

  // ---------- cose da prenotare o sistemare ----------
  function done(id) { return !!store("todo:" + id); }
  function openTodos(it) { return (it.todos || []).filter(function (id) { return !done(id); }).map(function (id) { return TODO[id]; }); }
  function needs(it) {
    var o = openTodos(it);
    if (o.length) return o.some(function (t) { return t.kind === "prenotare"; }) ? "book" : "fix";
    if (it.status === "todo" && !(it.todos || []).length) return "book";
    return "";
  }
  function dayCount(di) {
    var ids = {}, n = 0;
    D.days[di].items.forEach(function (it, ii) {
      if (it.merged || stateOf(di, ii) === "past") return; // ciò che è già passato non conta più
      openTodos(it).forEach(function (t) { ids[t.id] = 1; });
      if (it.status === "todo" && !(it.todos || []).length) n++;
    });
    return n + Object.keys(ids).length;
  }
  function todoPill(t) {
    var today = romeToday();
    if (t.opens && today < t.opens) {
      var o = daysUntil(t.opens, today);
      return '<span class="pill ' + (o <= 3 ? "warn" : "info") + '">Dal ' + dm(t.opens) + "</span>";
    }
    if (t.due) {
      var n = daysUntil(t.due, today);
      if (n < 0) return '<span class="pill todo">Scaduto il ' + dm(t.due) + "</span>";
      return '<span class="pill ' + (n <= 7 ? "todo" : "muted") + '">' + (n === 0 ? "Entro oggi" : "Entro il " + dm(t.due)) + "</span>";
    }
    if (/^subito/i.test(t.when) || t.prio === "alta") return '<span class="pill todo">Subito</span>';
    return "";
  }
  function todoBox(t) {
    if (done(t.id)) {
      return '<div class="todo-box done"><span class="tb-d">' + icon("circle-check") + "<b>" + esc(t.task) + '</b></span><button type="button" class="btn small" data-todo="' + esc(t.id) + '">Annulla</button></div>';
    }
    var meta = [];
    if (t.when) meta.push(t.when);
    if (t.cost) meta.push(t.cost);
    return '<div class="todo-box ' + (t.kind === "prenotare" ? "book" : "fix") + '"><div class="tb-h"><span class="tb-k">' + icon("alert") + (t.kind === "prenotare" ? "Da prenotare" : "Da sistemare") + "</span>" + todoPill(t) + "</div>" +
      "<b>" + esc(t.task) + "</b>" + (meta.length ? '<span class="tb-m">' + esc(meta.join(" · ")) + "</span>" : "") +
      (t.note ? "<p>" + esc(t.note) + "</p>" : "") + '<div class="btns">' + (t.links || (t.link ? [{ url: t.link, label: "" }] : [])).map(function (l, n) {
        var tel = l.url.indexOf("tel:") === 0;
        return link(l.url, esc(l.label || (tel ? "Chiama" : t.kind === "prenotare" ? "Prenota" : "Apri")), n ? "" : "go", tel ? "phone" : "ext");
      }).join("") +
      '<button type="button" class="check" data-todo="' + esc(t.id) + '" aria-pressed="false"><span class="box">' + icon("check") + "</span>Fatto</button></div></div>";
  }

  // ---------- testi e icone ----------
  function richText(t) {
    return esc(t).replace(/\[\[([a-z0-9-]+)\]\]/g, function (_, id) {
      var p = D.places[id];
      return p ? '<a class="inl" href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(shortName(p.name)) + "</a>" : id;
    });
  }
  function plain(t) { return String(t || "").replace(/\[\[([a-z0-9-]+)\]\]/g, function (_, id) { return D.places[id] ? shortName(D.places[id].name) : id; }); }
  function bulletsHtml(t) {
    var lines = String(t).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.every(function (l) { return l.indexOf("•") === 0; })) {
      return "<ul>" + lines.map(function (l) { return "<li>" + esc(l.replace(/^•\s*/, "")) + "</li>"; }).join("") + "</ul>";
    }
    return lines.map(function (l) { return "<p>" + esc(l.replace(/^•\s*/, "")) + "</p>"; }).join("");
  }
  function moveIcon(it) { var m = it.routes && it.routes[0] ? it.routes[0].mode : "walking"; return MODE[m]; }
  function itemIcon(it) {
    if (it.k === "sposta") return moveIcon(it);
    if (it.k === "viaggio") {
      if (it.train) return it.train.indexOf("bus") === 0 ? "bus" : "train";
      return "plane";
    }
    if (it.k === "vedere" && it.place) {
      var ty = D.places[it.place].type || "";
      if (/⛩|🗿|🏯|🎋|🪨/.test(ty)) return "landmark";
      if (/📸|🌅|🌄/.test(ty)) return "camera";
      if (/🍁|🐒|🚶/.test(ty)) return "trees";
    }
    if (it.k === "fare" && it.place) {
      var t2 = D.places[it.place].type || "";
      if (/🕹|🎮/.test(t2)) return "game";
      if (/🎭/.test(t2)) return "drama";
      if (/🍺|🍸/.test(t2)) return "beer";
      if (/🚠/.test(t2)) return "mountain";
    }
    if (it.k === "fare" && /onsen/i.test(it.title)) return "bath";
    return TYPE[it.k].i;
  }
  function pillsFor(it, st, nd) {
    var p = "";
    if (st === "now") p += '<span class="pill now">Adesso</span>';
    if (st === "travel") p += '<span class="pill now">In arrivo</span>';
    if (nd === "book") p += '<span class="pill todo">' + icon("alert") + "Da prenotare</span>";
    if (nd === "fix") p += '<span class="pill warn">' + icon("alert") + "Da sistemare</span>";
    if (it.start) p += '<span class="pill muted">Partenza</span>';
    var hh = it.k === "hotel" || it.k === "bagagli" ? hotelOf(it) : null;
    if (hh) p += hotelMine(hh) ? '<span class="pill mine">' + icon("bed") + "Hotel vostro</span>" : '<span class="pill grp">' + icon("users") + "Alloggio del gruppo</span>";
    else if (it.group && it.k !== "sposta") p += '<span class="pill grp">' + icon("users") + "Col gruppo</span>";
    if (it.bag === "in") p += '<span class="pill bag">' + icon("luggage") + "Lasciate le valigie</span>";
    if (it.bag === "out") p += '<span class="pill bag">' + icon("luggage") + "Riprendete le valigie</span>";
    if (!nd && it.status === "paid") p += '<span class="pill ok">' + icon("check") + "Pagato</span>";
    if (!nd && it.status === "ok") p += '<span class="pill ok">' + icon("check") + "Prenotato</span>";
    return p;
  }

  // ---------- meteo (Open-Meteo, gratuito e senza chiave) ----------
  // Un'unica richiesta per tutte le città: com'è adesso e le previsioni dei prossimi 16 giorni.
  // Si aggiorna all'apertura dell'app (al massimo una volta l'ora) e ogni 3 ore se resta aperta;
  // senza rete resta l'ultimo dato salvato, con l'ora in cui è stato preso.
  var WX_POS = { tokyo: [35.6812, 139.7671], kawaguchiko: [35.4983, 138.769], kamakura: [35.3192, 139.5467], kyoto: [34.9858, 135.7588],
    takayama: [36.1461, 137.2522], osaka: [34.6687, 135.5013], roma: [41.9028, 12.4964] };
  var WX = null, wxBusy = false;
  function wxCode(c, day) {
    if (c === 0) return [day === 0 ? "w-moon" : "w-sun", "sereno"];
    if (c === 1) return [day === 0 ? "w-moon" : "w-cloudsun", "poco nuvoloso"];
    if (c === 2) return [day === 0 ? "w-cloud" : "w-cloudsun", "parzialmente nuvoloso"];
    if (c === 3) return ["w-cloud", "coperto"];
    if (c === 45 || c === 48) return ["w-fog", "nebbia"];
    if (c >= 51 && c <= 57) return ["w-rain", "pioggerella"];
    if (c === 61 || c === 80) return ["w-rain", "pioggia debole"];
    if (c === 63 || c === 81 || c === 66) return ["w-rain", "pioggia"];
    if (c === 65 || c === 82 || c === 67) return ["w-rain", "pioggia forte"];
    if ((c >= 71 && c <= 77) || c === 85 || c === 86) return ["w-snow", "neve"];
    if (c >= 95) return ["w-storm", "temporale"];
    return ["w-cloud", ""];
  }
  function wxLoad(force) {
    if (!WX) WX = store("wx");
    var age = WX ? Date.now() - WX.t : Infinity;
    if (wxBusy || (!force && age < 60 * 60000)) return;
    wxBusy = true;
    var keys = Object.keys(WX_POS);
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + keys.map(function (k) { return WX_POS[k][0]; }).join(",") +
      "&longitude=" + keys.map(function (k) { return WX_POS[k][1]; }).join(",") +
      "&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=auto&forecast_days=16";
    fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var list = Array.isArray(j) ? j : [j], out = { t: Date.now(), c: {} };
      keys.forEach(function (k, n) {
        var x = list[n];
        if (!x || !x.current) return;
        var days = {};
        (x.daily && x.daily.time || []).forEach(function (d, m) {
          days[d] = [x.daily.weather_code[m], Math.round(x.daily.temperature_2m_min[m]), Math.round(x.daily.temperature_2m_max[m]), x.daily.precipitation_probability_max[m]];
        });
        out.c[k] = { now: [Math.round(x.current.temperature_2m), x.current.weather_code, x.current.is_day], days: days };
      });
      WX = out; store("wx", out); paintWx();
    }).catch(function () {}).then(function () { wxBusy = false; });
  }
  function hm(ms) { var d = new Date(ms); return d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2); } // ora del telefono
  function wxHtml(i) {
    var d = D.days[i], cities = d.route.filter(function (c, k) { return WX_POS[c] && d.route.indexOf(c) === k; });
    if (!cities.length) return "";
    if (!WX || !WX.c) return '<div class="wx" id="wx"><p class="wx-none">' + icon("w-cloudsun") + "Meteo non ancora disponibile: serve la rete.</p></div>";
    var old = Date.now() - WX.t > 3 * 3600000;
    var h = '<div class="wx" id="wx">';
    cities.forEach(function (c) {
      var w = WX.c[c];
      if (!w) return;
      var cur = wxCode(w.now[1], w.now[2]), f = w.days[d.id], fc;
      if (f) {
        fc = "il " + d.dm + ": " + f[1] + "–" + f[2] + "°" + (f[3] != null && f[3] >= 20 ? " · pioggia " + f[3] + "%" : "") +
          (wxCode(f[0], 1)[1] && wxCode(f[0], 1)[1] !== cur[1] ? " · " + wxCode(f[0], 1)[1] : "");
      } else {
        var from = isoDate(d.id); from.setDate(from.getDate() - 15);
        fc = "previsioni per il " + d.dm + " dal " + from.getDate() + "/" + (from.getMonth() + 1);
      }
      h += '<div class="wx-c" style="--c:' + cityVar(c) + '"><span class="wx-i">' + icon(cur[0]) + '</span><span class="wx-t num">' + w.now[0] + "°</span>" +
        '<span class="wx-x"><b>' + esc(CITY[c]) + "</b> · " + (old ? "alle " + hm(WX.t) : "adesso") + " " + esc(cur[1]) + "<small>" + esc(fc) + "</small></span></div>";
    });
    return h + '<p class="wx-up">Meteo aggiornato alle ' + hm(WX.t) + "</p></div>";
  }
  function paintWx() {
    var el = document.getElementById("wx");
    if (!el || !D) return;
    var tmp = document.createElement("div"); tmp.innerHTML = wxHtml(S.day);
    if (tmp.firstChild) el.replaceWith(tmp.firstChild);
  }

  // ---------- la pagina ----------
  function mainCity(i) {
    var r = D.days[i].route.filter(function (c) { return c !== "roma"; });
    return r.length ? r[r.length - 1] : "roma";
  }
  // Linea del tempo delle città sopra i giorni: ogni giorno va dalla città della notte prima a quella della sera
  // (le gite in giornata, tipo Kamakura, non contano). Nei giorni di trasferimento la casella è divisa a metà.
  function cityTimeline(sel, cd, ph) {
    var segs = [], prev = null;
    D.days.forEach(function (d, j) {
      var end = d.route[d.route.length - 1], start = j ? prev : d.route[0];
      var parts = start === end ? [[start, j, j + 1]] : [[start, j, j + 0.5], [end, j + 0.5, j + 1]];
      parts.forEach(function (p) {
        var last = segs[segs.length - 1];
        if (last && last.c === p[0]) last.to = p[2];
        else segs.push({ c: p[0], from: p[1], to: p[2] });
      });
      prev = end;
    });
    var h = '<div class="ctl" style="--n:' + D.days.length + '" aria-label="Città, giorno per giorno">';
    segs.forEach(function (g) {
      // posizione in «caselle» (--a) e in spazi tra caselle (--b), così segue la larghezza dei giorni
      var a = g.from, b = Math.floor(g.from), a2 = g.to, b2 = Math.ceil(g.to) - 1;
      var first = Math.min(Math.ceil(g.from - 0.01), D.days.length - 1), lastDay = Math.ceil(g.to) - 1;
      var on = sel >= Math.floor(g.from) && sel <= lastDay, past = ph === "after" || (ph === "live" && g.to <= cd);
      var small = g.to - g.from < 0.8;
      h += '<button type="button" class="ctl-s' + (on ? " on" : "") + (past ? " past" : "") + (small ? " small" : "") + '" data-day="' + first + '" style="--c:' + cityVar(g.c) +
        ";--a:" + a + ";--b:" + b + ";--a2:" + a2 + ";--b2:" + b2 + '" aria-label="' + esc(CITY[g.c]) + '">' +
        (small ? (g.c === "roma" ? icon("plane") : "") : "<span>" + esc(CITY[g.c]) + "</span>") + "</button>";
    });
    // fascia col gruppo: le ore 6–24 di ogni giorno riempiono la casella
    var gs = [];
    D.days.forEach(function (d, j) {
      if (!d.group) return;
      var f = function (t) { var m = hmMin(t); return Math.min(1, Math.max(0, (m - 360) / 1080)); };
      var a0 = j + f(d.group.from), a1 = j + f(d.group.to), last = gs[gs.length - 1];
      if (last && a0 - last.to < 0.15) last.to = a1; else gs.push({ from: a0, to: a1 }); // la notte non interrompe la fascia
    });
    gs.forEach(function (g) {
      var a = g.from, b = Math.floor(g.from), a2 = g.to, b2 = Math.ceil(g.to) - 1;
      h += '<button type="button" class="ctl-g" data-day="' + Math.floor(g.from) + '" style="--a:' + a + ";--b:" + b + ";--a2:" + a2 + ";--b2:" + b2 + '">' + icon("users") + "<span>col gruppo</span></button>";
    });
    return h + "</div>";
  }
  function topBar(sel) {
    var ph = phase(), cd = ph === "live" ? currentDay() : -1, today = tokyoToday();
    var h = '<div class="topbar" id="topbar"><div class="daystrip" role="toolbar" aria-label="Giorni del viaggio">' + cityTimeline(sel, cd, ph) + '<div class="chips">';
    D.days.forEach(function (x, j) {
      var past = ph === "after" || (ph === "live" && j < cd), n = dayCount(j), d = isoDate(x.id);
      h += '<button type="button" class="daychip' + (j === cd || (ph !== "live" && x.id === today) ? " today" : "") + (past ? " past" : "") +
        '" data-day="' + j + '" aria-pressed="' + (j === sel) + '" style="--c:' + cityVar(mainCity(j)) + '" aria-label="' + esc(dLong(x.id)) + (n ? ", " + n + " cose da sistemare" : "") + '">' +
        '<span class="w">' + WD3[d.getDay()] + '</span><span class="d">' + d.getDate() + "</span>" + (n ? '<b class="nb">' + n + "</b>" : "") + "</button>";
    });
    return h + "</div></div></div>";
  }
  function groupText(d) {
    var g = d.group;
    if (!g) return "Solo voi due";
    if (g.from === "00:00" && g.to === "23:59") return "Tutto il giorno col gruppo";
    if (g.to === "23:59") return "Col gruppo dalle " + g.from;
    if (g.from === "00:00") return "Col gruppo fino alle " + g.to + ", poi solo voi due";
    return "Col gruppo " + g.from + "–" + g.to + " circa, poi solo voi due";
  }
  function dayHead(i) {
    var d = D.days[i], ph = phase(), cd = currentDay();
    var h = '<header class="dayhead"><div class="dayhead-top"><span class="kicker">Giorno ' + d.n + " · " + esc(dLong(d.id)) + "</span>";
    h += '<div class="navbtns"><button type="button" class="navbtn" data-day="' + (i - 1) + '" aria-label="Giorno prima"' + (i > 0 ? "" : " disabled") + ">" + icon("left") + "</button>";
    h += '<button type="button" class="navbtn" data-day="' + (i + 1) + '" aria-label="Giorno dopo"' + (i < D.days.length - 1 ? "" : " disabled") + ">" + icon("right") + "</button></div></div>";
    h += "<h1" + (d.route.length > 2 ? ' class="long"' : "") + ">" + d.route.map(function (c, k) {
      return (k ? ' <span class="sep">›</span> ' : "") + '<span class="c" style="--c:' + cityVar(c) + '">' + esc(CITY[c]) + "</span>";
    }).join("") + "</h1>";
    var walk = (d.guide.camminata || "").split(" · ")[0];
    var sh = HOTELS[d.sleep];
    h += '<div class="facts">' + (sh ? '<button type="button" class="sleepbtn" data-sleep="1" aria-expanded="' + !!S.sleep + '">' + icon("bed") + "<span>Dormite: <b>" + esc(d.sleepName) + "</b></span>" + icon("down", "chev") + "</button>"
        : "<span>" + icon("plane") + esc(d.sleepName) + "</span>") +
      '<span class="gfact' + (d.group ? " on" : "") + '">' + icon("users") + esc(groupText(d)) + "</span>" +
      (walk ? "<span>" + icon("walk") + esc((walk.match(/^[~\d.,\s–-]+km/) || [walk])[0]) + " a piedi</span>" : "") + "</div>" + wxHtml(i);
    if (sh) h += '<div class="sleepbox" id="sleepbox"' + (S.sleep ? "" : " hidden") + ">" + hotelBox(sh) + '<div class="btns">' + hotelActions(sh) + "</div></div>";
    if (d.guide.senso) h += '<p class="summary">' + esc(d.guide.senso) + "</p>";
    if (ph === "live" && i !== cd) h += '<p style="margin:12px 0 0"><button type="button" class="chip-now" data-now="1">' + icon("locate") + "Vai a oggi, a dove siete adesso</button></p>";
    var n = dayCount(i);
    if (n) {
      h += '<button type="button" class="issues" data-issues="1"><span class="nb2">' + n + "</span><span><b>" + (n === 1 ? "Una cosa da prenotare o sistemare" : n + " cose da prenotare o sistemare") +
        "</b><small>Le tappe sono segnate in rosso. Tocca per aprirle.</small></span>" + icon("down") + "</button>";
    }
    return h + "</header>";
  }

  function render(keepScroll) {
    if (!D) return;
    var i = S.day, d = D.days[i], ph = phase(), cd = currentDay();
    var h = topBar(i) + dayHead(i);
    if (ph === "live" && i === cd) h += nowCard();
    if (ph === "after" && i === D.days.length - 1) h += '<div class="nowcard"><span class="lab">Viaggio finito</span><span class="big">Bentornati!</span></div>';
    if (!store("hinted")) h += '<p class="hint">' + icon("info") + "<span>Tocca una tappa per foto, dettagli e indicazioni. Scorri il dito a destra o a sinistra per cambiare giorno. In basso a destra: la lente cerca qualsiasi cosa, i tre puntini aprono prenotazioni, cambio, codici e impostazioni.</span></p>";

    h += '<div class="plan">';
    var zh = zoneHeads(i), prevG = null;
    d.items.forEach(function (it, k) {
      if (it.merged) return;
      var g = !!it.group, sep = prevG !== null && g !== prevG ? (g ? "on" : "off") : "";
      prevG = g;
      h += stopHtml(i, k, it, zh[k], sep);
    });
    h += "</div>";

    h += '<div class="extras">' + tourHtml(i) + tipsHtml(d) + "</div>";
    h += '<div class="legend" aria-label="Legenda">' + Object.keys(TYPE).map(function (k) {
      return '<span style="--tc:var(--t-' + k + ')"><i></i>' + TYPE[k].n + "</span>";
    }).join("") + '<span class="lg-bad"><i></i>Da prenotare o sistemare</span></div>';
    h += '<p class="foot-note">Versione ' + APP_V + " · dati del " + esc(D.generated || "") + "</p>";
    view.innerHTML = h;
    if (!document.getElementById("fabs")) {
      var fb = document.createElement("div");
      fb.id = "fabs"; fb.className = "fabs";
      fb.innerHTML = '<button type="button" class="gbtn" data-menu="1" aria-label="Menu">' + icon("more") + '</button><button type="button" class="gbtn" data-search="1" aria-label="Cerca">' + icon("search") + "</button>";
      document.body.appendChild(fb);
    }
    if (!keepScroll) window.scrollTo(0, 0);
    var chip = view.querySelector('.daychip[aria-pressed="true"]');
    var strip = view.querySelector(".daystrip");
    if (chip && strip) strip.scrollLeft = chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2;
    onScroll();
    store("state", { day: S.day });
  }

  function nextStop(c) {
    for (var j = c + 1; j < TL.length; j++) {
      var it = itemAt(TL[j]);
      if (!it.merged) return { e: TL[j], it: it, leg: it.leg != null ? D.days[TL[j].d].items[it.leg] : null };
    }
    return null;
  }
  function nowCard() {
    var c = curIndex(), e = TL[c], it = itemAt(e), tgt = nowTarget();
    if (tgt.rest) {
      var nx0 = D.days[tgt.d].items[tgt.i], sl = D.days[e.d].sleep && HOTELS[D.days[e.d].sleep];
      return '<div class="nowcard"><span class="lab">Riposo</span>' + (sl ? '<div class="nowline"><span class="t">' + icon("moon") + '</span><span class="x">Dormite all\'' + esc(sl.name) + "</span></div>" : "") +
        '<div class="nowline"><span class="t">' + esc(nx0.t) + '</span><span class="x">Si riparte: ' + esc(nx0.title) + "<small>" + esc(inMinutes(TL[c + 1].at - now())) + "</small></span></div>" +
        '<div class="btns"><button type="button" class="btn small" data-jump="' + tgt.d + "-" + tgt.i + '">Vai alla prima tappa</button></div></div>';
    }
    var h = '<div class="nowcard"><span class="lab">' + (tgt.travel ? "Adesso siete in viaggio" : "Adesso dovreste essere qui") + "</span>";
    if (tgt.travel) {
      var dest = D.days[tgt.d].items[tgt.i];
      h += '<div class="nowline"><span class="t">' + esc(it.t) + '</span><span class="x">Verso ' + esc(dest.title) + "<small>" + esc(it.short || "") + " · arrivo previsto " + esc(dest.t) + "</small></span></div>";
    } else {
      h += '<div class="nowline"><span class="t">' + esc(it.t) + '</span><span class="x">' + esc(it.title) + (it.short ? "<small>" + esc(it.short) + "</small>" : "") + "</span></div>";
    }
    var btns = '<button type="button" class="btn small" data-jump="' + tgt.d + "-" + tgt.i + '">Dettagli</button>';
    var nx = tgt.travel ? null : nextStop(c);
    if (nx) {
      var start = nx.leg ? nx.leg : nx.it;
      var when = nx.leg ? "si parte alle " + nx.leg.t + " (" + inMinutes(Date.parse(nx.leg.at) - now()) + ")" : inMinutes(nx.e.at - now());
      h += '<div class="nowline"><span class="t">' + esc(start.t) + '</span><span class="x">Poi: ' + esc(nx.it.title) + "<small>" + esc(when) +
        (nx.leg && nx.leg.short ? " · " + esc(nx.leg.short) : "") + "</small></span></div>";
      if (nx.it.dest) btns += link(goto(nx.it.dest), "Indicazioni per la prossima", "small ghost", "nav");
    } else if (tgt.travel) {
      var dd = D.days[tgt.d].items[tgt.i];
      if (dd.dest) btns += link(goto(dd.dest), "Indicazioni", "small ghost", "nav");
    }
    return h + '<div class="btns">' + btns + "</div></div>";
  }

  // ---------- zone: le tappe di fila nello stesso quartiere sono un gruppo, con quanto ci state ----------
  function hmMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function durText(m) {
    if (m < 50) return "sosta breve, ~" + Math.max(5, Math.round(m / 5) * 5) + "′";
    var h = Math.round(m / 30) / 2;
    return "~" + Math.floor(h) + " h" + (h % 1 ? " 30" : "");
  }
  function zoneHeads(di) {
    var items = D.days[di].items, vis = [], out = {};
    items.forEach(function (it, k) { if (!it.merged) vis.push(k); });
    for (var a = 0; a < vis.length; a++) {
      var it = items[vis[a]], z = it.zone;
      if (!z || !D.zones || !D.zones[z]) continue;
      if (a > 0 && items[vis[a - 1]].zone === z) continue;
      var b = a, onlyBase = true;
      while (b + 1 < vis.length && items[vis[b + 1]].zone === z) b++;
      for (var c = a; c <= b; c++) if (["hotel", "bagagli"].indexOf(items[vis[c]].k) < 0 || items[vis[c]].title.indexOf("Onsen") >= 0) onlyBase = false;
      var start = it.t, end = null, nx = b + 1 < vis.length ? items[vis[b + 1]] : null;
      if (nx) end = nx.leg != null ? items[nx.leg].t : nx.t;
      var info = { z: z, start: start, end: end, base: onlyBase };
      if (end && !onlyBase) {
        var m = hmMin(end) - hmMin(start);
        if (m < 0) m += 24 * 60;
        info.dur = durText(m);
      }
      out[vis[a]] = info;
    }
    return out;
  }
  function zoneHtml(zi, it, past) {
    var z = D.zones[zi.z], when = zi.base ? "" : zi.end ? zi.start + "–" + zi.end + (zi.dur ? " · " + zi.dur : "") : "dalle " + zi.start;
    return '<div class="zone' + (past ? " past" : "") + '" style="--c:' + cityVar(it.city) + '"><span class="zn">' + icon("pin") + esc(z.name) + "</span>" +
      '<span class="zx">' + esc(z.what) + (when ? ' <b class="num">' + esc(when) + "</b>" : "") + "</span></div>";
  }

  function stopHtml(di, ii, it, zi, sep) {
    var key = di + "-" + ii, st = stateOf(di, ii), open = !!S.open[key], nd = st === "past" ? "" : needs(it);
    var leg = it.leg != null ? D.days[di].items[it.leg] : null;
    var h = '<div class="stop k-' + it.k + (st ? " " + st : "") + (nd ? " needs" : "") + '" id="s-' + key + '" style="--tc:var(--t-' + it.k + ')">';
    if (leg) {
      var lst = stateOf(di, it.leg);
      h += '<button type="button" class="leg' + (lst === "past" || st === "past" ? " past" : "") + '" data-open="' + key + '" aria-label="Come arrivarci">' +
        '<span class="lt">' + esc(leg.t) + '</span><span class="li">' + icon(moveIcon(leg)) + '</span><span class="lx">' + esc(leg.short || "spostamento") + "</span></button>";
    }
    if (sep) h += '<div class="grpsep ' + sep + '">' + icon("users") + "<span>" + (sep === "on" ? "Da qui siete <b>col gruppo</b>" : "Da qui siete di nuovo <b>solo voi due</b>") + "</span></div>";
    if (zi) h += zoneHtml(zi, it, st === "past");
    h += '<div class="scard"><button type="button" class="row" data-open="' + key + '" aria-expanded="' + open + '" aria-controls="p-' + key + '">';
    var ph = it.k !== "sposta" && photoOf(it);
    h += '<span class="t">' + esc(it.t) + "</span>" + (ph ? '<span class="dot ph"><img src="' + esc(ph) + '" alt="" loading="lazy" decoding="async"><span class="tb">' +
      icon(itemIcon(it)) + "</span></span>" : '<span class="dot">' + icon(itemIcon(it)) + "</span>");
    var pills = pillsFor(it, st, nd);
    h += '<span class="main"><span class="ttl">' + esc(it.title) + "</span>" + (it.short ? '<span class="sub">' + esc(it.short) + "</span>" : "") +
      (pills ? '<span class="pills">' + pills + "</span>" : "") + "</span>";
    h += '<span class="end">' + icon("down", "chev") + "</span></button>";
    h += '<div class="panel" id="p-' + key + '"' + (open ? "" : " hidden") + ">" + panelHtml(it, leg) + "</div></div></div>";
    return h;
  }

  function detailsHtml(list, inLeg) {
    var h = "", kv = "", warn = "";
    (list || []).forEach(function (x) {
      if (x.k === "text" || (inLeg && x.k === "come")) h += "<p>" + richText(x.text) + "</p>";
      else if (x.k === "attenzione") warn += '<div class="note-warn">' + icon("alert") + "<span>" + richText(x.text) + "</span></div>";
      else kv += "<div><dt>" + esc(x.label) + "</dt><dd>" + richText(x.text) + "</dd></div>";
    });
    return h + (kv ? '<dl class="kv2">' + kv + "</dl>" : "") + warn;
  }
  function panelHtml(it, leg) {
    var h = (it.todos || []).map(function (id) { return todoBox(TODO[id]); }).join("");
    var ph = photoOf(it);
    if (ph) h += '<figure class="pfig"><img src="' + esc(ph) + '" alt="" loading="lazy" decoding="async"><figcaption>Foto: Wikipedia</figcaption></figure>';
    h += detailsHtml(it.details);
    if (leg) {
      h += '<div class="howto"><div class="howto-t">' + icon(moveIcon(leg)) + "<span><b>Come arrivarci</b><small>partenza alle " + esc(leg.t) +
        (leg.short ? " · " + esc(leg.short) : "") + "</small></span></div>" + detailsHtml(leg.details, true) + "</div>";
    }
    var t = it.train && TRAINS[it.train];
    if (t) h += trainBox(t);
    var ho = hotelOf(it), showHo = ho && (it.k === "hotel" || it.k === "bagagli" || it.k === "sposta");
    if (showHo) h += hotelBox(ho);

    var b = "";
    if (it.dest) b += link(goto(it.dest), it.k === "viaggio" && it.train ? "Indicazioni per la stazione" : "Indicazioni", "go wide", "nav");
    var p = it.place && D.places[it.place];
    if (p) {
      if (p.ta) b += link(p.ta, "Tripadvisor", "", "star");
      if (p.tabelog) b += link(p.tabelog, "Tabelog" + (p.score ? " " + esc(p.score) : ""), "", "star");
      if (p.web && !p.ta && !p.tabelog) b += link(p.web, "Sito ufficiale", "", "ext");
      if (!p.ta && !p.tabelog && !p.web) b += link(mapsQ(p.q), "Apri in Mappe", "", "pin");
    }
    if (t && t.link) b += link(t.link, /klook/.test(t.link) ? "Biglietto Klook" : "Prenota", "", "ticket");
    if (showHo) {
      if (ho.address) b += '<button type="button" class="btn" data-copy="' + esc(ho.address) + '">' + icon("copy") + "<span>Copia indirizzo</span></button>";
      if (ho.app) b += link(ho.app, /airbnb/.test(ho.app) ? "App Airbnb" : "App Booking", "", "ext");
    }
    if (b) h += '<div class="btns">' + b + "</div>";
    return h || '<p class="sub" style="color:var(--muted)">Nessun dettaglio.</p>';
  }
  function trainState(t) {
    var today = romeToday();
    if (t.status === "pagato") {
      var s = "Pagato" + (t.payer ? " da " + t.payer : "");
      if (t.confirm) s += today < t.confirm ? ". Klook emette i biglietti il " + dm(t.confirm) + ": controllate l'email" : ". Biglietti nell'app Klook";
      return s;
    }
    if (t.status === "da comprare") return "Da comprare";
    if (t.status === "sul posto") return "Si paga sul posto con la Suica";
    return "Prenotato";
  }
  function trainBox(t) {
    return '<div class="infobox"><span class="ttl2">' + esc(t.line) + '</span><dl class="kv">' +
      (t.price ? "<dt>Prezzo</dt><dd>" + esc(t.price) + (t.eur ? " per 2" : "") + "</dd>" : "") +
      "<dt>Biglietto</dt><dd>" + esc(trainState(t)) + "</dd></dl></div>";
  }
  function hotelOf(it) {
    if (it.hotel && HOTELS[it.hotel]) return HOTELS[it.hotel];
    if (it.k === "sposta" && it.dest) for (var k in HOTELS) if (HOTELS[k].q === it.dest) return HOTELS[k];
    return null;
  }
  function hotelMine(h) { return h.paid !== "gruppo"; }
  function hotelWho(h) {
    if (!hotelMine(h)) return "Del gruppo: l'ha prenotato il gruppo, voi pagate la vostra quota (" + h.price + ")";
    var where = /airbnb/.test(h.app || "") ? "Airbnb" : /booking/.test(h.app || "") ? "Booking" : "";
    return "Vostro: prenotato da " + (h.payer || "voi") + (where ? " su " + where : "") + " per voi due" + (h.shared ? ", si divide a metà" : "");
  }
  function hotelNights(h) { return "dal " + dm(h.in) + " al " + dm(h.out) + " · " + h.nights + (h.nights === 1 ? " notte" : " notti"); }
  function hotelActions(h) {
    var b = link(goto(h.q), "Indicazioni", "go", "nav");
    if (h.address) b += '<button type="button" class="btn" data-copy="' + esc(h.address) + '">' + icon("copy") + "<span>Copia indirizzo</span></button>";
    if (h.app) b += link(h.app, /airbnb/.test(h.app) ? "App Airbnb" : "App Booking", "", "ext");
    return b;
  }
  function hotelBox(h) {
    return '<div class="infobox hotelbox"><span class="ttl2">' + esc(h.name) + '</span><p class="who' + (hotelMine(h) ? "" : " grp") + '">' + icon(hotelMine(h) ? "bed" : "users") + "<span>" + esc(hotelWho(h)) + "</span></p>" +
      '<dl class="kv"><dt>Notti</dt><dd>' + esc(hotelNights(h)) + "</dd>" +
      (h.room ? "<dt>Camera</dt><dd>" + esc(h.room) + "</dd>" : "") +
      (h.address ? "<dt>Indirizzo</dt><dd>" + esc(h.address) + "</dd>" : "") + (h.access ? "<dt>Come si arriva</dt><dd>" + esc(h.access) + "</dd>" : "") +
      (h.phone ? '<dt>Telefono</dt><dd><a class="inl" href="tel:' + esc(h.phone.replace(/\s/g, "")) + '">' + esc(h.phone) + "</a></dd>" : "") +
      (h.hours ? "<dt>Orari</dt><dd>" + esc(h.hours) + "</dd>" : "") +
      "<dt>Pagamento</dt><dd>" + esc(hotelPayText(h)) + "</dd>" + (h.cancel ? "<dt>Cancellazione</dt><dd>" + esc(h.cancel) + "</dd>" : "") +
      (h.note ? "<dt>Note</dt><dd>" + esc(h.note) + "</dd>" : "") + "</dl>" + codesHtml(h) + "</div>";
  }
  // ---------- codici di prenotazione: SOLO su questo telefono (localStorage), mai nel sito pubblico ----------
  function codes() { return store("codes") || {}; }
  function fmtConf(c) {
    if (/[a-z]/i.test(c)) return String(c).toUpperCase();
    var d = String(c).replace(/\D/g, ""); return d.length === 10 ? d.slice(0, 4) + "." + d.slice(4, 7) + "." + d.slice(7) : d;
  }
  function codesHtml(h) {
    if (!/booking|airbnb/.test(h.app || "")) return "";
    var c = codes()[h.id], air = /airbnb/.test(h.app), brand = air ? "Airbnb" : "Booking";
    if (S.codeEdit === h.id) {
      return '<div class="codes"><b>Codici ' + brand + '</b><label>' + (air ? "Codice di conferma" : "N. di conferma") + '<input id="cc-conf" ' + (air ? 'autocapitalize="characters"' : 'inputmode="numeric"') + ' autocomplete="off" value="' + esc(c ? fmtConf(c.conf) : "") + '"></label>' +
        (air ? '<label>Telefono dell\'host<input id="cc-tel" inputmode="tel" autocomplete="off" value="' + esc(c && c.tel || "") + '"></label>'
          : '<label>PIN<input id="cc-pin" inputmode="numeric" autocomplete="off" value="' + esc(c ? c.pin : "") + '"></label>') +
        '<div class="btns"><button type="button" class="btn go" data-codes-save="' + esc(h.id) + '">Salva sul telefono</button><button type="button" class="btn" data-codes-cancel="1">Annulla</button>' +
        (c ? '<button type="button" class="btn" data-codes-del="' + esc(h.id) + '">Cancella</button>' : "") + "</div>" +
        '<small>Restano solo su questo telefono: non vanno sul sito, che è pubblico.</small></div>';
    }
    if (!c) return '<div class="codes empty"><span>' + icon("ticket") + (air ? "Codice di conferma e telefono dell'host" : "Numero di conferma e PIN") + ' non salvati su questo telefono</span><button type="button" class="btn small" data-codes-edit="' + esc(h.id) + '">Aggiungi</button></div>';
    return '<div class="codes"><b>' + icon("ticket") + "Codici " + brand + " <small>(solo su questo telefono)</small></b>" +
      '<div class="crow"><span>' + (air ? "Codice di conferma" : "N. di conferma") + '</span><b class="num">' + esc(fmtConf(c.conf)) + '</b><button type="button" class="btn small" data-copy="' + esc(air ? c.conf : String(c.conf).replace(/\D/g, "")) + '" data-copy-msg="Codice copiato">' + icon("copy") + "</button></div>" +
      (c.pin ? '<div class="crow"><span>PIN</span><b class="num">' + esc(c.pin) + '</b><button type="button" class="btn small" data-copy="' + esc(c.pin) + '" data-copy-msg="PIN copiato">' + icon("copy") + "</button></div>" : "") +
      (c.tel ? '<div class="crow"><span>Host</span><b class="num">' + esc(c.tel) + '</b><a class="btn small" href="tel:' + esc(c.tel.replace(/[^\d+]/g, "")) + '">' + icon("phone") + "</a></div>" : "") +
      '<button type="button" class="linkbtn" data-codes-edit="' + esc(h.id) + '">Modifica</button></div>';
  }
  function importCodes(txt) {
    var all = codes(), n = 0;
    String(txt).split(/[\n;]+/).forEach(function (line) {
      var tel = null, l = line.trim().replace(/\s+tel[:\s]+(\+?[\d\s-]{8,})$/i, function (_, t) { tel = t.trim(); return ""; });
      var m = l.match(/^([a-z0-9-]+)\s*[:=]?\s*([\d.]{8,}|[A-Z0-9]{8,12})(?:\s+(?:pin\s*)?(\d{3,6}))?$/i);
      if (m && HOTELS[m[1]] && (m[3] || /[a-z]/i.test(m[2]))) {
        var conf = /[a-z]/i.test(m[2]) ? m[2].toUpperCase() : m[2].replace(/\D/g, "");
        all[m[1]] = { conf: conf, pin: m[3] || "", tel: tel || (all[m[1]] && all[m[1]].tel) || "" }; n++;
      }
    });
    store("codes", all);
    return n;
  }
  function hotelPayText(h) {
    if (h.paid === "sì") return "Pagato" + (h.payer ? " da " + h.payer : "") + " · " + h.price;
    if (h.paid === "gruppo") return h.payment || "Quota del gruppo";
    return h.price + " · " + h.payment;
  }

  // ---------- riquadri a scomparsa in fondo al giorno ----------
  function fold(key, title, ic, body) {
    var o = !!S.fold[key];
    return '<section class="tips"><button type="button" data-fold="' + key + '" aria-expanded="' + o + '"><span class="fl">' + icon(ic) + "<span>" + title + "</span></span>" + icon("down", "chev") + "</button>" +
      '<div class="body"' + (o ? "" : " hidden") + ">" + body + "</div></section>";
  }
  function tipsHtml(d) {
    var g = d.guide || {};
    var secs = GUIDE.filter(function (x) { return g[x[0]]; });
    if (!secs.length) return "";
    return fold("tips", "Consigli per la giornata", "sparkles", secs.map(function (x) { return "<div><h3>" + esc(x[1]) + "</h3>" + bulletsHtml(g[x[0]]) + "</div>"; }).join(""));
  }
  function conv(from) {
    var y = document.getElementById("yen"), e = document.getElementById("eur");
    if (!y || !e) return;
    var raw = String((from === "yen" ? y : e).value).replace(/\s/g, "");
    var v = parseFloat(from === "yen" ? raw.replace(/[.,]/g, "") : raw.replace(/\./g, "").replace(",", "."));
    if (isNaN(v)) { (from === "yen" ? e : y).value = ""; return; }
    if (from === "yen") e.value = (v / RATE).toFixed(2).replace(".", ",");
    else y.value = Math.round(v * RATE);
  }

  // ---------- giro del giorno su Google Maps ----------
  function dayStops(i) {
    var d = D.days[i], stops = [], seen = {};
    function add(q) { if (q && !seen[q]) { seen[q] = 1; stops.push(q); } }
    d.items.forEach(function (it) {
      if (it.k === "sposta" || it.k === "viaggio") return;
      var p = it.place && D.places[it.place];
      if (p && !p.map) return;
      add(it.dest);
    });
    var last = d.sleep && HOTELS[d.sleep];
    if (last) add(last.q);
    return stops;
  }
  function routeChunks(stops) {
    var out = [], start = 0;
    while (start < stops.length - 1) {
      var end = Math.min(start + 9, stops.length - 1), part = stops.slice(start, end + 1);
      var u = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(part[0]) + "&destination=" + encodeURIComponent(part[part.length - 1]);
      if (part.length > 2) u += "&waypoints=" + encodeURIComponent(part.slice(1, -1).join("|"));
      out.push({ from: start + 1, to: end + 1, url: u });
      start = end;
    }
    return out;
  }
  function tourHtml(i) {
    var stops = dayStops(i);
    if (stops.length < 3) return "";
    var ch = routeChunks(stops);
    return '<div class="tour"><div class="tour-t">' + icon("route") + "<span><b>Tutto il giro di oggi</b><small>" + stops.length +
      " tappe in ordine, dall'hotel del mattino a quello della sera</small></span></div>" + '<div class="btns">' + ch.map(function (x, n) {
        return link(x.url, ch.length > 1 ? "Parte " + (n + 1) + " (tappe " + x.from + "–" + x.to + ")" : "Apri in Google Maps" + (PREF.maps === "apple" ? " (più tappe)" : ""), "go block", "map");
      }).join("") + "</div></div>";
  }

  // ---------- menu (i tre puntini): adesso, prenotazioni, cambio, codici, numeri utili, impostazioni ----------
  var MENU = [
    ["todo", "Da prenotare o sistemare", "alert"],
    ["hotels", "Prenotazioni hotel", "bed"],
    ["trains", "Treni, bus e voli", "train"],
    ["acts", "Attività e ristoranti", "ticket"],
    ["codes", "Codici delle prenotazioni", "copy"],
    ["money", "Yen ↔ euro", "yen"],
    ["rules", "Numeri utili e regole", "phone"],
    ["settings", "Impostazioni", "sparkles"]
  ];
  function allOpenTodos() {
    var out = [];
    D.todo.forEach(function (t) {
      if (done(t.id)) return;
      var a = (t.at && t.at[0]) || null, it = a ? D.days[a.d].items[a.i] : null;
      if (a && stateOf(a.d, a.i) === "past") return;
      out.push({ t: t, a: a, it: it });
    });
    out.sort(function (x, y) { return (x.a ? D.days[x.a.d].id + x.it.t : "") < (y.a ? D.days[y.a.d].id + y.it.t : "") ? -1 : 1; });
    return out;
  }
  function withWho(it) { return it && it.group ? '<span class="pill grp">' + icon("users") + "Col gruppo</span>" : '<span class="pill muted">' + icon("users") + "Voi due</span>"; }
  function whereOf(it, d) {
    var z = it && it.zone && D.zones && D.zones[it.zone];
    return z ? z.name : CITY[it && it.city] || CITY[d.route[d.route.length - 1]] || "";
  }
  function statusHtml() {
    var ph = phase(), r = partsIn(now(), "Europe/Rome").hm, tk = partsIn(now(), "Asia/Tokyo").hm, n = allOpenTodos().length;
    var h = '<div class="m-now"><div class="m-clock"><span>' + icon("clock") + "Italia <b class=\"num\">" + r + "</b></span><span>Giappone <b class=\"num\">" + tk + "</b></span></div>";
    if (ph === "before") {
      var dd = daysUntil(D.days[0].id, romeToday());
      h += '<p class="m-big">' + (dd === 0 ? "Si parte oggi!" : dd === 1 ? "Si parte domani" : "Mancano " + dd + " giorni alla partenza") + "</p>" +
        '<p class="m-sub">Siete a <b>Roma</b>, voi due. Volo giovedì 5/11 alle 15:05 da Fiumicino.</p>';
    } else if (ph === "after") {
      h += '<p class="m-big">Viaggio finito</p><p class="m-sub">Bentornati a Roma.</p>';
    } else {
      var tg = nowTarget(), d = D.days[tg.d], it = d.items[tg.i], nd = needs(it);
      h += '<p class="m-sub">' + esc(dLong(d.id)) + " · giorno " + d.n + "</p>" +
        '<p class="m-big">' + (tg.travel ? "In viaggio verso " : tg.rest ? "Riposo, poi " : "") + esc(it.title) + "</p>" +
        '<p class="m-sub">' + icon("pin") + esc(whereOf(it, d)) + " · alle " + esc(it.t) + "</p>" +
        '<div class="pills">' + withWho(it) + (nd ? '<span class="pill todo">' + icon("alert") + (nd === "book" ? "Da prenotare" : "Da sistemare") + "</span>"
          : it.status === "ok" || it.status === "paid" ? '<span class="pill ok">' + icon("check") + "Prenotato</span>" : "") + "</div>" +
        '<div class="btns"><button type="button" class="btn small go" data-jump="' + tg.d + "-" + tg.i + '">Vai alla tappa</button></div>';
    }
    return h + (n ? '<button type="button" class="m-todo" data-mpage="todo"><span class="nb2">' + n + "</span><span>" + (n === 1 ? "cosa ancora da prenotare o sistemare" : "cose ancora da prenotare o sistemare") + "</span>" + icon("right") + "</button>"
      : '<p class="m-ok">' + icon("circle-check") + "Tutto prenotato e sistemato</p>") + "</div>";
  }
  function stopRef(d, i) { var x = D.days[d], it = x.items[i]; return dShort(x.id) + " · " + it.t; }
  function findStop(pred) {
    for (var d = 0; d < D.days.length; d++) for (var i = 0; i < D.days[d].items.length; i++) { var it = D.days[d].items[i]; if (!it.merged && !it.start && pred(it)) return { d: d, i: i, it: it }; }
    return null;
  }
  function bookCard(o) {
    return '<div class="bk' + (o.red ? " red" : "") + '"><div class="bk-h"><span class="bk-i">' + icon(o.ic) + '</span><span class="bk-t"><b>' + esc(o.title) + "</b><small>" + esc(o.sub) + "</small></span></div>" +
      (o.lines || []).map(function (l) { return '<p class="bk-l">' + l + "</p>"; }).join("") +
      (o.pills ? '<div class="pills">' + o.pills + "</div>" : "") +
      '<div class="btns">' + (o.jump ? '<button type="button" class="btn small go" data-jump="' + o.jump + '">Vai alla tappa</button>' : "") + (o.btns || "") + "</div></div>";
  }
  function todoPillsFor(it) {
    return (it && it.todos || []).filter(function (id) { return !done(id); }).map(function (id) {
      var t = TODO[id]; return '<span class="pill ' + (t.kind === "prenotare" ? "todo" : "warn") + '">' + icon("alert") + esc(t.kind === "prenotare" ? "Da prenotare" : "Da sistemare") + "</span>" + todoPill(t);
    }).join("");
  }
  function pageHotels() {
    return D.hotels.slice().sort(function (a, b) { return a.in < b.in ? -1 : 1; }).map(function (h) {
      var s = findStop(function (it) { return it.hotel === h.id && it.k === "hotel"; }) || findStop(function (it) { return it.hotel === h.id; });
      var tp = "";
      D.days.forEach(function (d) { d.items.forEach(function (it) { if (it.hotel === h.id) tp += todoPillsFor(it); }); });
      var c = codes()[h.id];
      return bookCard({ ic: hotelMine(h) ? "bed" : "users", title: h.name, sub: hotelNights(h) + " · " + (h.city || ""), red: !!tp,
        lines: [esc(hotelWho(h)), "<b>Pagamento:</b> " + esc(hotelPayText(h)), h.cancel ? "<b>Cancellazione:</b> " + esc(h.cancel) : "", h.hours ? "<b>Orari:</b> " + esc(h.hours) : ""].filter(Boolean),
        pills: (hotelMine(h) ? '<span class="pill mine">' + icon("bed") + "Vostro</span>" : '<span class="pill grp">' + icon("users") + "Del gruppo</span>") +
          (/booking|airbnb/.test(h.app || "") ? (c ? '<span class="pill ok">' + icon("check") + "Codici salvati</span>" : '<span class="pill muted">Codici non salvati</span>') : "") + tp,
        jump: s ? s.d + "-" + s.i : "", btns: link(goto(h.q), "Indicazioni", "small", "nav") + (h.app ? link(h.app, /airbnb/.test(h.app) ? "App Airbnb" : "App Booking", "small", "ext") : "") });
    }).join("");
  }
  function pageTrains() {
    var list = D.trains.concat(D.flights || []).slice().sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; });
    return list.map(function (t) {
      var s = findStop(function (it) { return it.train === t.id; }), tp = s ? todoPillsFor(s.it) : "";
      var flight = (D.flights || []).indexOf(t) >= 0;
      return bookCard({ ic: flight ? "plane" : /bus/i.test(t.line) ? "bus" : "train", title: t.route, sub: (t.date ? dLong(t.date) : "") + (t.time ? " · " + t.time : ""), red: /da comprare/.test(t.status) || !!tp,
        lines: [esc(t.line), "<b>Biglietto:</b> " + esc(trainState(t)) + (t.price ? " · " + esc(t.price) : "")],
        pills: (s ? withWho(s.it) : "") + tp, jump: s ? s.d + "-" + s.i : "",
        btns: t.link ? link(t.link, /klook/.test(t.link) ? "Biglietto Klook" : "Prenota", "small", "ticket") : "" });
    }).join("");
  }
  function pageActs() {
    var out = [];
    D.days.forEach(function (d, di) {
      d.items.forEach(function (it, ii) {
        if (it.merged || ["vedere", "fare", "cibo"].indexOf(it.k) < 0) return;
        var book = (it.todos || []).some(function (id) { return TODO[id].kind === "prenotare"; });
        if (!it.status && !book) return;
        var nd = stateOf(di, ii) === "past" ? "" : needs(it), first = (it.todos || []).map(function (id) { return TODO[id]; }).filter(function (t) { return t.links && t.links.length; })[0];
        out.push(bookCard({ ic: itemIcon(it), title: it.title, sub: dShort(d.id) + " · " + it.t + " · " + whereOf(it, d), red: !!nd,
          lines: it.short ? [esc(it.short)] : [],
          pills: withWho(it) + (nd ? todoPillsFor(it) : '<span class="pill ok">' + icon("check") + (it.status === "paid" ? "Pagato" : "Prenotato") + "</span>"),
          jump: di + "-" + ii, btns: nd && first ? link(first.links[0].url, esc(first.links[0].label || "Prenota"), "small", "ext") : "" }));
      });
    });
    return out.join("") || '<p class="s-hint">Nessuna attività da prenotare.</p>';
  }
  function pageTodo() {
    var list = allOpenTodos();
    if (!list.length) return '<p class="m-ok">' + icon("circle-check") + "Tutto prenotato e sistemato.</p>";
    return '<p class="note-s">In ordine di data. «Vai alla tappa» apre il punto del programma con i pulsanti per prenotare e la spunta «Fatto».</p>' +
      list.map(function (x) {
        var t = x.t;
        return bookCard({ ic: "alert", title: t.task, sub: x.a ? stopRef(x.a.d, x.a.i) + " · " + x.it.title : "", red: t.kind === "prenotare",
          lines: [t.when ? esc(t.when) : "", t.cost ? esc(t.cost) : ""].filter(Boolean),
          pills: '<span class="pill ' + (t.kind === "prenotare" ? "todo" : "warn") + '">' + (t.kind === "prenotare" ? "Da prenotare" : "Da sistemare") + "</span>" + todoPill(t) + (x.it ? withWho(x.it) : ""),
          jump: x.a ? x.a.d + "-" + x.a.i : "" });
      }).join("");
  }
  function pageCodes() {
    var list = D.hotels.filter(function (h) { return /booking|airbnb/.test(h.app || ""); });
    return '<p class="note-s">Codici di conferma, PIN e telefono dell\'host restano <b>solo su questo telefono</b>: il sito è pubblico e con quei codici chiunque potrebbe modificare o cancellare la prenotazione. Ognuno li inserisce sul proprio telefono.</p>' +
      list.map(function (h) { return '<div class="bk"><div class="bk-h"><span class="bk-i">' + icon("bed") + '</span><span class="bk-t"><b>' + esc(h.name) + "</b><small>" + esc(hotelNights(h)) + "</small></span></div>" + codesHtml(h) + "</div>"; }).join("") +
      '<label class="imp">Incolla qui i codici ricevuti (una riga per hotel)<textarea id="cc-import" rows="4" autocomplete="off" spellcheck="false" placeholder="saibo 1234567890 0000"></textarea></label>' +
      '<div class="btns"><button type="button" class="btn go" data-codes-import="1">Salva sul telefono</button></div>';
  }
  function pageMoney() {
    return '<p class="note-s">Cambio fisso del viaggio: 1 € ≈ ' + RATE + " ¥.</p>" +
      '<div class="conv-row"><span class="cur">¥</span><input id="yen" inputmode="decimal" value="1000" aria-label="Yen"></div>' +
      '<div class="conv-row"><span class="cur">€</span><input id="eur" inputmode="decimal" aria-label="Euro"></div>' +
      '<div class="btns">' + [500, 1000, 3000, 5000, 10000].map(function (y) { return '<button type="button" class="btn small" data-yen="' + y + '">' + yen(y) + "</button>"; }).join("") + "</div>";
  }
  function pageRules() {
    return '<div class="m-rules"><div><h3>Emergenze</h3><p><a class="inl" href="tel:110">110</a> polizia · <a class="inl" href="tel:119">119</a> ambulanza e pompieri · ' +
      '<a class="inl" href="' + esc(mapsQ("Ambasciata d'Italia Tokyo")) + '" target="_blank" rel="noopener">Ambasciata d\'Italia a Tokyo</a></p></div>' +
      "<div><h3>Soldi</h3><p>Molti locali piccoli, mercati, templi e sale giochi vogliono contanti. Gli ATM dei konbini (i minimarket, es. 7-Eleven) accettano le carte estere. Le mance non si danno.</p></div>" +
      "<div><h3>Treni e metro</h3><p>La Suica (la tessera dei trasporti) nel Wallet dell'iPhone vale per metro, treni locali, bus e konbini. Per Shinkansen ed espressi servono i biglietti Klook. Sulle scale mobili a Tokyo si sta a sinistra, a Osaka a destra.</p></div>" +
      "<div><h3>Valigie</h3><p>Nelle stazioni ci sono armadietti a gettoni o con la Suica: quelli grandi finiscono presto. Gli hotel tengono le valigie prima del check-in e dopo il check-out.</p></div>" +
      "<div><h3>Templi e terme</h3><p>Nei templi spesso ci si toglie le scarpe. Negli onsen (bagni termali) si entra lavati e nudi, l'asciugamano piccolo non va in acqua; i tatuaggi grandi possono essere un problema.</p></div>" +
      "<div><h3>Strada</h3><p>I cestini sono rari: tenete un sacchetto. Mangiare camminando è malvisto nelle vie affollate.</p></div></div>";
  }
  function seg(key, val, opts) {
    return '<div class="seg2">' + opts.map(function (o) { return '<button type="button" data-pref="' + key + '" data-val="' + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + esc(o[1]) + "</button>"; }).join("") + "</div>";
  }
  function pageSettings() {
    return '<div class="set"><h3>Mappe per le indicazioni</h3><p class="note-s">Con quale app si aprono «Indicazioni» e i posti. «Tutto il giro» con più tappe resta su Google Maps (Mappe di Apple non lo permette da link).</p>' +
      seg("maps", PREF.maps, [["google", "Google Maps"], ["apple", "Mappe di Apple"]]) + "</div>" +
      '<div class="set"><h3>Aspetto</h3>' + seg("theme", PREF.theme, [["auto", "Automatico"], ["light", "Chiaro"], ["dark", "Scuro"]]) + "</div>" +
      '<div class="set"><h3>Dimensione del testo</h3>' + seg("size", PREF.size, [["s", "Più piccolo"], ["m", "Normale"], ["l", "Più grande"]]) + "</div>" +
      '<div class="set"><h3>All\'apertura durante il viaggio</h3>' + seg("openNow", PREF.openNow, [["true", "Vai a dove siete adesso"], ["false", "Resta sul giorno lasciato"]]) + "</div>" +
      '<div class="set"><h3>Suggerimenti</h3><p class="note-s">Il riquadro azzurro «Tocca una tappa…» in cima al giorno.</p><button type="button" class="btn small" data-hint-reset="1">Mostralo di nuovo</button></div>' +
      '<div class="set"><h3>Dati salvati su questo telefono</h3><p class="note-s">Spunte «Fatto», codici delle prenotazioni, meteo e foto. Cancellarli non tocca il programma.</p><button type="button" class="btn small" data-wipe="codes">Cancella i codici</button> <button type="button" class="btn small" data-wipe="done">Azzera le spunte «Fatto»</button></div>' +
      '<p class="foot-note">Versione ' + APP_V + " · dati del " + esc(D.generated || "") + "</p>";
  }
  var PAGES = { todo: pageTodo, hotels: pageHotels, trains: pageTrains, acts: pageActs, codes: pageCodes, money: pageMoney, rules: pageRules, settings: pageSettings };
  function menuHome() {
    var n = allOpenTodos().length;
    return statusHtml() + '<div class="m-list">' + MENU.map(function (m) {
      return '<button type="button" class="m-item" data-mpage="' + m[0] + '"><span class="m-ic">' + icon(m[2]) + '</span><span class="m-l">' + esc(m[1]) + "</span>" +
        (m[0] === "todo" && n ? '<b class="nb">' + n + "</b>" : "") + icon("right", "chev") + "</button>";
    }).join("") + "</div>";
  }
  function renderMenu() {
    var ov = document.getElementById("menu");
    if (!ov || !S.menu) return;
    var p = S.menu, title = p === "home" ? "Menu" : (MENU.filter(function (m) { return m[0] === p; })[0] || [0, ""])[1];
    ov.querySelector(".m-top").innerHTML = (p === "home" ? "" : '<button type="button" class="m-back" data-mpage="home">' + icon("left") + "Menu</button>") +
      "<h2>" + esc(title) + '</h2><button type="button" class="s-close" data-mclose="1">Chiudi</button>';
    var y = ov.querySelector(".s-body").scrollTop;
    ov.querySelector(".s-body").innerHTML = p === "home" ? menuHome() : PAGES[p]();
    if (p === "money") conv("yen");
    return y;
  }
  function openMenu(page) {
    var ov = document.getElementById("menu");
    if (!ov) {
      ov = document.createElement("div"); ov.id = "menu"; ov.className = "search-ov menu-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Menu");
      ov.innerHTML = '<div class="s-top m-top"></div><div class="s-body"></div>';
      document.body.appendChild(ov);
    }
    S.menu = page || "home"; ov.hidden = false; document.body.classList.add("noscroll");
    renderMenu(); ov.querySelector(".s-body").scrollTop = 0;
  }
  function closeMenu() { S.menu = null; var ov = document.getElementById("menu"); if (ov) ov.hidden = true; document.body.classList.remove("noscroll"); }
  // ridisegna la pagina (e il menu, se aperto) senza perdere la posizione
  function refresh() {
    var y = window.scrollY; render(true); window.scrollTo(0, y);
    if (S.menu) { var b = document.querySelector("#menu .s-body"), sy = b.scrollTop; renderMenu(); b.scrollTop = sy; }
  }
  // ---------- impostazioni ----------
  function applyPrefs() {
    var r = document.documentElement;
    if (PREF.theme === "light" || PREF.theme === "dark") r.setAttribute("data-theme", PREF.theme); else r.removeAttribute("data-theme");
    r.style.setProperty("--zoom", PREF.size === "s" ? ".93" : PREF.size === "l" ? "1.08" : "1");
  }

  // ---------- ricerca globale ----------
  // Capisce i nomi scritti a metà o con errori: confronta parole normalizzate (senza accenti e trattini,
  // «ou»/«oo» → «o») con una distanza di modifica che tollera 1–3 lettere sbagliate, più qualche sinonimo italiano.
  var IDX = [], LAST = [];
  var STOP = { di: 1, il: 1, la: 1, lo: 1, le: 1, gli: 1, per: 1, da: 1, del: 1, della: 1, dei: 1, in: 1, e: 1, a: 1, al: 1, the: 1, un: 1, una: 1, con: 1, che: 1, dove: 1, come: 1 };
  var TAGS = {
    cibo: "mangiare ristorante ristoranti cibo pranzo cena colazione food",
    hotel: "hotel albergo alloggio dormire camera checkin checkout",
    bagagli: "valigie valigia bagagli armadietti locker deposito",
    viaggio: "treno treni stazione biglietto viaggio",
    sposta: "spostamento indicazioni come arrivare",
    vedere: "visitare vedere visita", fare: "attivita esperienza fare"
  };
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ")
      .replace(/ou/g, "o").replace(/oo/g, "o").replace(/uu/g, "u").trim();
  }
  function words(s) { var w = norm(s).split(" ").filter(function (x) { return x && !STOP[x]; }); var u = {}; w.forEach(function (x) { u[x] = 1; }); return Object.keys(u); }
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev2 = null, prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i]; var best = i;
      for (j = 1; j <= b.length; j++) {
        var c = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v; if (v < best) best = v;
      }
      if (best > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[b.length];
  }
  function tokScore(t, ws) {
    var best = 0, max = t.length <= 4 ? 1 : (t.length <= 7 ? 2 : 3);
    for (var k = 0; k < ws.length; k++) {
      var w = ws[k], s = 0;
      if (w === t) s = 1;
      else if (w.indexOf(t) === 0) s = t.length >= 3 ? 0.9 : 0.5;
      else if (t.length >= 4 && w.indexOf(t) > 0) s = 0.7;
      else if (t.length >= 3) {
        var d = dist(t, w, max);
        if (d <= max) s = 0.85 - d * 0.15;
        else if (w.length > t.length) { var d2 = dist(t, w.slice(0, t.length), Math.max(1, max - 1)); if (d2 <= Math.max(1, max - 1)) s = 0.7 - d2 * 0.15; }
      }
      if (s > best) { best = s; if (best === 1) break; }
    }
    return best;
  }
  function addDoc(doc) {
    doc.tw = words(doc.title); doc.aw = words(doc.title + " " + doc.text);
    doc.tc = norm(doc.title).replace(/ /g, ""); doc.ac = norm(doc.title + " " + doc.text).replace(/ /g, "");
    IDX.push(doc);
  }
  function buildIndex() {
    IDX = [];
    D.days.forEach(function (d, di) {
      var dayWords = d.dm + " " + dLong(d.id) + " " + d.route.map(function (c) { return CITY[c]; }).join(" ");
      d.items.forEach(function (it, ii) {
        if (it.merged) return;
        var p = it.place && D.places[it.place], leg = it.leg != null ? d.items[it.leg] : null, t = it.train && TRAINS[it.train], h = it.hotel && HOTELS[it.hotel];
        var text = [it.short, (it.details || []).map(function (x) { return plain(x.text); }).join(" "), p ? p.name + " " + p.note : "",
          leg ? leg.title + " " + (leg.short || "") + " " + (leg.details || []).map(function (x) { return plain(x.text); }).join(" ") : "",
          t ? t.line + " " + t.route : "", h ? h.name : "", it.zone && D.zones && D.zones[it.zone] ? D.zones[it.zone].name + " " + D.zones[it.zone].what : "", TAGS[it.k] || "", it.bag ? TAGS.bagagli : "",
          (it.todos || []).map(function (id) { return TODO[id].task; }).join(" "), dayWords].join(" ");
        addDoc({ kind: "item", d: di, i: ii, k: it.k, title: it.title, sub: dShort(d.id) + " · " + it.t + (it.short ? " · " + it.short : ""), text: text, w: 1 });
      });
      addDoc({ kind: "day", d: di, title: dLong(d.id) + " · " + d.route.map(function (c) { return CITY[c]; }).join(" › "), sub: "Giorno " + d.n, text: d.guide.senso || "", w: 0.6 });
    });
    Object.keys(D.places).forEach(function (k) {
      var p = D.places[k];
      if (USED[k]) return;
      addDoc({ kind: "place", id: k, title: shortName(p.name), sub: p.city + (p.day ? " · " + p.day : "") + " · alternativa, non in programma", text: p.name + " " + p.note + " " + p.type + " " + p.city, w: 0.85 });
    });
  }
  function score(doc, toks, qc) {
    var base = 0;
    if (qc.length >= 3 && doc.tc.indexOf(qc) >= 0) base = doc.tc.indexOf(qc) === 0 ? 3.5 : 3;
    else if (qc.length >= 4 && doc.ac.indexOf(qc) >= 0) base = 1.4;
    else if (toks.length === 1 && qc.length >= 5) {
      var max = qc.length <= 7 ? 2 : 3, cand = [doc.tc.slice(0, qc.length + 1)];
      for (var w = 0; w + 1 < doc.tw.length; w++) cand.push(doc.tw[w] + doc.tw[w + 1]);
      for (var c = 0; c < cand.length; c++) if (dist(qc, cand[c], max) <= max) { base = 2.2; break; }
    }
    var tot = 0, miss = 0;
    toks.forEach(function (t) {
      var s = Math.max(tokScore(t, doc.tw) * 1.6, tokScore(t, doc.aw));
      if (!s) miss++;
      tot += s;
    });
    if (miss * 2 > toks.length && !base) return 0;
    return (base + (tot / toks.length) * (miss ? 0.5 : 1)) * doc.w;
  }
  function search(q) {
    // «da prenotare», «cosa manca»: tutte le tappe con qualcosa in sospeso, in ordine di data
    if (/^(cosa )?(da prenotare|da fare|da sistemare|manca|mancano|prenotazioni)/.test(norm(q))) {
      var out = [];
      IDX.forEach(function (doc) {
        if (doc.kind === "item" && stateOf(doc.d, doc.i) !== "past" && needs(D.days[doc.d].items[doc.i])) out.push({ doc: doc, s: 10 });
      });
      return out;
    }
    var toks = words(q), qc = toks.join("");
    if (!toks.length) return [];
    return IDX.map(function (doc) { return { doc: doc, s: score(doc, toks, qc) }; })
      .filter(function (r) { return r.s >= 0.55; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, 30);
  }
  var KIND = { item: "Tappa", day: "Giorno", place: "Alternativa" };
  function resultsHtml(q) {
    if (!norm(q)) {
      return '<p class="s-hint">Scrivi un posto, un piatto, una città, un treno o un hotel: va bene anche scritto male.</p><div class="s-sugg">' +
        ["da prenotare", "bambù", "ramen", "shinkansen", "valigie", "onsen", "kiomizu", "hotel kyoto"].map(function (x) { return '<button type="button" data-sq="' + esc(x) + '">' + esc(x) + "</button>"; }).join("") + "</div>";
    }
    if (!LAST.length) return '<p class="s-hint">Niente trovato per «' + esc(q) + "». Prova con un'altra parola.</p>";
    return '<div class="s-list">' + LAST.map(function (r, n) {
      var d = r.doc, it = d.kind === "item" ? D.days[d.d].items[d.i] : null;
      var tc = it ? "var(--t-" + it.k + ")" : "var(--blue)";
      var ic = it ? itemIcon(it) : { day: "cal", place: "pin" }[d.kind];
      var nd = it && needs(it);
      var h = '<button type="button" class="s-item" data-res="' + n + '" style="--tc:' + tc + '"><span class="s-ic">' + icon(ic) + '</span><span class="s-tx"><b>' + esc(d.title) +
        "</b><small>" + esc(d.sub) + '</small></span><span class="s-k' + (nd ? " red" : "") + '">' + (nd ? (nd === "book" ? "Da prenotare" : "Da sistemare") : KIND[d.kind]) + "</span></button>";
      if (d.kind === "place") {
        var p = D.places[d.id];
        h += '<div class="s-extra" hidden data-for="' + n + '"><div class="btns">' + link(goto(p.q), "Indicazioni", "small go", "nav") +
          (p.ta ? link(p.ta, "Tripadvisor", "small", "star") : "") + (p.tabelog ? link(p.tabelog, "Tabelog", "small", "star") : "") + (p.web ? link(p.web, "Sito", "small", "ext") : "") + "</div></div>";
      }
      return h;
    }).join("") + "</div>";
  }
  function openSearch() {
    S.searching = true;
    var ov = document.getElementById("search");
    if (!ov) {
      ov = document.createElement("div"); ov.id = "search"; ov.className = "search-ov"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Cerca");
      ov.innerHTML = '<div class="s-top"><label class="s-box">' + icon("search") + '<input id="gq" type="search" placeholder="Cerca qualsiasi cosa" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"></label>' +
        '<button type="button" class="s-close" data-sclose="1">Chiudi</button></div><div class="s-body" id="sres"></div>';
      document.body.appendChild(ov);
    }
    ov.hidden = false;
    document.body.classList.add("noscroll");
    var inp = document.getElementById("gq");
    inp.value = S.q || "";
    updateResults();
    inp.focus();
  }
  function closeSearch() {
    S.searching = false;
    var ov = document.getElementById("search");
    if (ov) ov.hidden = true;
    document.body.classList.remove("noscroll");
  }
  function updateResults() {
    var q = document.getElementById("gq").value;
    S.q = q;
    LAST = norm(q) ? search(q) : [];
    document.getElementById("sres").innerHTML = resultsHtml(q);
  }
  function goResult(n) {
    var d = LAST[n] && LAST[n].doc;
    if (!d) return;
    if (d.kind === "place") { var ex = document.querySelector('.s-extra[data-for="' + n + '"]'); if (ex) ex.hidden = !ex.hidden; return; }
    closeSearch();
    if (d.kind === "item") { openStop(d.d, d.i); return; }
    if (d.kind === "day") { S.day = d.d; S.open = {}; render(); }
  }

  // ---------- navigazione ----------
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var bar = document.getElementById("topbar"), top = el.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight + 12 : 92);
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }
  function openStop(d, i) {
    S.day = d; S.open = {}; S.open[d + "-" + i] = true;
    render(); scrollToId("s-" + d + "-" + i);
  }
  // Va al giorno e alla tappa di adesso, con la tappa aperta.
  function jumpToNow() {
    if (phase() !== "live") return false;
    var tgt = nowTarget();
    if (!tgt) return false;
    openStop(tgt.d, tgt.i);
    return true;
  }
  // La barra in alto prende ombra e una leggera sfocatura solo quando si scende, mai in cima alla pagina.
  function onScroll() { document.body.classList.toggle("scrolled", window.scrollY > 12); }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, [data-day]");
    if (!t || t.tagName === "A") return;
    var ds = t.dataset;
    if (ds.menu) { openMenu("home"); return; }
    if (ds.mpage) { S.menu = ds.mpage; renderMenu(); document.querySelector("#menu .s-body").scrollTop = 0; return; }
    if (ds.mclose) { closeMenu(); return; }
    if (ds.pref) {
      var v = ds.val === "true" ? true : ds.val === "false" ? false : ds.val;
      PREF[ds.pref] = v; store("prefs", PREF); applyPrefs(); refresh(); return;
    }
    if (ds.hintReset) { store("hinted", false); refresh(); toast("Il suggerimento è tornato in cima al giorno"); return; }
    if (ds.wipe === "codes") { store("codes", {}); refresh(); toast("Codici cancellati da questo telefono"); return; }
    if (ds.wipe === "done") { D.todo.forEach(function (t) { store("todo:" + t.id, false); }); buildIndex(); refresh(); toast("Spunte azzerate"); return; }
    if (ds.search) { if (S.menu) closeMenu(); openSearch(); return; }
    if (ds.sclose) { closeSearch(); return; }
    if (ds.sq) { document.getElementById("gq").value = ds.sq; updateResults(); return; }
    if (ds.res !== undefined) { goResult(parseInt(ds.res, 10)); return; }
    if (ds.open) {
      var open = !S.open[ds.open]; S.open[ds.open] = open;
      if (!store("hinted")) { store("hinted", true); var hn = view.querySelector(".hint"); if (hn) hn.remove(); }
      var row = document.querySelector('.row[data-open="' + ds.open + '"]'); if (row) row.setAttribute("aria-expanded", open);
      var p = document.getElementById("p-" + ds.open); if (p) p.hidden = !open;
      return;
    }
    if (ds.day !== undefined && ds.day !== "") {
      var n = parseInt(ds.day, 10);
      if (n >= 0 && n < D.days.length) { S.day = n; S.open = {}; render(); }
      return;
    }
    if (ds.now) { jumpToNow(); return; }
    if (ds.jump) { if (S.menu) closeMenu(); var pr = ds.jump.split("-"); openStop(+pr[0], +pr[1]); return; }
    if (ds.issues) {
      var first = null;
      S.open = {};
      D.days[S.day].items.forEach(function (it, k) { if (!it.merged && stateOf(S.day, k) !== "past" && needs(it)) { S.open[S.day + "-" + k] = true; if (!first) first = "s-" + S.day + "-" + k; } });
      render(true); if (first) scrollToId(first); return;
    }
    if (ds.codesEdit) { S.codeEdit = ds.codesEdit; refresh(); return; }
    if (ds.codesCancel) { S.codeEdit = null; refresh(); return; }
    if (ds.codesDel) { var cd0 = codes(); delete cd0[ds.codesDel]; store("codes", cd0); S.codeEdit = null; refresh(); return; }
    if (ds.codesSave) {
      var pinEl = document.getElementById("cc-pin"), telEl = document.getElementById("cc-tel"), raw = (document.getElementById("cc-conf").value || "").trim();
      var cf = /[a-z]/i.test(raw) ? raw.replace(/[^a-z0-9]/gi, "").toUpperCase() : raw.replace(/\D/g, "");
      var pn = pinEl ? (pinEl.value || "").replace(/\D/g, "") : "", tl = telEl ? (telEl.value || "").trim() : "";
      if (cf.length < 8 || (pinEl && pn.length < 3)) { toast("Controlla i codici"); return; }
      var cd1 = codes(); cd1[ds.codesSave] = { conf: cf, pin: pn, tel: tl }; store("codes", cd1); S.codeEdit = null;
      refresh(); toast("Salvati solo su questo telefono"); return;
    }
    if (ds.codesImport) {
      var n = importCodes(document.getElementById("cc-import").value);
      refresh();
      toast(n ? n + (n === 1 ? " hotel salvato" : " hotel salvati") + " sul telefono" : "Nessun codice riconosciuto"); return;
    }
    if (ds.sleep) {
      S.sleep = !S.sleep; t.setAttribute("aria-expanded", S.sleep);
      var sb = document.getElementById("sleepbox"); if (sb) sb.hidden = !S.sleep;
      return;
    }
    if (ds.fold) {
      S.fold[ds.fold] = !S.fold[ds.fold]; t.setAttribute("aria-expanded", S.fold[ds.fold]); t.nextElementSibling.hidden = !S.fold[ds.fold];
      if (ds.fold === "money" && S.fold.money) conv("yen");
      return;
    }
    if (ds.todo) { store("todo:" + ds.todo, !done(ds.todo)); var y = window.scrollY; render(true); window.scrollTo(0, y); buildIndex(); return; }
    if (ds.yen) { document.getElementById("yen").value = ds.yen; conv("yen"); return; }
    if (ds.copy) {
      var txt = ds.copy;
      var msg = ds.copyMsg || "Indirizzo copiato";
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast(msg); }, function () {});
    }
  });
  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.id === "gq") updateResults();
    if (t.id === "yen") conv("yen");
    if (t.id === "eur") conv("eur");
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && S.searching) closeSearch();
    if (ev.key === "Escape" && S.menu) closeMenu();
    if (ev.key === "Enter" && ev.target.id === "gq") { ev.target.blur(); if (LAST.length) goResult(0); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { lastHidden = Date.now(); return; }
    wxLoad();
    if (!D || S.searching) return;
    // tornando nell'app dopo un po', si riparte da dove dovreste essere adesso
    if (S.menu) { renderMenu(); return; }
    if (PREF.openNow && Date.now() - lastHidden > 10 * 60000 && jumpToNow()) return;
    var y = window.scrollY; render(true); window.scrollTo(0, y);
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  // scorrere il dito a destra o a sinistra cambia giorno
  var sw = null;
  view.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1 || e.target.closest(".daystrip")) { sw = null; return; }
    sw = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  view.addEventListener("touchend", function (e) {
    if (!sw) return;
    var dx = e.changedTouches[0].clientX - sw.x, dy = e.changedTouches[0].clientY - sw.y, dt = Date.now() - sw.t;
    sw = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6 || dt > 700) return;
    var n = S.day + (dx < 0 ? 1 : -1);
    if (n < 0 || n >= D.days.length) return;
    S.day = n; S.open = {}; render();
  }, { passive: true });

  setInterval(function () {
    if (D && !document.hidden && WX && Date.now() - WX.t > 3 * 3600000) wxLoad(true);
    if (D && !document.hidden && !S.searching && !S.menu && phase() === "live") {
      // aggiorna passato/adesso senza chiudere le tappe aperte
      var y = window.scrollY; render(true); window.scrollTo(0, y);
    }
  }, 60000);

  applyPrefs();
  function boot(data) {
    D = data;
    RATE = D.rate || 185;
    D.trains.forEach(function (t) { TRAINS[t.id] = t; });
    D.hotels.forEach(function (h) { HOTELS[h.id] = h; });
    D.todo.forEach(function (t) { TODO[t.id] = t; });
    D.days.forEach(function (d) { d.items.forEach(function (it) { if (it.place) USED[it.place] = 1; }); });
    buildTimeline();
    buildIndex();
    setTimeout(loadPhotos, 300);
    wxLoad();
    if (PREF.openNow && jumpToNow()) return;
    var saved = store("state") || {};
    S.day = saved.day != null && saved.day < D.days.length ? saved.day : currentDay();
    render();
  }

  fetch("data.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(boot).catch(function () {
    view.innerHTML = '<div class="empty"><h1 class="page-title">Dati non disponibili</h1><p>Non riesco a leggere i dati. Se siete offline, aprite il sito una volta con internet: da lì in poi funziona anche senza rete.</p><button type="button" class="btn go" onclick="location.reload()">Riprova</button></div>';
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
    // quando arriva una versione nuova del sito, la si carica subito (una volta sola)
    var reloaded = false, hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (reloaded || !D || !hadController) return;
      reloaded = true;
      if (document.hidden || performance.now() < 15000) location.reload();
    });
  }
})();
