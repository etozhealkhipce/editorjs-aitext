var zt = Object.defineProperty;
var Qt = (n, e, t) => e in n ? zt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var Be = (n, e, t) => (Qt(n, typeof e != "symbol" ? e + "" : e, t), t);
const D = "4.17.3";
let dt = !1, J, xt, Pt, qe, Rt, St, At, Et, $t;
function Yt(n, e = { auto: !1 }) {
  if (dt)
    throw new Error(`you must \`import 'openai/shims/${n.kind}'\` before importing anything else from openai`);
  if (J)
    throw new Error(`can't \`import 'openai/shims/${n.kind}'\` after \`import 'openai/shims/${J}'\``);
  dt = e.auto, J = n.kind, xt = n.fetch, n.Request, n.Response, n.Headers, Pt = n.FormData, n.Blob, qe = n.File, Rt = n.ReadableStream, St = n.getMultipartRequestOptions, At = n.getDefaultAgent, Et = n.fileFromPath, $t = n.isFsReadStream;
}
class Zt {
  constructor(e) {
    this.body = e;
  }
  get [Symbol.toStringTag]() {
    return "MultipartBody";
  }
}
function en({ manuallyImported: n } = {}) {
  const e = n ? "You may need to use polyfills" : "Add one of these imports before your first `import … from 'openai'`:\n- `import 'openai/shims/node'` (if you're running on Node)\n- `import 'openai/shims/web'` (otherwise)\n";
  let t, s, r, i;
  try {
    t = fetch, s = Request, r = Response, i = Headers;
  } catch (a) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${a.message}. ${e}`);
  }
  return {
    kind: "web",
    fetch: t,
    Request: s,
    Response: r,
    Headers: i,
    FormData: (
      // @ts-ignore
      typeof FormData < "u" ? FormData : class {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${e}`);
        }
      }
    ),
    Blob: typeof Blob < "u" ? Blob : class {
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${e}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File < "u" ? File : class {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${e}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream < "u" ? ReadableStream : class {
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${e}`);
        }
      }
    ),
    getMultipartRequestOptions: async (a, o) => ({
      ...o,
      body: new Zt(a)
    }),
    getDefaultAgent: (a) => {
    },
    fileFromPath: () => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
    },
    isFsReadStream: (a) => !1
  };
}
J || Yt(en(), { auto: !0 });
class m extends Error {
}
class _ extends m {
  constructor(e, t, s, r) {
    super(`${_.makeMessage(e, t, s)}`), this.status = e, this.headers = r;
    const i = t;
    this.error = i, this.code = i == null ? void 0 : i.code, this.param = i == null ? void 0 : i.param, this.type = i == null ? void 0 : i.type;
  }
  static makeMessage(e, t, s) {
    const r = t != null && t.message ? typeof t.message == "string" ? t.message : JSON.stringify(t.message) : t ? JSON.stringify(t) : s;
    return e && r ? `${e} ${r}` : e ? `${e} status code (no body)` : r || "(no status code or body)";
  }
  static generate(e, t, s, r) {
    if (!e)
      return new Ie({ cause: Xe(t) });
    const i = t == null ? void 0 : t.error;
    return e === 400 ? new Tt(e, i, s, r) : e === 401 ? new vt(e, i, s, r) : e === 403 ? new Ft(e, i, s, r) : e === 404 ? new It(e, i, s, r) : e === 409 ? new Mt(e, i, s, r) : e === 422 ? new kt(e, i, s, r) : e === 429 ? new Ot(e, i, s, r) : e >= 500 ? new Lt(e, i, s, r) : new _(e, i, s, r);
  }
}
class j extends _ {
  constructor({ message: e } = {}) {
    super(void 0, void 0, e || "Request was aborted.", void 0), this.status = void 0;
  }
}
class Ie extends _ {
  constructor({ message: e, cause: t }) {
    super(void 0, void 0, e || "Connection error.", void 0), this.status = void 0, t && (this.cause = t);
  }
}
class Ze extends Ie {
  constructor({ message: e } = {}) {
    super({ message: e ?? "Request timed out." });
  }
}
class Tt extends _ {
  constructor() {
    super(...arguments), this.status = 400;
  }
}
class vt extends _ {
  constructor() {
    super(...arguments), this.status = 401;
  }
}
class Ft extends _ {
  constructor() {
    super(...arguments), this.status = 403;
  }
}
class It extends _ {
  constructor() {
    super(...arguments), this.status = 404;
  }
}
class Mt extends _ {
  constructor() {
    super(...arguments), this.status = 409;
  }
}
class kt extends _ {
  constructor() {
    super(...arguments), this.status = 422;
  }
}
class Ot extends _ {
  constructor() {
    super(...arguments), this.status = 429;
  }
}
class Lt extends _ {
}
class L {
  constructor(e, t) {
    this.iterator = e, this.controller = t;
  }
  static fromSSEResponse(e, t) {
    let s = !1;
    const r = new tn();
    async function* i() {
      if (!e.body)
        throw t.abort(), new m("Attempted to iterate over a response with no body");
      const o = new N(), c = ft(e.body);
      for await (const p of c)
        for (const f of o.decode(p)) {
          const w = r.decode(f);
          w && (yield w);
        }
      for (const p of o.flush()) {
        const f = r.decode(p);
        f && (yield f);
      }
    }
    async function* a() {
      if (s)
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      s = !0;
      let o = !1;
      try {
        for await (const c of i())
          if (!o) {
            if (c.data.startsWith("[DONE]")) {
              o = !0;
              continue;
            }
            if (c.event === null) {
              let p;
              try {
                p = JSON.parse(c.data);
              } catch (f) {
                throw console.error("Could not parse message into JSON:", c.data), console.error("From chunk:", c.raw), f;
              }
              if (p && p.error)
                throw new _(void 0, p.error, void 0, void 0);
              yield p;
            }
          }
        o = !0;
      } catch (c) {
        if (c instanceof Error && c.name === "AbortError")
          return;
        throw c;
      } finally {
        o || t.abort();
      }
    }
    return new L(a, t);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(e, t) {
    let s = !1;
    async function* r() {
      const a = new N(), o = ft(e);
      for await (const c of o)
        for (const p of a.decode(c))
          yield p;
      for (const c of a.flush())
        yield c;
    }
    async function* i() {
      if (s)
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      s = !0;
      let a = !1;
      try {
        for await (const o of r())
          a || o && (yield JSON.parse(o));
        a = !0;
      } catch (o) {
        if (o instanceof Error && o.name === "AbortError")
          return;
        throw o;
      } finally {
        a || t.abort();
      }
    }
    return new L(i, t);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const e = [], t = [], s = this.iterator(), r = (i) => ({
      next: () => {
        if (i.length === 0) {
          const a = s.next();
          e.push(a), t.push(a);
        }
        return i.shift();
      }
    });
    return [
      new L(() => r(e), this.controller),
      new L(() => r(t), this.controller)
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    const e = this;
    let t;
    const s = new TextEncoder();
    return new Rt({
      async start() {
        t = e[Symbol.asyncIterator]();
      },
      async pull(r) {
        try {
          const { value: i, done: a } = await t.next();
          if (a)
            return r.close();
          const o = s.encode(JSON.stringify(i) + `
`);
          r.enqueue(o);
        } catch (i) {
          r.error(i);
        }
      },
      async cancel() {
        var r;
        await ((r = t.return) == null ? void 0 : r.call(t));
      }
    });
  }
}
class tn {
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(e) {
    if (e.endsWith("\r") && (e = e.substring(0, e.length - 1)), !e) {
      if (!this.event && !this.data.length)
        return null;
      const i = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], i;
    }
    if (this.chunks.push(e), e.startsWith(":"))
      return null;
    let [t, s, r] = nn(e, ":");
    return r.startsWith(" ") && (r = r.substring(1)), t === "event" ? this.event = r : t === "data" && this.data.push(r), null;
  }
}
class N {
  constructor() {
    this.buffer = [], this.trailingCR = !1;
  }
  decode(e) {
    let t = this.decodeText(e);
    if (this.trailingCR && (t = "\r" + t, this.trailingCR = !1), t.endsWith("\r") && (this.trailingCR = !0, t = t.slice(0, -1)), !t)
      return [];
    const s = N.NEWLINE_CHARS.has(t[t.length - 1] || "");
    let r = t.split(N.NEWLINE_REGEXP);
    return r.length === 1 && !s ? (this.buffer.push(r[0]), []) : (this.buffer.length > 0 && (r = [this.buffer.join("") + r[0], ...r.slice(1)], this.buffer = []), s || (this.buffer = [r.pop() || ""]), r);
  }
  decodeText(e) {
    if (e == null)
      return "";
    if (typeof e == "string")
      return e;
    if (typeof Buffer < "u") {
      if (e instanceof Buffer)
        return e.toString();
      if (e instanceof Uint8Array)
        return Buffer.from(e).toString();
      throw new m(`Unexpected: received non-Uint8Array (${e.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder < "u") {
      if (e instanceof Uint8Array || e instanceof ArrayBuffer)
        return this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8")), this.textDecoder.decode(e);
      throw new m(`Unexpected: received non-Uint8Array/ArrayBuffer (${e.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new m("Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.");
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR)
      return [];
    const e = [this.buffer.join("")];
    return this.buffer = [], this.trailingCR = !1, e;
  }
}
N.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r", "\v", "\f", "", "", "", "", "\u2028", "\u2029"]);
N.NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;
function nn(n, e) {
  const t = n.indexOf(e);
  return t !== -1 ? [n.substring(0, t), e, n.substring(t + e.length)] : [n, "", ""];
}
function ft(n) {
  if (n[Symbol.asyncIterator])
    return n;
  const e = n.getReader();
  return {
    async next() {
      try {
        const t = await e.read();
        return t != null && t.done && e.releaseLock(), t;
      } catch (t) {
        throw e.releaseLock(), t;
      }
    },
    async return() {
      const t = e.cancel();
      return e.releaseLock(), await t, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
const Bt = (n) => n != null && typeof n == "object" && typeof n.url == "string" && typeof n.blob == "function", sn = (n) => n != null && typeof n == "object" && typeof n.name == "string" && typeof n.lastModified == "number" && jt(n), jt = (n) => n != null && typeof n == "object" && typeof n.size == "number" && typeof n.type == "string" && typeof n.text == "function" && typeof n.slice == "function" && typeof n.arrayBuffer == "function", rn = (n) => sn(n) || Bt(n) || $t(n);
async function Nt(n, e, t = {}) {
  var r;
  if (n = await n, Bt(n)) {
    const i = await n.blob();
    return e || (e = new URL(n.url).pathname.split(/[\\/]/).pop() ?? "unknown_file"), new qe([i], e, t);
  }
  const s = await an(n);
  if (e || (e = cn(n) ?? "unknown_file"), !t.type) {
    const i = (r = s[0]) == null ? void 0 : r.type;
    typeof i == "string" && (t = { ...t, type: i });
  }
  return new qe(s, e, t);
}
async function an(n) {
  var t;
  let e = [];
  if (typeof n == "string" || ArrayBuffer.isView(n) || // includes Uint8Array, Buffer, etc.
  n instanceof ArrayBuffer)
    e.push(n);
  else if (jt(n))
    e.push(await n.arrayBuffer());
  else if (ln(n))
    for await (const s of n)
      e.push(s);
  else
    throw new Error(`Unexpected data type: ${typeof n}; constructor: ${(t = n == null ? void 0 : n.constructor) == null ? void 0 : t.name}; props: ${on(n)}`);
  return e;
}
function on(n) {
  return `[${Object.getOwnPropertyNames(n).map((t) => `"${t}"`).join(", ")}]`;
}
function cn(n) {
  var e;
  return je(n.name) || je(n.filename) || // For fs.ReadStream
  ((e = je(n.path)) == null ? void 0 : e.split(/[\\/]/).pop());
}
const je = (n) => {
  if (typeof n == "string")
    return n;
  if (typeof Buffer < "u" && n instanceof Buffer)
    return String(n);
}, ln = (n) => n != null && typeof n == "object" && typeof n[Symbol.asyncIterator] == "function", mt = (n) => n && typeof n == "object" && n.body && n[Symbol.toStringTag] === "MultipartBody", G = async (n) => {
  const e = await un(n.body);
  return St(e, n);
}, un = async (n) => {
  const e = new Pt();
  return await Promise.all(Object.entries(n || {}).map(([t, s]) => We(e, t, s))), e;
}, We = async (n, e, t) => {
  if (t !== void 0) {
    if (t == null)
      throw new TypeError(`Received null for "${e}"; to pass null in FormData, you must use the string 'null'`);
    if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
      n.append(e, String(t));
    else if (rn(t)) {
      const s = await Nt(t);
      n.append(e, s);
    } else if (Array.isArray(t))
      await Promise.all(t.map((s) => We(n, e + "[]", s)));
    else if (typeof t == "object")
      await Promise.all(Object.entries(t).map(([s, r]) => We(n, `${e}[${s}]`, r)));
    else
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${t} instead`);
  }
};
var hn = globalThis && globalThis.__classPrivateFieldSet || function(n, e, t, s, r) {
  if (s === "m")
    throw new TypeError("Private method is not writable");
  if (s === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return s === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}, dn = globalThis && globalThis.__classPrivateFieldGet || function(n, e, t, s) {
  if (t === "a" && !s)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !s : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? s : t === "a" ? s.call(n) : s ? s.value : e.get(n);
}, Z;
async function Dt(n) {
  const { response: e } = n;
  if (n.options.stream)
    return K("response", e.status, e.url, e.headers, e.body), L.fromSSEResponse(e, n.controller);
  if (e.status === 204)
    return null;
  if (n.options.__binaryResponse)
    return e;
  const t = e.headers.get("content-type");
  if (t != null && t.includes("application/json")) {
    const r = await e.json();
    return K("response", e.status, e.url, e.headers, r), r;
  }
  const s = await e.text();
  return K("response", e.status, e.url, e.headers, s), s;
}
class Me extends Promise {
  constructor(e, t = Dt) {
    super((s) => {
      s(null);
    }), this.responsePromise = e, this.parseResponse = t;
  }
  _thenUnwrap(e) {
    return new Me(this.responsePromise, async (t) => e(await this.parseResponse(t)));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  asResponse() {
    return this.responsePromise.then((e) => e.response);
  }
  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` if you can,
   * or add one of these imports before your first `import … from 'openai'`:
   * - `import 'openai/shims/node'` (if you're running on Node)
   * - `import 'openai/shims/web'` (otherwise)
   */
  async withResponse() {
    const [e, t] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: e, response: t };
  }
  parse() {
    return this.parsedPromise || (this.parsedPromise = this.responsePromise.then(this.parseResponse)), this.parsedPromise;
  }
  then(e, t) {
    return this.parse().then(e, t);
  }
  catch(e) {
    return this.parse().catch(e);
  }
  finally(e) {
    return this.parse().finally(e);
  }
}
class fn {
  constructor({
    baseURL: e,
    maxRetries: t = 2,
    timeout: s = 6e5,
    // 10 minutes
    httpAgent: r,
    fetch: i
  }) {
    this.baseURL = e, this.maxRetries = Ne("maxRetries", t), this.timeout = Ne("timeout", s), this.httpAgent = r, this.fetch = i ?? xt;
  }
  authHeaders(e) {
    return {};
  }
  /**
   * Override this to add your own default headers, for example:
   *
   *  {
   *    ...super.defaultHeaders(),
   *    Authorization: 'Bearer 123',
   *  }
   */
  defaultHeaders(e) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.getUserAgent(),
      ...bn(),
      ...this.authHeaders(e)
    };
  }
  /**
   * Override this to add your own headers validation:
   */
  validateHeaders(e, t) {
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${Rn()}`;
  }
  get(e, t) {
    return this.methodRequest("get", e, t);
  }
  post(e, t) {
    return this.methodRequest("post", e, t);
  }
  patch(e, t) {
    return this.methodRequest("patch", e, t);
  }
  put(e, t) {
    return this.methodRequest("put", e, t);
  }
  delete(e, t) {
    return this.methodRequest("delete", e, t);
  }
  methodRequest(e, t, s) {
    return this.request(Promise.resolve(s).then((r) => ({ method: e, path: t, ...r })));
  }
  getAPIList(e, t, s) {
    return this.requestAPIList(t, { method: "get", path: e, ...s });
  }
  calculateContentLength(e) {
    if (typeof e == "string") {
      if (typeof Buffer < "u")
        return Buffer.byteLength(e, "utf8").toString();
      if (typeof TextEncoder < "u")
        return new TextEncoder().encode(e).length.toString();
    }
    return null;
  }
  buildRequest(e) {
    var d;
    const { method: t, path: s, query: r, headers: i = {} } = e, a = mt(e.body) ? e.body.body : e.body ? JSON.stringify(e.body, null, 2) : null, o = this.calculateContentLength(a), c = this.buildURL(s, r);
    "timeout" in e && Ne("timeout", e.timeout);
    const p = e.timeout ?? this.timeout, f = e.httpAgent ?? this.httpAgent ?? At(c), w = p + 1e3;
    typeof ((d = f == null ? void 0 : f.options) == null ? void 0 : d.timeout) == "number" && w > (f.options.timeout ?? 0) && (f.options.timeout = w), this.idempotencyHeader && t !== "get" && (e.idempotencyKey || (e.idempotencyKey = this.defaultIdempotencyKey()), i[this.idempotencyHeader] = e.idempotencyKey);
    const u = {
      ...o && { "Content-Length": o },
      ...this.defaultHeaders(e),
      ...i
    };
    mt(e.body) && J !== "node" && delete u["Content-Type"], Object.keys(u).forEach((P) => u[P] === null && delete u[P]);
    const h = {
      method: t,
      ...a && { body: a },
      headers: u,
      ...f && { agent: f },
      // @ts-ignore node-fetch uses a custom AbortSignal type that is
      // not compatible with standard web types
      signal: e.signal ?? null
    };
    return this.validateHeaders(u, i), { req: h, url: c, timeout: p };
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(e, { url: t, options: s }) {
  }
  parseHeaders(e) {
    return e ? Symbol.iterator in e ? Object.fromEntries(Array.from(e).map((t) => [...t])) : { ...e } : {};
  }
  makeStatusError(e, t, s, r) {
    return _.generate(e, t, s, r);
  }
  request(e, t = null) {
    return new Me(this.makeRequest(e, t));
  }
  async makeRequest(e, t) {
    var f, w;
    const s = await e;
    t == null && (t = s.maxRetries ?? this.maxRetries);
    const { req: r, url: i, timeout: a } = this.buildRequest(s);
    if (await this.prepareRequest(r, { url: i, options: s }), K("request", i, s, r.headers), (f = s.signal) != null && f.aborted)
      throw new j();
    const o = new AbortController(), c = await this.fetchWithTimeout(i, r, a, o).catch(Xe);
    if (c instanceof Error) {
      if ((w = s.signal) != null && w.aborted)
        throw new j();
      if (t)
        return this.retryRequest(s, t);
      throw c.name === "AbortError" ? new Ze() : new Ie({ cause: c });
    }
    const p = pn(c.headers);
    if (!c.ok) {
      if (t && this.shouldRetry(c))
        return this.retryRequest(s, t, p);
      const u = await c.text().catch((y) => Xe(y).message), h = _n(u), d = h ? void 0 : u;
      throw K("response", c.status, i, p, d), this.makeStatusError(c.status, h, d, p);
    }
    return { response: c, options: s, controller: o };
  }
  requestAPIList(e, t) {
    const s = this.makeRequest(t, null);
    return new mn(this, s, e);
  }
  buildURL(e, t) {
    const s = xn(e) ? new URL(e) : new URL(this.baseURL + (this.baseURL.endsWith("/") && e.startsWith("/") ? e.slice(1) : e)), r = this.defaultQuery();
    return qt(r) || (t = { ...r, ...t }), t && (s.search = this.stringifyQuery(t)), s.toString();
  }
  stringifyQuery(e) {
    return Object.entries(e).filter(([t, s]) => typeof s < "u").map(([t, s]) => {
      if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
        return `${encodeURIComponent(t)}=${encodeURIComponent(s)}`;
      if (s === null)
        return `${encodeURIComponent(t)}=`;
      throw new m(`Cannot stringify type ${typeof s}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    }).join("&");
  }
  async fetchWithTimeout(e, t, s, r) {
    const { signal: i, ...a } = t || {};
    i && i.addEventListener("abort", () => r.abort());
    const o = setTimeout(() => r.abort(), s);
    return this.getRequestClient().fetch.call(void 0, e, { signal: r.signal, ...a }).finally(() => {
      clearTimeout(o);
    });
  }
  getRequestClient() {
    return { fetch: this.fetch };
  }
  shouldRetry(e) {
    const t = e.headers.get("x-should-retry");
    return t === "true" ? !0 : t === "false" ? !1 : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
  }
  async retryRequest(e, t, s) {
    let r;
    const i = s == null ? void 0 : s["retry-after"];
    if (i) {
      const a = parseInt(i);
      Number.isNaN(a) ? r = Date.parse(i) - Date.now() : r = a * 1e3;
    }
    if (!r || !Number.isInteger(r) || r <= 0 || r > 60 * 1e3) {
      const a = e.maxRetries ?? this.maxRetries;
      r = this.calculateDefaultRetryTimeoutMillis(t, a);
    }
    return await Ht(r), this.makeRequest(e, t - 1);
  }
  calculateDefaultRetryTimeoutMillis(e, t) {
    const i = t - e, a = Math.min(0.5 * Math.pow(2, i), 8), o = 1 - Math.random() * 0.25;
    return a * o * 1e3;
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${D}`;
  }
}
class Ut {
  constructor(e, t, s, r) {
    Z.set(this, void 0), hn(this, Z, e, "f"), this.options = r, this.response = t, this.body = s;
  }
  hasNextPage() {
    return this.getPaginatedItems().length ? this.nextPageInfo() != null : !1;
  }
  async getNextPage() {
    const e = this.nextPageInfo();
    if (!e)
      throw new m("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    const t = { ...this.options };
    if ("params" in e)
      t.query = { ...t.query, ...e.params };
    else if ("url" in e) {
      const s = [...Object.entries(t.query || {}), ...e.url.searchParams.entries()];
      for (const [r, i] of s)
        e.url.searchParams.set(r, i);
      t.query = void 0, t.path = e.url.toString();
    }
    return await dn(this, Z, "f").requestAPIList(this.constructor, t);
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[(Z = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const e of this.iterPages())
      for (const t of e.getPaginatedItems())
        yield t;
  }
}
class mn extends Me {
  constructor(e, t, s) {
    super(t, async (r) => new s(e, r.response, await Dt(r), r.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const e = await this;
    for await (const t of e)
      yield t;
  }
}
const pn = (n) => new Proxy(Object.fromEntries(
  // @ts-ignore
  n.entries()
), {
  get(e, t) {
    const s = t.toString();
    return e[s.toLowerCase()] || e[s];
  }
}), gn = {
  method: !0,
  path: !0,
  query: !0,
  body: !0,
  headers: !0,
  maxRetries: !0,
  stream: !0,
  timeout: !0,
  httpAgent: !0,
  signal: !0,
  idempotencyKey: !0,
  __binaryResponse: !0
}, I = (n) => typeof n == "object" && n !== null && !qt(n) && Object.keys(n).every((e) => Pn(gn, e)), wn = () => {
  if (typeof Deno < "u" && Deno.build != null)
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": D,
      "X-Stainless-OS": gt(Deno.build.os),
      "X-Stainless-Arch": pt(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": Deno.version
    };
  if (typeof EdgeRuntime < "u")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": D,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": process.version
    };
  if (Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]")
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": D,
      "X-Stainless-OS": gt(process.platform),
      "X-Stainless-Arch": pt(process.arch),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": process.version
    };
  const n = yn();
  return n ? {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": D,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": `browser:${n.browser}`,
    "X-Stainless-Runtime-Version": n.version
  } : {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": D,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
};
function yn() {
  if (typeof navigator > "u" || !navigator)
    return null;
  const n = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key: e, pattern: t } of n) {
    const s = t.exec(navigator.userAgent);
    if (s) {
      const r = s[1] || 0, i = s[2] || 0, a = s[3] || 0;
      return { browser: e, version: `${r}.${i}.${a}` };
    }
  }
  return null;
}
const pt = (n) => n === "x32" ? "x32" : n === "x86_64" || n === "x64" ? "x64" : n === "arm" ? "arm" : n === "aarch64" || n === "arm64" ? "arm64" : n ? `other:${n}` : "unknown", gt = (n) => (n = n.toLowerCase(), n.includes("ios") ? "iOS" : n === "android" ? "Android" : n === "darwin" ? "MacOS" : n === "win32" ? "Windows" : n === "freebsd" ? "FreeBSD" : n === "openbsd" ? "OpenBSD" : n === "linux" ? "Linux" : n ? `Other:${n}` : "Unknown");
let wt;
const bn = () => wt ?? (wt = wn()), _n = (n) => {
  try {
    return JSON.parse(n);
  } catch {
    return;
  }
}, Cn = new RegExp("^(?:[a-z]+:)?//", "i"), xn = (n) => Cn.test(n), Ht = (n) => new Promise((e) => setTimeout(e, n)), Ne = (n, e) => {
  if (typeof e != "number" || !Number.isInteger(e))
    throw new m(`${n} must be an integer`);
  if (e < 0)
    throw new m(`${n} must be a positive integer`);
  return e;
}, Xe = (n) => n instanceof Error ? n : new Error(n), yt = (n) => {
  var e, t, s;
  if (typeof process < "u")
    return ((e = process.env) == null ? void 0 : e[n]) ?? void 0;
  if (typeof Deno < "u")
    return (s = (t = Deno.env) == null ? void 0 : t.get) == null ? void 0 : s.call(t, n);
};
function qt(n) {
  if (!n)
    return !0;
  for (const e in n)
    return !1;
  return !0;
}
function Pn(n, e) {
  return Object.prototype.hasOwnProperty.call(n, e);
}
function K(n, ...e) {
  typeof process < "u" && process.env.DEBUG === "true" && console.log(`OpenAI:DEBUG:${n}`, ...e);
}
const Rn = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (n) => {
  const e = Math.random() * 16 | 0;
  return (n === "x" ? e : e & 3 | 8).toString(16);
}), Sn = () => (
  // @ts-ignore
  typeof window < "u" && // @ts-ignore
  typeof window.document < "u" && // @ts-ignore
  typeof navigator < "u"
);
class ke extends Ut {
  constructor(e, t, s, r) {
    super(e, t, s, r), this.data = s.data, this.object = s.object;
  }
  getPaginatedItems() {
    return this.data;
  }
  // @deprecated Please use `nextPageInfo()` instead
  /**
   * This page represents a response that isn't actually paginated at the API level
   * so there will never be any next page params.
   */
  nextPageParams() {
    return null;
  }
  nextPageInfo() {
    return null;
  }
}
class k extends Ut {
  constructor(e, t, s, r) {
    super(e, t, s, r), this.data = s.data;
  }
  getPaginatedItems() {
    return this.data;
  }
  // @deprecated Please use `nextPageInfo()` instead
  nextPageParams() {
    const e = this.nextPageInfo();
    if (!e)
      return null;
    if ("params" in e)
      return e.params;
    const t = Object.fromEntries(e.url.searchParams);
    return Object.keys(t).length ? t : null;
  }
  nextPageInfo() {
    var t, s;
    if (!((t = this.data) != null && t.length))
      return null;
    const e = (s = this.data[this.data.length - 1]) == null ? void 0 : s.id;
    return e ? { params: { after: e } } : null;
  }
}
class g {
  constructor(e) {
    this.client = e, this.get = e.get.bind(e), this.post = e.post.bind(e), this.patch = e.patch.bind(e), this.put = e.put.bind(e), this.delete = e.delete.bind(e), this.getAPIList = e.getAPIList.bind(e);
  }
}
let oe = class extends g {
  create(e, t) {
    return this.post("/chat/completions", { body: e, ...t, stream: e.stream ?? !1 });
  }
};
oe || (oe = {});
let ce = class extends g {
  constructor() {
    super(...arguments), this.completions = new oe(this.client);
  }
};
(function(n) {
  n.Completions = oe;
})(ce || (ce = {}));
class le extends g {
  /**
   * Generates audio from the input text.
   */
  create(e, t) {
    return this.post("/audio/speech", { body: e, ...t, __binaryResponse: !0 });
  }
}
le || (le = {});
class ue extends g {
  /**
   * Transcribes audio into the input language.
   */
  create(e, t) {
    return this.post("/audio/transcriptions", G({ body: e, ...t }));
  }
}
ue || (ue = {});
class he extends g {
  /**
   * Translates audio into English.
   */
  create(e, t) {
    return this.post("/audio/translations", G({ body: e, ...t }));
  }
}
he || (he = {});
class de extends g {
  constructor() {
    super(...arguments), this.transcriptions = new ue(this.client), this.translations = new he(this.client), this.speech = new le(this.client);
  }
}
(function(n) {
  n.Transcriptions = ue, n.Translations = he, n.Speech = le;
})(de || (de = {}));
let fe = class extends g {
  /**
   * Create an assistant file by attaching a
   * [File](https://platform.openai.com/docs/api-reference/files) to an
   * [assistant](https://platform.openai.com/docs/api-reference/assistants).
   */
  create(e, t, s) {
    return this.post(`/assistants/${e}/files`, {
      body: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Retrieves an AssistantFile.
   */
  retrieve(e, t, s) {
    return this.get(`/assistants/${e}/files/${t}`, {
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  list(e, t = {}, s) {
    return I(t) ? this.list(e, {}, t) : this.getAPIList(`/assistants/${e}/files`, et, {
      query: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Delete an assistant file.
   */
  del(e, t, s) {
    return this.delete(`/assistants/${e}/files/${t}`, {
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
};
class et extends k {
}
(function(n) {
  n.AssistantFilesPage = et;
})(fe || (fe = {}));
class me extends g {
  constructor() {
    super(...arguments), this.files = new fe(this.client);
  }
  /**
   * Create an assistant with a model and instructions.
   */
  create(e, t) {
    return this.post("/assistants", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Retrieves an assistant.
   */
  retrieve(e, t) {
    return this.get(`/assistants/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Modifies an assistant.
   */
  update(e, t, s) {
    return this.post(`/assistants/${e}`, {
      body: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  list(e = {}, t) {
    return I(e) ? this.list({}, e) : this.getAPIList("/assistants", tt, {
      query: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Delete an assistant.
   */
  del(e, t) {
    return this.delete(`/assistants/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
}
class tt extends k {
}
(function(n) {
  n.AssistantsPage = tt, n.Files = fe, n.AssistantFilesPage = et;
})(me || (me = {}));
function bt(n) {
  return typeof n.parse == "function";
}
const z = (n) => (n == null ? void 0 : n.role) === "assistant", Wt = (n) => (n == null ? void 0 : n.role) === "function", An = (n) => (n == null ? void 0 : n.role) === "tool";
var E = globalThis && globalThis.__classPrivateFieldSet || function(n, e, t, s, r) {
  if (s === "m")
    throw new TypeError("Private method is not writable");
  if (s === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return s === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}, l = globalThis && globalThis.__classPrivateFieldGet || function(n, e, t, s) {
  if (t === "a" && !s)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !s : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? s : t === "a" ? s.call(n) : s ? s.value : e.get(n);
}, x, ne, se, q, W, re, X, M, V, ie, ae, U, Ve, Je, Ke, Ge, ze, Qe, Xt, Ye;
const _t = 10;
class Vt {
  constructor() {
    x.add(this), this.controller = new AbortController(), ne.set(this, void 0), se.set(this, () => {
    }), q.set(this, () => {
    }), W.set(this, void 0), re.set(this, () => {
    }), X.set(this, () => {
    }), M.set(this, {}), this._chatCompletions = [], this.messages = [], V.set(this, !1), ie.set(this, !1), ae.set(this, !1), U.set(this, !1), Qe.set(this, (e) => {
      if (E(this, ie, !0, "f"), e instanceof Error && e.name === "AbortError" && (e = new j()), e instanceof j)
        return E(this, ae, !0, "f"), this._emit("abort", e);
      if (e instanceof m)
        return this._emit("error", e);
      if (e instanceof Error) {
        const t = new m(e.message);
        return t.cause = e, this._emit("error", t);
      }
      return this._emit("error", new m(String(e)));
    }), E(this, ne, new Promise((e, t) => {
      E(this, se, e, "f"), E(this, q, t, "f");
    }), "f"), E(this, W, new Promise((e, t) => {
      E(this, re, e, "f"), E(this, X, t, "f");
    }), "f"), l(this, ne, "f").catch(() => {
    }), l(this, W, "f").catch(() => {
    });
  }
  _run(e) {
    setTimeout(() => {
      e().then(() => {
        this._emitFinal(), this._emit("end");
      }, l(this, Qe, "f"));
    }, 0);
  }
  _addChatCompletion(e) {
    var s;
    this._chatCompletions.push(e), this._emit("chatCompletion", e);
    const t = (s = e.choices[0]) == null ? void 0 : s.message;
    return t && this._addMessage(t), e;
  }
  _addMessage(e, t = !0) {
    if (this.messages.push(e), t) {
      if (this._emit("message", e), (Wt(e) || An(e)) && e.content)
        this._emit("functionCallResult", e.content);
      else if (z(e) && e.function_call)
        this._emit("functionCall", e.function_call);
      else if (z(e) && e.tool_calls)
        for (const s of e.tool_calls)
          s.type === "function" && this._emit("functionCall", s.function);
    }
  }
  _connected() {
    this.ended || (l(this, se, "f").call(this), this._emit("connect"));
  }
  get ended() {
    return l(this, V, "f");
  }
  get errored() {
    return l(this, ie, "f");
  }
  get aborted() {
    return l(this, ae, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  on(e, t) {
    return (l(this, M, "f")[e] || (l(this, M, "f")[e] = [])).push({ listener: t }), this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  off(e, t) {
    const s = l(this, M, "f")[e];
    if (!s)
      return this;
    const r = s.findIndex((i) => i.listener === t);
    return r >= 0 && s.splice(r, 1), this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  once(e, t) {
    return (l(this, M, "f")[e] || (l(this, M, "f")[e] = [])).push({ listener: t, once: !0 }), this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(e) {
    return new Promise((t, s) => {
      E(this, U, !0, "f"), e !== "error" && this.once("error", s), this.once(e, t);
    });
  }
  async done() {
    E(this, U, !0, "f"), await l(this, W, "f");
  }
  /**
   * @returns a promise that resolves with the final ChatCompletion, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
   */
  async finalChatCompletion() {
    await this.done();
    const e = this._chatCompletions[this._chatCompletions.length - 1];
    if (!e)
      throw new m("stream ended without producing a ChatCompletion");
    return e;
  }
  /**
   * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalContent() {
    return await this.done(), l(this, x, "m", Ve).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
   * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalMessage() {
    return await this.done(), l(this, x, "m", Je).call(this);
  }
  /**
   * @returns a promise that resolves with the content of the final FunctionCall, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalFunctionCall() {
    return await this.done(), l(this, x, "m", Ke).call(this);
  }
  async finalFunctionCallResult() {
    return await this.done(), l(this, x, "m", Ge).call(this);
  }
  async totalUsage() {
    return await this.done(), l(this, x, "m", ze).call(this);
  }
  allChatCompletions() {
    return [...this._chatCompletions];
  }
  _emit(e, ...t) {
    if (l(this, V, "f"))
      return;
    e === "end" && (E(this, V, !0, "f"), l(this, re, "f").call(this));
    const s = l(this, M, "f")[e];
    if (s && (l(this, M, "f")[e] = s.filter((r) => !r.once), s.forEach(({ listener: r }) => r(...t))), e === "abort") {
      const r = t[0];
      !l(this, U, "f") && !(s != null && s.length) && Promise.reject(r), l(this, q, "f").call(this, r), l(this, X, "f").call(this, r), this._emit("end");
      return;
    }
    if (e === "error") {
      const r = t[0];
      !l(this, U, "f") && !(s != null && s.length) && Promise.reject(r), l(this, q, "f").call(this, r), l(this, X, "f").call(this, r), this._emit("end");
    }
  }
  _emitFinal() {
    const e = this._chatCompletions[this._chatCompletions.length - 1];
    e && this._emit("finalChatCompletion", e);
    const t = this.messages[this.messages.length - 1];
    t && this._emit("finalMessage", t);
    const s = l(this, x, "m", Ve).call(this);
    s && this._emit("finalContent", s);
    const r = l(this, x, "m", Ke).call(this);
    r && this._emit("finalFunctionCall", r);
    const i = l(this, x, "m", Ge).call(this);
    i != null && this._emit("finalFunctionCallResult", i), this._chatCompletions.some((a) => a.usage) && this._emit("totalUsage", l(this, x, "m", ze).call(this));
  }
  async _createChatCompletion(e, t, s) {
    const r = s == null ? void 0 : s.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), l(this, x, "m", Xt).call(this, t);
    const i = await e.create({ ...t, stream: !1 }, { ...s, signal: this.controller.signal });
    return this._connected(), this._addChatCompletion(i);
  }
  async _runChatCompletion(e, t, s) {
    for (const r of t.messages)
      this._addMessage(r, !1);
    return await this._createChatCompletion(e, t, s);
  }
  async _runFunctions(e, t, s) {
    var u;
    const r = "function", { function_call: i = "auto", stream: a, ...o } = t, c = typeof i != "string" && (i == null ? void 0 : i.name), { maxChatCompletions: p = _t } = s || {}, f = {};
    for (const h of t.functions)
      f[h.name || h.function.name] = h;
    const w = t.functions.map((h) => ({
      name: h.name || h.function.name,
      parameters: h.parameters,
      description: h.description
    }));
    for (const h of t.messages)
      this._addMessage(h, !1);
    for (let h = 0; h < p; ++h) {
      const P = (u = (await this._createChatCompletion(e, {
        ...o,
        function_call: i,
        functions: w,
        messages: [...this.messages]
      }, s)).choices[0]) == null ? void 0 : u.message;
      if (!P)
        throw new m("missing message in ChatCompletion response");
      if (!P.function_call)
        return;
      const { name: y, arguments: A } = P.function_call, C = f[y];
      if (C) {
        if (c && c !== y) {
          const v = `Invalid function_call: ${JSON.stringify(y)}. ${JSON.stringify(c)} requested. Please try again`;
          this._addMessage({ role: r, name: y, content: v });
          continue;
        }
      } else {
        const v = `Invalid function_call: ${JSON.stringify(y)}. Available options are: ${w.map((Oe) => JSON.stringify(Oe.name)).join(", ")}. Please try again`;
        this._addMessage({ role: r, name: y, content: v });
        continue;
      }
      let T;
      try {
        T = bt(C) ? await C.parse(A) : A;
      } catch (v) {
        this._addMessage({
          role: r,
          name: y,
          content: v instanceof Error ? v.message : String(v)
        });
        continue;
      }
      const R = await C.function(T, this), S = l(this, x, "m", Ye).call(this, R);
      if (this._addMessage({ role: r, name: y, content: S }), c)
        return;
    }
  }
  async _runTools(e, t, s) {
    var u, h;
    const r = "tool", { tool_choice: i = "auto", stream: a, ...o } = t, c = typeof i != "string" && ((u = i == null ? void 0 : i.function) == null ? void 0 : u.name), { maxChatCompletions: p = _t } = s || {}, f = {};
    for (const d of t.tools)
      d.type === "function" && (f[d.function.name || d.function.function.name] = d.function);
    const w = "tools" in t ? t.tools.map((d) => d.type === "function" ? {
      type: "function",
      function: {
        name: d.function.name || d.function.function.name,
        parameters: d.function.parameters,
        description: d.function.description
      }
    } : d) : void 0;
    for (const d of t.messages)
      this._addMessage(d, !1);
    for (let d = 0; d < p; ++d) {
      const y = (h = (await this._createChatCompletion(e, {
        ...o,
        tool_choice: i,
        tools: w,
        messages: [...this.messages]
      }, s)).choices[0]) == null ? void 0 : h.message;
      if (!y)
        throw new m("missing message in ChatCompletion response");
      if (!y.tool_calls)
        return;
      for (const A of y.tool_calls) {
        if (A.type !== "function")
          continue;
        const C = A.id, { name: T, arguments: R } = A.function, S = f[T];
        if (S) {
          if (c && c !== T) {
            const B = `Invalid tool_call: ${JSON.stringify(T)}. ${JSON.stringify(c)} requested. Please try again`;
            this._addMessage({ role: r, tool_call_id: C, content: B });
            continue;
          }
        } else {
          const B = `Invalid tool_call: ${JSON.stringify(T)}. Available options are: ${w.map((Le) => JSON.stringify(Le.function.name)).join(", ")}. Please try again`;
          this._addMessage({ role: r, tool_call_id: C, content: B });
          continue;
        }
        let v;
        try {
          v = bt(S) ? await S.parse(R) : R;
        } catch (B) {
          const Le = B instanceof Error ? B.message : String(B);
          this._addMessage({ role: r, tool_call_id: C, content: Le });
          continue;
        }
        const Oe = await S.function(v, this), Gt = l(this, x, "m", Ye).call(this, Oe);
        if (this._addMessage({ role: r, tool_call_id: C, content: Gt }), c)
          return;
      }
    }
  }
}
ne = /* @__PURE__ */ new WeakMap(), se = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), W = /* @__PURE__ */ new WeakMap(), re = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), ie = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), Qe = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakSet(), Ve = function() {
  return l(this, x, "m", Je).call(this).content;
}, Je = function() {
  let e = this.messages.length;
  for (; e-- > 0; ) {
    const t = this.messages[e];
    if (z(t))
      return t;
  }
  throw new m("stream ended without producing a ChatCompletionMessage with role=assistant");
}, Ke = function() {
  for (let e = this.messages.length - 1; e >= 0; e--) {
    const t = this.messages[e];
    if (z(t) && (t != null && t.function_call))
      return t.function_call;
  }
}, Ge = function() {
  for (let e = this.messages.length - 1; e >= 0; e--) {
    const t = this.messages[e];
    if (Wt(t) && t.content != null)
      return t.content;
  }
}, ze = function() {
  const e = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  for (const { usage: t } of this._chatCompletions)
    t && (e.completion_tokens += t.completion_tokens, e.prompt_tokens += t.prompt_tokens, e.total_tokens += t.total_tokens);
  return e;
}, Xt = function(e) {
  if (e.n != null && e.n > 1)
    throw new m("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
}, Ye = function(e) {
  return typeof e == "string" ? e : e === void 0 ? "undefined" : JSON.stringify(e);
};
class Q extends Vt {
  static runFunctions(e, t, s) {
    const r = new Q();
    return r._run(() => r._runFunctions(e, t, s)), r;
  }
  static runTools(e, t, s) {
    const r = new Q();
    return r._run(() => r._runTools(e, t, s)), r;
  }
  _addMessage(e) {
    super._addMessage(e), z(e) && e.content && this._emit("content", e.content);
  }
}
var $ = globalThis && globalThis.__classPrivateFieldGet || function(n, e, t, s) {
  if (t === "a" && !s)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !s : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? s : t === "a" ? s.call(n) : s ? s.value : e.get(n);
}, De = globalThis && globalThis.__classPrivateFieldSet || function(n, e, t, s, r) {
  if (s === "m")
    throw new TypeError("Private method is not writable");
  if (s === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return s === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}, F, O, Ue, He, ee, Ct;
class Y extends Vt {
  constructor() {
    super(...arguments), F.add(this), O.set(this, void 0);
  }
  get currentChatCompletionSnapshot() {
    return $(this, O, "f");
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(e) {
    const t = new Y();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static createChatCompletion(e, t, s) {
    const r = new Y();
    return r._run(() => r._runChatCompletion(e, { ...t, stream: !0 }, s)), r;
  }
  async _createChatCompletion(e, t, s) {
    var a;
    const r = s == null ? void 0 : s.signal;
    r && (r.aborted && this.controller.abort(), r.addEventListener("abort", () => this.controller.abort())), $(this, F, "m", Ue).call(this);
    const i = await e.create({ ...t, stream: !0 }, { ...s, signal: this.controller.signal });
    this._connected();
    for await (const o of i)
      $(this, F, "m", He).call(this, o);
    if ((a = i.controller.signal) != null && a.aborted)
      throw new j();
    return this._addChatCompletion($(this, F, "m", ee).call(this));
  }
  async _fromReadableStream(e, t) {
    var a;
    const s = t == null ? void 0 : t.signal;
    s && (s.aborted && this.controller.abort(), s.addEventListener("abort", () => this.controller.abort())), $(this, F, "m", Ue).call(this), this._connected();
    const r = L.fromReadableStream(e, this.controller);
    let i;
    for await (const o of r)
      i && i !== o.id && this._addChatCompletion($(this, F, "m", ee).call(this)), $(this, F, "m", He).call(this, o), i = o.id;
    if ((a = r.controller.signal) != null && a.aborted)
      throw new j();
    return this._addChatCompletion($(this, F, "m", ee).call(this));
  }
  [(O = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakSet(), Ue = function() {
    this.ended || De(this, O, void 0, "f");
  }, He = function(t) {
    var a, o, c;
    if (this.ended)
      return;
    const s = $(this, F, "m", Ct).call(this, t);
    this._emit("chunk", t, s);
    const r = (o = (a = t.choices[0]) == null ? void 0 : a.delta) == null ? void 0 : o.content, i = (c = s.choices[0]) == null ? void 0 : c.message;
    r != null && (i == null ? void 0 : i.role) === "assistant" && (i != null && i.content) && this._emit("content", r, i.content);
  }, ee = function() {
    if (this.ended)
      throw new m("stream has ended, this shouldn't happen");
    const t = $(this, O, "f");
    if (!t)
      throw new m("request ended without sending any chunks");
    return De(this, O, void 0, "f"), En(t);
  }, Ct = function(t) {
    var s, r;
    let i = $(this, O, "f");
    const { choices: a, ...o } = t;
    i ? Object.assign(i, o) : i = De(this, O, {
      ...o,
      choices: []
    }, "f");
    for (const { delta: c, finish_reason: p, index: f, ...w } of t.choices) {
      let u = i.choices[f];
      if (!u) {
        i.choices[f] = { finish_reason: p, index: f, message: c, ...w };
        continue;
      }
      if (p && (u.finish_reason = p), Object.assign(u, w), !c)
        continue;
      const { content: h, function_call: d, role: P, tool_calls: y } = c;
      if (h && (u.message.content = (u.message.content || "") + h), P && (u.message.role = P), d && (u.message.function_call ? (d.name && (u.message.function_call.name = d.name), d.arguments && ((s = u.message.function_call).arguments ?? (s.arguments = ""), u.message.function_call.arguments += d.arguments)) : u.message.function_call = d), y) {
        u.message.tool_calls || (u.message.tool_calls = []);
        for (const { index: A, id: C, type: T, function: R } of y) {
          const S = (r = u.message.tool_calls)[A] ?? (r[A] = {});
          C && (S.id = C), T && (S.type = T), R && (S.function ?? (S.function = { arguments: "" })), R != null && R.name && (S.function.name = R.name), R != null && R.arguments && (S.function.arguments += R.arguments);
        }
      }
    }
    return i;
  }, Symbol.asyncIterator)]() {
    const e = [], t = [];
    let s = !1;
    return this.on("chunk", (r) => {
      const i = t.shift();
      i ? i(r) : e.push(r);
    }), this.on("end", () => {
      s = !0;
      for (const r of t)
        r(void 0);
      t.length = 0;
    }), {
      next: async () => e.length ? { value: e.shift(), done: !1 } : s ? { value: void 0, done: !0 } : new Promise((i) => t.push(i)).then((i) => i ? { value: i, done: !1 } : { value: void 0, done: !0 })
    };
  }
  toReadableStream() {
    return new L(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
  }
}
function En(n) {
  const { id: e, choices: t, created: s, model: r } = n;
  return {
    id: e,
    choices: t.map(({ message: i, finish_reason: a, index: o }) => {
      if (!a)
        throw new m(`missing finish_reason for choice ${o}`);
      const { content: c = null, function_call: p, tool_calls: f } = i, w = i.role;
      if (!w)
        throw new m(`missing role for choice ${o}`);
      if (p) {
        const { arguments: u, name: h } = p;
        if (u == null)
          throw new m(`missing function_call.arguments for choice ${o}`);
        if (!h)
          throw new m(`missing function_call.name for choice ${o}`);
        return { message: { content: c, function_call: { arguments: u, name: h }, role: w }, finish_reason: a, index: o };
      }
      return f ? {
        index: o,
        finish_reason: a,
        message: {
          role: w,
          content: c,
          tool_calls: f.map((u, h) => {
            const { function: d, type: P, id: y } = u, { arguments: A, name: C } = d || {};
            if (y == null)
              throw new m(`missing choices[${o}].tool_calls[${h}].id
${te(n)}`);
            if (P == null)
              throw new m(`missing choices[${o}].tool_calls[${h}].type
${te(n)}`);
            if (C == null)
              throw new m(`missing choices[${o}].tool_calls[${h}].function.name
${te(n)}`);
            if (A == null)
              throw new m(`missing choices[${o}].tool_calls[${h}].function.arguments
${te(n)}`);
            return { id: y, type: P, function: { name: C, arguments: A } };
          })
        }
      } : { message: { content: c, role: w }, finish_reason: a, index: o };
    }),
    created: s,
    model: r,
    object: "chat.completion"
  };
}
function te(n) {
  return JSON.stringify(n);
}
class H extends Y {
  static fromReadableStream(e) {
    const t = new H();
    return t._run(() => t._fromReadableStream(e)), t;
  }
  static runFunctions(e, t, s) {
    const r = new H();
    return r._run(() => r._runFunctions(e, t, s)), r;
  }
  static runTools(e, t, s) {
    const r = new H();
    return r._run(() => r._runTools(e, t, s)), r;
  }
}
let Jt = class extends g {
  runFunctions(e, t) {
    return e.stream ? H.runFunctions(this.client.chat.completions, e, t) : Q.runFunctions(this.client.chat.completions, e, t);
  }
  runTools(e, t) {
    return e.stream ? H.runTools(this.client.chat.completions, e, t) : Q.runTools(this.client.chat.completions, e, t);
  }
  /**
   * Creates a chat completion stream
   */
  stream(e, t) {
    return Y.createChatCompletion(this.client.chat.completions, e, t);
  }
};
class pe extends g {
  constructor() {
    super(...arguments), this.completions = new Jt(this.client);
  }
}
(function(n) {
  n.Completions = Jt;
})(pe || (pe = {}));
let ge = class extends g {
  /**
   * Retrieves a message file.
   */
  retrieve(e, t, s, r) {
    return this.get(`/threads/${e}/messages/${t}/files/${s}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t, s = {}, r) {
    return I(s) ? this.list(e, t, {}, s) : this.getAPIList(`/threads/${e}/messages/${t}/files`, nt, {
      query: s,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
};
class nt extends k {
}
(function(n) {
  n.MessageFilesPage = nt;
})(ge || (ge = {}));
class we extends g {
  constructor() {
    super(...arguments), this.files = new ge(this.client);
  }
  /**
   * Create a message.
   */
  create(e, t, s) {
    return this.post(`/threads/${e}/messages`, {
      body: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Retrieve a message.
   */
  retrieve(e, t, s) {
    return this.get(`/threads/${e}/messages/${t}`, {
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Modifies a message.
   */
  update(e, t, s, r) {
    return this.post(`/threads/${e}/messages/${t}`, {
      body: s,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t = {}, s) {
    return I(t) ? this.list(e, {}, t) : this.getAPIList(`/threads/${e}/messages`, st, {
      query: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
}
class st extends k {
}
(function(n) {
  n.ThreadMessagesPage = st, n.Files = ge, n.MessageFilesPage = nt;
})(we || (we = {}));
class ye extends g {
  /**
   * Retrieves a run step.
   */
  retrieve(e, t, s, r) {
    return this.get(`/threads/${e}/runs/${t}/steps/${s}`, {
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t, s = {}, r) {
    return I(s) ? this.list(e, t, {}, s) : this.getAPIList(`/threads/${e}/runs/${t}/steps`, rt, {
      query: s,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
}
class rt extends k {
}
(function(n) {
  n.RunStepsPage = rt;
})(ye || (ye = {}));
class be extends g {
  constructor() {
    super(...arguments), this.steps = new ye(this.client);
  }
  /**
   * Create a run.
   */
  create(e, t, s) {
    return this.post(`/threads/${e}/runs`, {
      body: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Retrieves a run.
   */
  retrieve(e, t, s) {
    return this.get(`/threads/${e}/runs/${t}`, {
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Modifies a run.
   */
  update(e, t, s, r) {
    return this.post(`/threads/${e}/runs/${t}`, {
      body: s,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
  list(e, t = {}, s) {
    return I(t) ? this.list(e, {}, t) : this.getAPIList(`/threads/${e}/runs`, it, {
      query: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Cancels a run that is `in_progress`.
   */
  cancel(e, t, s) {
    return this.post(`/threads/${e}/runs/${t}/cancel`, {
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * When a run has the `status: "requires_action"` and `required_action.type` is
   * `submit_tool_outputs`, this endpoint can be used to submit the outputs from the
   * tool calls once they're all completed. All outputs must be submitted in a single
   * request.
   */
  submitToolOutputs(e, t, s, r) {
    return this.post(`/threads/${e}/runs/${t}/submit_tool_outputs`, {
      body: s,
      ...r,
      headers: { "OpenAI-Beta": "assistants=v1", ...r == null ? void 0 : r.headers }
    });
  }
}
class it extends k {
}
(function(n) {
  n.RunsPage = it, n.Steps = ye, n.RunStepsPage = rt;
})(be || (be = {}));
class _e extends g {
  constructor() {
    super(...arguments), this.runs = new be(this.client), this.messages = new we(this.client);
  }
  create(e = {}, t) {
    return I(e) ? this.create({}, e) : this.post("/threads", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Retrieves a thread.
   */
  retrieve(e, t) {
    return this.get(`/threads/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Modifies a thread.
   */
  update(e, t, s) {
    return this.post(`/threads/${e}`, {
      body: t,
      ...s,
      headers: { "OpenAI-Beta": "assistants=v1", ...s == null ? void 0 : s.headers }
    });
  }
  /**
   * Delete a thread.
   */
  del(e, t) {
    return this.delete(`/threads/${e}`, {
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Create a thread and run it in one request.
   */
  createAndRun(e, t) {
    return this.post("/threads/runs", {
      body: e,
      ...t,
      headers: { "OpenAI-Beta": "assistants=v1", ...t == null ? void 0 : t.headers }
    });
  }
}
(function(n) {
  n.Runs = be, n.RunsPage = it, n.Messages = we, n.ThreadMessagesPage = st;
})(_e || (_e = {}));
class Ce extends g {
  constructor() {
    super(...arguments), this.chat = new pe(this.client), this.assistants = new me(this.client), this.threads = new _e(this.client);
  }
}
(function(n) {
  n.Chat = pe, n.Assistants = me, n.AssistantsPage = tt, n.Threads = _e;
})(Ce || (Ce = {}));
class xe extends g {
  create(e, t) {
    return this.post("/completions", { body: e, ...t, stream: e.stream ?? !1 });
  }
}
xe || (xe = {});
class Pe extends g {
  /**
   * Creates an embedding vector representing the input text.
   */
  create(e, t) {
    return this.post("/embeddings", { body: e, ...t });
  }
}
Pe || (Pe = {});
class Re extends g {
  /**
   * Creates a new edit for the provided input, instruction, and parameters.
   *
   * @deprecated The Edits API is deprecated; please use Chat Completions instead.
   *
   * https://openai.com/blog/gpt-4-api-general-availability#deprecation-of-the-edits-api
   */
  create(e, t) {
    return this.post("/edits", { body: e, ...t });
  }
}
Re || (Re = {});
class Se extends g {
  /**
   * Upload a file that can be used across various endpoints/features. The size of
   * all the files uploaded by one organization can be up to 100 GB.
   *
   * The size of individual files for can be a maximum of 512MB. See the
   * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) to
   * learn more about the types of files supported. The Fine-tuning API only supports
   * `.jsonl` files.
   *
   * Please [contact us](https://help.openai.com/) if you need to increase these
   * storage limits.
   */
  create(e, t) {
    return this.post("/files", G({ body: e, ...t }));
  }
  /**
   * Returns information about a specific file.
   */
  retrieve(e, t) {
    return this.get(`/files/${e}`, t);
  }
  list(e = {}, t) {
    return I(e) ? this.list({}, e) : this.getAPIList("/files", at, { query: e, ...t });
  }
  /**
   * Delete a file.
   */
  del(e, t) {
    return this.delete(`/files/${e}`, t);
  }
  /**
   * Returns the contents of the specified file.
   */
  content(e, t) {
    return this.get(`/files/${e}/content`, { ...t, __binaryResponse: !0 });
  }
  /**
   * Returns the contents of the specified file.
   *
   * @deprecated The `.content()` method should be used instead
   */
  retrieveContent(e, t) {
    return this.get(`/files/${e}/content`, {
      ...t,
      headers: { Accept: "application/json", ...t == null ? void 0 : t.headers }
    });
  }
  /**
   * Waits for the given file to be processed, default timeout is 30 mins.
   */
  async waitForProcessing(e, { pollInterval: t = 5e3, maxWait: s = 30 * 60 * 1e3 } = {}) {
    const r = /* @__PURE__ */ new Set(["processed", "error", "deleted"]), i = Date.now();
    let a = await this.retrieve(e);
    for (; !a.status || !r.has(a.status); )
      if (await Ht(t), a = await this.retrieve(e), Date.now() - i > s)
        throw new Ze({
          message: `Giving up on waiting for file ${e} to finish processing after ${s} milliseconds.`
        });
    return a;
  }
}
class at extends ke {
}
(function(n) {
  n.FileObjectsPage = at;
})(Se || (Se = {}));
class Ae extends g {
  /**
   * Creates a job that fine-tunes a specified model from a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/legacy-fine-tuning)
   */
  create(e, t) {
    return this.post("/fine-tunes", { body: e, ...t });
  }
  /**
   * Gets info about the fine-tune job.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/legacy-fine-tuning)
   */
  retrieve(e, t) {
    return this.get(`/fine-tunes/${e}`, t);
  }
  /**
   * List your organization's fine-tuning jobs
   */
  list(e) {
    return this.getAPIList("/fine-tunes", ot, e);
  }
  /**
   * Immediately cancel a fine-tune job.
   */
  cancel(e, t) {
    return this.post(`/fine-tunes/${e}/cancel`, t);
  }
  listEvents(e, t, s) {
    return this.get(`/fine-tunes/${e}/events`, {
      query: t,
      timeout: 864e5,
      ...s,
      stream: (t == null ? void 0 : t.stream) ?? !1
    });
  }
}
class ot extends ke {
}
(function(n) {
  n.FineTunesPage = ot;
})(Ae || (Ae = {}));
class Ee extends g {
  /**
   * Creates a job that fine-tunes a specified model from a given dataset.
   *
   * Response includes details of the enqueued job including job status and the name
   * of the fine-tuned models once complete.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   */
  create(e, t) {
    return this.post("/fine_tuning/jobs", { body: e, ...t });
  }
  /**
   * Get info about a fine-tuning job.
   *
   * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
   */
  retrieve(e, t) {
    return this.get(`/fine_tuning/jobs/${e}`, t);
  }
  list(e = {}, t) {
    return I(e) ? this.list({}, e) : this.getAPIList("/fine_tuning/jobs", ct, { query: e, ...t });
  }
  /**
   * Immediately cancel a fine-tune job.
   */
  cancel(e, t) {
    return this.post(`/fine_tuning/jobs/${e}/cancel`, t);
  }
  listEvents(e, t = {}, s) {
    return I(t) ? this.listEvents(e, {}, t) : this.getAPIList(`/fine_tuning/jobs/${e}/events`, lt, {
      query: t,
      ...s
    });
  }
}
class ct extends k {
}
class lt extends k {
}
(function(n) {
  n.FineTuningJobsPage = ct, n.FineTuningJobEventsPage = lt;
})(Ee || (Ee = {}));
class $e extends g {
  constructor() {
    super(...arguments), this.jobs = new Ee(this.client);
  }
}
(function(n) {
  n.Jobs = Ee, n.FineTuningJobsPage = ct, n.FineTuningJobEventsPage = lt;
})($e || ($e = {}));
class Te extends g {
  /**
   * Creates a variation of a given image.
   */
  createVariation(e, t) {
    return this.post("/images/variations", G({ body: e, ...t }));
  }
  /**
   * Creates an edited or extended image given an original image and a prompt.
   */
  edit(e, t) {
    return this.post("/images/edits", G({ body: e, ...t }));
  }
  /**
   * Creates an image given a prompt.
   */
  generate(e, t) {
    return this.post("/images/generations", { body: e, ...t });
  }
}
Te || (Te = {});
class ve extends g {
  /**
   * Retrieves a model instance, providing basic information about the model such as
   * the owner and permissioning.
   */
  retrieve(e, t) {
    return this.get(`/models/${e}`, t);
  }
  /**
   * Lists the currently available models, and provides basic information about each
   * one such as the owner and availability.
   */
  list(e) {
    return this.getAPIList("/models", ut, e);
  }
  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization to
   * delete a model.
   */
  del(e, t) {
    return this.delete(`/models/${e}`, t);
  }
}
class ut extends ke {
}
(function(n) {
  n.ModelsPage = ut;
})(ve || (ve = {}));
class Fe extends g {
  /**
   * Classifies if text violates OpenAI's Content Policy
   */
  create(e, t) {
    return this.post("/moderations", { body: e, ...t });
  }
}
Fe || (Fe = {});
var Kt;
class b extends fn {
  /**
   * API Client for interfacing with the OpenAI API.
   *
   * @param {string} [opts.apiKey==process.env['OPENAI_API_KEY'] ?? undefined]
   * @param {string | null} [opts.organization==process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string} [opts.baseURL] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ apiKey: e = yt("OPENAI_API_KEY"), organization: t = yt("OPENAI_ORG_ID") ?? null, ...s } = {}) {
    if (e === void 0)
      throw new m("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
    const r = {
      apiKey: e,
      organization: t,
      ...s,
      baseURL: s.baseURL ?? "https://api.openai.com/v1"
    };
    if (!r.dangerouslyAllowBrowser && Sn())
      throw new m(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
`);
    super({
      baseURL: r.baseURL,
      timeout: r.timeout ?? 6e5,
      httpAgent: r.httpAgent,
      maxRetries: r.maxRetries,
      fetch: r.fetch
    }), this.completions = new xe(this), this.chat = new ce(this), this.edits = new Re(this), this.embeddings = new Pe(this), this.files = new Se(this), this.images = new Te(this), this.audio = new de(this), this.moderations = new Fe(this), this.models = new ve(this), this.fineTuning = new $e(this), this.fineTunes = new Ae(this), this.beta = new Ce(this), this._options = r, this.apiKey = e, this.organization = t;
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  defaultHeaders(e) {
    return {
      ...super.defaultHeaders(e),
      "OpenAI-Organization": this.organization,
      ...this._options.defaultHeaders
    };
  }
  authHeaders(e) {
    return { Authorization: `Bearer ${this.apiKey}` };
  }
}
Kt = b;
b.OpenAI = Kt;
b.OpenAIError = m;
b.APIError = _;
b.APIConnectionError = Ie;
b.APIConnectionTimeoutError = Ze;
b.APIUserAbortError = j;
b.NotFoundError = It;
b.ConflictError = Mt;
b.RateLimitError = Ot;
b.BadRequestError = Tt;
b.AuthenticationError = vt;
b.InternalServerError = Lt;
b.PermissionDeniedError = Ft;
b.UnprocessableEntityError = kt;
(function(n) {
  n.toFile = Nt, n.fileFromPath = Et, n.Page = ke, n.CursorPage = k, n.Completions = xe, n.Chat = ce, n.Edits = Re, n.Embeddings = Pe, n.Files = Se, n.FileObjectsPage = at, n.Images = Te, n.Audio = de, n.Moderations = Fe, n.Models = ve, n.ModelsPage = ut, n.FineTuning = $e, n.FineTunes = Ae, n.FineTunesPage = ot, n.Beta = Ce;
})(b || (b = {}));
const $n = b;
(function() {
  try {
    if (typeof document < "u") {
      var n = document.createElement("style");
      n.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-paragraph[data-placeholder]:empty:before{content:attr(data-placeholder);color:#707684;font-weight:400;opacity:0}.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty:before{opacity:1}.codex-editor--toolbox-opened .ce-block:first-child .ce-paragraph[data-placeholder]:empty:before,.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty:focus:before{opacity:0}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(n);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const Tn = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
class ht {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data: e, config: t, api: s, readOnly: r }) {
    this.api = s, this.readOnly = r, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = t.placeholder ? t.placeholder : ht.DEFAULT_PLACEHOLDER, this._data = {}, this._element = null, this._preserveBlank = t.preserveBlank !== void 0 ? t.preserveBlank : !1, this.data = e;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete")
      return;
    const { textContent: t } = this._element;
    t === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLElement}
   * @private
   */
  drawView() {
    const e = document.createElement("DIV");
    return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = !1, e.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.contentEditable = !0, e.addEventListener("keyup", this.onKeyUp)), e;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {ParagraphData} data
   * @public
   */
  merge(e) {
    const t = {
      text: this.data.text + e.text
    };
    this.data = t;
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return !(e.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = {
      text: e.detail.data.innerHTML
    };
    this.data = t;
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: "text",
      // to convert Paragraph to other block, use 'text' property of saved data
      import: "text"
      // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: !0
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Get current Tools`s data
   *
   * @returns {ParagraphData} Current data
   * @private
   */
  get data() {
    if (this._element !== null) {
      const e = this._element.innerHTML;
      this._data.text = e;
    }
    return this._data;
  }
  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {ParagraphData} data — data to set
   * @private
   */
  set data(e) {
    this._data = e || {}, this._element !== null && this.hydrate();
  }
  /**
   * Fill tool's view with data
   */
  hydrate() {
    window.requestAnimationFrame(() => {
      this._element.innerHTML = this._data.text || "";
    });
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: Tn,
      title: "Text"
    };
  }
}
function vn(n, e = 2e3) {
  let t;
  return (...s) => {
    clearTimeout(t), t = setTimeout(() => {
      n.apply(this, s);
    }, e);
  };
}
class Un extends ht {
  constructor(t) {
    super(t);
    Be(this, "openai");
    Be(this, "onInput", vn((t) => {
      this._element.querySelector("#ai-suggestions") || t.inputType === "deleteContentBackward" || t.inputType === "deleteContentForward" || t.inputType === "insertParagraph" || t.inputType === "insertFromPaste" || t.inputType === "insertFromDrop" || !t.target.innerHTML || this.getAICompletion(t.target.innerHTML);
    }));
    if (!t.openaiKey)
      throw new Error("OpenAI key is required for AI Text");
    this.openai = new $n({
      apiKey: t.openaiKey,
      dangerouslyAllowBrowser: !0
    });
  }
  static get toolbox() {
    return {
      title: "AI TEXT (experimental)",
      icon: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    };
  }
  getAICompletion(t) {
    if (!t)
      return;
    const s = document.createElement("div");
    s.innerHTML = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.99988V5.99988M12 20.9999V17.9999M4.20577 16.4999L6.80385 14.9999M21 11.9999H18M16.5 19.7941L15 17.196M3 11.9999H6M7.5 4.20565L9 6.80373M7.5 19.7941L9 17.196M19.7942 16.4999L17.1962 14.9999M4.20577 7.49988L6.80385 8.99988" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`, s.id = "ai-suggestions-loader", s.style.display = "inline-flex", s.style.alignItems = "center", s.style.width = "24px", s.style.height = "24px", s.style.paddingLeft = "4px", s.style.color = "lightgray", s.style.position = "absolute", this._element.appendChild(s), openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Behave yourself as a professional journalist and finish this text in similar style: ${t.length > 100 ? t : t.slice(t.length - 100)}`
        }
      ],
      max_tokens: 256,
      model: "gpt-3.5-turbo"
    }).then((r) => {
      var a;
      const i = document.createElement("span");
      i.innerHTML = "", i.id = "ai-suggestions", i.style.color = "lightgray", i.innerHTML = r.choices[0].message.content, this._element.appendChild(i), (a = this._element.querySelector("#ai-suggestions-loader")) == null || a.remove();
    });
  }
  onKeyUp(t) {
    var r;
    if (t.code === "Escape" || t.code === "Backspace") {
      (r = this._element.querySelector("#ai-suggestions")) == null || r.remove();
      return;
    }
    if (t.code === "AltLeft" || t.code === "AltRight") {
      const i = this._element.querySelector("#ai-suggestions"), a = i == null ? void 0 : i.textContent;
      if (!a)
        return;
      const o = document.createTextNode(
        a
      );
      this._element.appendChild(o), i.remove();
      return;
    }
    if (t.code !== "Backspace" && t.code !== "Delete")
      return;
    const { textContent: s } = this._element;
    s === "" && (this._element.innerHTML = "");
  }
  drawView() {
    const t = document.createElement("DIV");
    return t.classList.add(this._CSS.wrapper, this._CSS.block), t.contentEditable = !1, t.dataset.placeholder = this.api.i18n.t(this._placeholder), this._data.text && (t.innerHTML = this._data.text), this.readOnly || (t.contentEditable = !0, t.addEventListener("keyup", this.onKeyUp), t.addEventListener("input", this.onInput)), t;
  }
}
export {
  Un as default
};
