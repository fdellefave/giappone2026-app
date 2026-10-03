#!/usr/bin/env python3
"""Genera data.json (letto dal sito) da viaggio.md, la fonte unica dei dati del viaggio.

Uso:  python3 build.py            → scrive data.json e stampa gli avvisi
      python3 build.py --check    → solo controlli, non scrive nulla

Controlla che ogni riferimento (posto:, alloggio:, treno:, #posto, @alloggio, città) esista
e che gli orari di ogni giorno siano in ordine. Nessuna dipendenza esterna.
"""
import datetime as dt
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "viaggio.md"
OUT = ROOT / "data.json"

CITIES = {"roma": "Roma", "tokyo": "Tokyo", "kawaguchiko": "Kawaguchiko", "kamakura": "Kamakura",
          "kyoto": "Kyoto", "takayama": "Takayama", "osaka": "Osaka"}
KIND = {"*": "act", ">": "move", ">>": "long", "@": "stay"}
MODE = {"mezzi": "transit", "piedi": "walking", "taxi": "driving"}
GUIDE_KEYS = ["senso", "mangiare", "prenotare", "attenzione", "anticipo", "stanchi", "camminata"]
WD = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def sections(text):
    """{'Giorni': [righe], ...} per le sezioni '## '."""
    out, cur = {}, None
    for line in text.splitlines():
        if line.startswith("## "):
            cur = line[3:].strip()
            out[cur] = []
        elif cur is not None:
            out[cur].append(line)
    return out


def entries(lines):
    """Voci '### id' con le loro righe."""
    out, cur = [], None
    for line in lines:
        if line.startswith("### "):
            cur = [line[4:].strip(), []]
            out.append(cur)
        elif cur is not None:
            cur[1].append(line)
    return out


KV = re.compile(r"^([a-zà-ù ]+):\s*(.*)$")


def fields(lines):
    d = {}
    for line in lines:
        m = KV.match(line.strip())
        if m and line == line.lstrip():
            d[m.group(1).strip()] = m.group(2).strip()
    return d


def gmaps(q):
    return "https://www.google.com/maps/search/?api=1&query=" + quote(q)


def parse_places(lines):
    places = {}
    for pid, body in entries(lines):
        f = fields(body)
        if pid in places:
            err(f"Posti: id doppio «{pid}»")
        if f.get("città") not in CITIES:
            err(f"Posti/{pid}: città sconosciuta «{f.get('città')}»")
        places[pid] = {
            "id": pid, "name": f.get("nome", pid), "type": f.get("tipo", ""), "cityId": f.get("città"),
            "city": CITIES.get(f.get("città"), f.get("città")), "day": f.get("giorno", ""), "note": f.get("nota", ""),
            "q": f.get("maps", f.get("nome", pid)), "ta": f.get("tripadvisor"), "tabelog": f.get("tabelog"),
            "score": f.get("voto"), "web": f.get("sito"), "map": f.get("mappa", "sì") != "no",
        }
        places[pid]["maps"] = gmaps(places[pid]["q"])
    return places


def parse_hotels(lines):
    hotels = {}
    for hid, body in entries(lines):
        f = fields(body)
        try:
            d_in, d_out = dt.date.fromisoformat(f["dal"]), dt.date.fromisoformat(f["al"])
        except (KeyError, ValueError):
            err(f"Alloggi/{hid}: date «dal»/«al» mancanti o non valide")
            continue
        paid = f.get("pagato", "")
        hotels[hid] = {
            "id": hid, "name": f.get("nome", hid), "cityId": f.get("città"), "city": CITIES.get(f.get("città"), ""),
            "in": d_in.isoformat(), "out": d_out.isoformat(), "nights": (d_out - d_in).days,
            "price": float(f["prezzo"]) if f.get("prezzo") else None, "paid": paid,
            "paidState": "ok" if paid.lower().startswith("sì") else ("group" if "gruppo" in paid else "todo"),
            "address": f.get("indirizzo", ""), "access": f.get("arrivo", ""), "hours": f.get("orari", ""),
            "q": f.get("maps", f.get("nome", hid)),
        }
    return hotels


