/* Back office: esegue build.py (lo stesso del repository) dentro il browser con Pyodide (Python in WebAssembly).
   Riceve {id, text, build} e risponde {id, code, out, data}: code 0 = ok, out = quello che stampa build.py,
   data = il data.json generato (stringa) da pubblicare insieme a viaggio.md. */
importScripts("https://cdn.jsdelivr.net/npm/pyodide@0.29.5/pyodide.js");

var RUN = [
  "import io, sys, runpy, contextlib, os",
  "sys.argv = ['build.py']",
  "if os.path.exists('/w/data.json'): os.remove('/w/data.json')",
  "_buf = io.StringIO(); _code = 0",
  "with contextlib.redirect_stdout(_buf):",
  "    try:",
  "        runpy.run_path('/w/build.py', run_name='__main__')",
  "    except SystemExit as e:",
  "        _code = e.code if isinstance(e.code, int) else (0 if e.code is None else 1)",
  "    except Exception as e:",
  "        _code = 2",
  "        print('ERRORE: build.py si è fermato:', type(e).__name__, e)",
  "_out = _buf.getvalue()",
  "_data = open('/w/data.json', encoding='utf-8').read() if os.path.exists('/w/data.json') else ''"
].join("\n");

var ready = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/npm/pyodide@0.29.5/" }).then(function (py) {
  py.FS.mkdirTree("/w");
  return py;
});
ready.then(function () { postMessage({ type: "ready" }); }, function (e) { postMessage({ type: "fail", error: String(e) }); });

var lastBuild = null;
onmessage = function (e) {
  var m = e.data;
  ready.then(function (py) {
    if (m.build && m.build !== lastBuild) { py.FS.writeFile("/w/build.py", m.build); lastBuild = m.build; }
    py.FS.writeFile("/w/viaggio.md", m.text);
    py.runPython(RUN);
    postMessage({ type: "result", id: m.id, code: py.globals.get("_code"), out: py.globals.get("_out"), data: py.globals.get("_data") });
  }).catch(function (err) {
    postMessage({ type: "result", id: m.id, code: 3, out: "ERRORE: Python non disponibile nel browser (" + err + ")", data: "" });
  });
};