def parse_trains(lines):
    trains = {}
    for tid, body in entries(lines):
        f = fields(body)
        st = f.get("stato", "")
        trains[tid] = {
            "id": tid, "date": f.get("data"), "route": f.get("tratta", ""), "line": f.get("mezzo", ""),
            "time": f.get("orario", ""), "price": f.get("prezzo", ""), "link": f.get("link"), "note": f.get("nota", ""),
            "status": "ok" if st == "prenotato" else ("todo" if st == "da comprare" else "info"), "statusText": st,
        }
    return trains


def parse_todo(lines):
    out = []
    for tid, body in entries(lines):
        f = fields(body)
        out.append({"id": tid, "task": f.get("cosa", tid), "when": f.get("quando", ""), "prio": f.get("priorità", "media"),
                    "note": f.get("nota", "")})
    return out


def parse_budget(lines):
    out = []
    for line in lines:
        m = re.match(r"^- (.+?):\s*([\d.]+)\s*(?:\|\s*(.*))?$", line.strip())
        if m:
            out.append({"item": m.group(1), "eur": float(m.group(2)), "note": (m.group(3) or "").strip()})
    return out


def parse_glossary(lines):
    out, cat = [], ""
    for line in lines:
        if line.startswith("### "):
            cat = line[4:].strip()
        m = re.match(r"^- (.+?):\s+(.+)$", line.strip())
        if m:
            out.append({"term": m.group(1), "means": m.group(2), "cat": cat})
    return out


ITEM = re.compile(r"^- (\d{2}:\d{2}) (>>|>|\*|@) (.+)$")
VIA = re.compile(r"^via (mezzi|piedi|taxi):\s*(.+?)\s*>\s*(.+?)(?:\s*\((.+)\))?$")


def resolve(ref, places, hotels, where):
    if ref.startswith("#"):
        p = places.get(ref[1:])
        if not p:
            err(f"{where}: posto sconosciuto «{ref}»")
            return ref[1:]
        return p["q"]
    if ref.startswith("@"):
        h = hotels.get(ref[1:])
        if not h:
            err(f"{where}: alloggio sconosciuto «{ref}»")
            return ref[1:]
        return h["q"]
    return ref


def best_link(p):
    if p.get("ta"):
        return {"url": p["ta"], "label": "Tripadvisor"}
    if p.get("tabelog"):
        return {"url": p["tabelog"], "label": "Tabelog"}
    if p.get("web") and p["type"].startswith(("🎢", "🏡")):
        return {"url": p["web"], "label": "Sito"}
    return {"url": p["maps"], "label": "Maps"}


def parse_days(lines, places, hotels, trains):
    days = []
    for n, (did, body) in enumerate(entries(lines), start=1):
        try:
            date = dt.date.fromisoformat(did)
        except ValueError:
            err(f"Giorni: data non valida «{did}»")
            continue
        head, items_l, guide_l, mode = [], [], [], "head"
        for line in body:
            if line.startswith("#### Guida"):
                mode = "guide"
            elif mode != "guide" and line.startswith("- "):
                mode = "items"
                items_l.append(line)
            elif mode == "head":
                head.append(line)
            elif mode == "guide":
                guide_l.append(line)
        f = fields(head)
        route = [c.strip() for c in f.get("percorso", "").split(">") if c.strip()]
        for c in route:
            if c not in CITIES:
                err(f"{did}: città sconosciuta nel percorso «{c}»")
        sleep = f.get("dorme", "")
        if sleep not in hotels and sleep != "volo":
            err(f"{did}: alloggio sconosciuto in «dorme: {sleep}»")
        city = route[0] if route else "tokyo"
        items, last_t = [], "00:00"
        for line in items_l:
            m = ITEM.match(line.strip())
            if not m:
                err(f"{did}: riga non riconosciuta «{line.strip()[:60]}»")
                continue
            t, sym, rest = m.groups()
            if t < last_t:
                warn(f"{did}: orario fuori ordine {t} dopo {last_t}")
            last_t = t
            parts = [p.strip() for p in rest.split(" | ")]
            item = {"t": t, "k": KIND[sym], "text": parts[0]}
            for a in parts[1:]:
                where = f"{did} {t}"
                if a.startswith("posto: "):
                    pid = a[7:].strip()
                    if pid not in places:
                        err(f"{where}: posto sconosciuto «{pid}»")
                    else:
                        item["place"] = pid
                        item["link"] = best_link(places[pid])
                elif a.startswith("alloggio: "):
                    hid = a[10:].strip()
                    if hid not in hotels:
                        err(f"{where}: alloggio sconosciuto «{hid}»")
                    item["hotel"] = hid
                elif a.startswith("treno: "):
                    tid = a[7:].strip()
                    if tid not in trains:
                        err(f"{where}: treno sconosciuto «{tid}»")
                    else:
                        item["train"] = tid
                        if trains[tid].get("link") and "link" not in item:
                            item["link"] = {"url": trains[tid]["link"], "label": "Biglietto"}
                elif a.startswith("città: "):
                    c = a[7:].strip()
                    if c not in CITIES:
                        err(f"{where}: città sconosciuta «{c}»")
                    city = c
                elif a == "prenotare":
                    item["status"] = "todo"
                elif a == "prenotato":
                    item["status"] = "ok"
                elif a.startswith("via "):
                    v = VIA.match(a)
                    if not v:
                        err(f"{where}: «via» non riconosciuto «{a[:50]}»")
                        continue
                    mode_it, o, d, lab = v.groups()
                    url = ("https://www.google.com/maps/dir/?api=1&origin=" + quote(resolve(o, places, hotels, where)) +
                           "&destination=" + quote(resolve(d, places, hotels, where)) + "&travelmode=" + MODE[mode_it])
                    item.setdefault("routes", []).append({"label": lab or "Indicazioni", "mode": MODE[mode_it], "url": url})
                else:
                    err(f"{where}: attributo sconosciuto «{a[:40]}»")
            item["city"] = "transit" if item["k"] == "long" else city
            items.append(item)
        for i, it in enumerate(items):
            it["end"] = items[i + 1]["t"] if i + 1 < len(items) else "24:00"
        guide, key = {}, None
        for line in guide_l:
            m = KV.match(line.strip())
            if m and not line.startswith(" ") and m.group(1) in GUIDE_KEYS:
                key = m.group(1)
                guide[key] = m.group(2).strip()
            elif key and line.strip().startswith("•"):
                guide[key] = (guide[key] + "\n" + line.strip()).strip()
        for k in guide:
            if k not in GUIDE_KEYS:
                warn(f"{did}: voce guida sconosciuta «{k}»")
        h = hotels.get(sleep)
        days.append({
            "id": did, "n": n, "dm": f"{date.day}/{date.month}", "wd": WD[date.weekday()], "route": route,
            "sleep": sleep, "sleepName": h["name"] if h else ("In volo" if sleep == "volo" else sleep),
            "sleepCity": h["cityId"] if h else None, "with": f.get("con", ""), "items": items, "guide": guide,
        })
    return days


def main():
    text = SRC.read_text(encoding="utf-8")
    S = sections(text)
    for need in ("Giorni", "Alloggi", "Treni", "Posti", "Da fare", "Budget", "Glossario", "Info"):
        if need not in S:
            err(f"manca la sezione «## {need}»")
    if errors:
        print("\n".join("ERRORE: " + e for e in errors))
        return 1
    places = parse_places(S["Posti"])
    hotels = parse_hotels(S["Alloggi"])
    trains = parse_trains(S["Treni"])
    days = parse_days(S["Giorni"], places, hotels, trains)
    info = fields(S["Info"])
    day_dm = {d["dm"] for d in days}
    for pid, p in places.items():
        if p["day"] and p["day"] not in day_dm:
            err(f"Posti/{pid}: giorno «{p['day']}» fuori dal viaggio")
    data = {
        "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "departure": info.get("partenza"), "rate": float(info.get("cambio", 185)),
        "days": days, "hotels": list(hotels.values()), "trains": list(trains.values()),
        "todo": parse_todo(S["Da fare"]), "budget": parse_budget(S["Budget"]),
        "places": list(places.values()), "glossary": parse_glossary(S["Glossario"]),
    }
    for w in warnings:
        print("avviso:", w)
    if errors:
        print("\n".join("ERRORE: " + e for e in errors))
        return 1
    n_items = sum(len(d["items"]) for d in days)
    n_routes = sum(len(it.get("routes", [])) for d in days for it in d["items"])
    print(f"ok: {len(days)} giorni · {n_items} tappe · {n_routes} indicazioni · {len(places)} posti · "
          f"{len(hotels)} alloggi · {len(trains)} treni · {len(data['todo'])} cose da fare · {len(data['glossary'])} termini")
    if "--check" not in sys.argv:
        OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print("scritto", OUT.name)
    return 0


if __name__ == "__main__":
    sys.exit(main())
