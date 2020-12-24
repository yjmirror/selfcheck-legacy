"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;
exports.default = exports.SelfcheckError = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function big_base64(m) {
  if (m === undefined) return undefined;
  const bytes = [];

  while (m > 0n) {
    bytes.push(Number(m & 255n));
    m = m >> 8n;
  }

  bytes.reverse();
  let a = btoa(String.fromCharCode.apply(null, bytes)).replace(/=/g, "");
  a = a.replace(/\+/g, "-");
  a = a.replace(/\//g, "_");
  return a;
}

function getHashFunctionName(hash) {
  if (hash === "sha1") return "SHA-1";
  if (hash === "sha256") return "SHA-256";
  return "";
}

async function createWebCryptoKey(key, usage, options) {
  let jwk = {
    kty: "RSA",
    n: big_base64(key.n),
    ext: true
  };

  if (usage === "encrypt") {
    jwk = { ...jwk,
      e: big_base64(key.e)
    };
  } else if (usage === "decrypt") {
    jwk = { ...jwk,
      d: big_base64(key.d),
      e: big_base64(key.e),
      p: big_base64(key.p),
      q: big_base64(key.q),
      dp: big_base64(key.dp),
      dq: big_base64(key.dq),
      qi: big_base64(key.qi)
    };
  }

  return await crypto.subtle.importKey("jwk", jwk, {
    name: "RSA-OAEP",
    hash: {
      name: getHashFunctionName(options.hash)
    }
  }, false, [usage]);
}

class WebCryptoRSA {
  constructor(key1, options1) {
    _defineProperty(this, "encryptedKey", null);

    _defineProperty(this, "decryptedKey", null);

    this.key = key1;
    this.options = options1;
  }

  static isSupported(options) {
    if (!crypto.subtle) return false;
    if (options.padding !== "oaep") return false;
    return true;
  }

  static async encrypt(key, m, options) {
    return await crypto.subtle.encrypt({
      name: "RSA-OAEP"
    }, await createWebCryptoKey(key, "encrypt", options), m);
  }

  static async decrypt(key, m, options) {
    return await crypto.subtle.decrypt({
      name: "RSA-OAEP"
    }, await createWebCryptoKey(key, "decrypt", options), m);
  }

}

function power_mod(n, p, m) {
  if (p === 1n) return n;

  if (p % 2n === 0n) {
    const t = power_mod(n, p >> 1n, m);
    return t * t % m;
  } else {
    const t = power_mod(n, p >> 1n, m);
    return t * t * n % m;
  }
}

function rsaep(n, e, m) {
  return power_mod(m, e, n);
}

function rsadp(key2, c) {
  if (!key2.d) throw "Invalid RSA key";

  if (key2.dp && key2.dq && key2.qi && key2.q && key2.p) {
    const m1 = power_mod(c % key2.p, key2.dp, key2.p);
    const m2 = power_mod(c % key2.q, key2.dq, key2.q);
    let h = 0n;

    if (m1 >= m2) {
      h = key2.qi * (m1 - m2) % key2.p;
    } else {
      h = key2.qi * (m1 - m2 + key2.p * (key2.p / key2.q)) % key2.p;
    }

    return (m2 + h * key2.q) % (key2.q * key2.p);
  } else {
    return power_mod(c, key2.d, key2.n);
  }
}

function detect_format(key2) {
  if (typeof key2 === "object") {
    if (key2.kty === "RSA") return "jwk";
  } else if (typeof key2 === "string") {
    if (key2.substr(0, "-----".length) === "-----") return "pem";
  }

  throw new TypeError("Unsupported key format");
}

function createSizeBuffer(size) {
  if (size <= 127) return new Uint8Array([size]);
  const bytes = [];

  while (size > 0) {
    bytes.push(size & 255);
    size = size >> 8;
  }

  bytes.reverse();
  return new Uint8Array([128 + bytes.length, ...bytes]);
}

class BER {
  static createSequence(children) {
    const size = children.reduce((accumlatedSize, child) => accumlatedSize + child.length, 0);
    return new Uint8Array([48, ...createSizeBuffer(size), ...children.reduce((buffer, child) => [...buffer, ...child], [])]);
  }

  static createNull() {
    return new Uint8Array([5, 0]);
  }

  static createBoolean(value) {
    return new Uint8Array([1, 1, value ? 1 : 0]);
  }

  static createInteger(value) {
    if (typeof value === "number") return BER.createBigInteger(BigInt(value));
    return BER.createBigInteger(value);
  }

  static createBigInteger(value) {
    if (value === 0n) return new Uint8Array([2, 1, 0]);
    const isNegative = value < 0;
    const content = [];
    let n = isNegative ? -value : value;

    while (n > 0n) {
      content.push(Number(n & 255n));
      n = n >> 8n;
    }

    if (!isNegative) {
      if (content[content.length - 1] & 128) content.push(0);
    } else {
      for (let i = 0; i < content.length; i++) content[i] = 256 - content[i];

      if (!(content[content.length - 1] & 128)) content.push(255);
    }

    content.reverse();
    return new Uint8Array([2, ...createSizeBuffer(content.length), ...content]);
  }

  static createBitString(value) {
    return new Uint8Array([3, ...createSizeBuffer(value.length + 1), 0, ...value]);
  }

}

function add_line_break(base64_str) {
  const lines = [];

  for (let i = 0; i < base64_str.length; i += 64) {
    lines.push(base64_str.substr(i, 64));
  }

  return lines.join("\n");
}

function computeMessage(m) {
  return typeof m === "string" ? new TextEncoder().encode(m) : m;
}

function computeOption(options2) {
  return {
    hash: "sha1",
    padding: "oaep",
    ...options2
  };
}

function normalizeUrl(url) {
  if (url.startsWith('http')) return url;else return `https://${url}`;
}

function getAreaCode(a) {
  return {
    서울: '01',
    부산: '02',
    대구: '03',
    인천: '04',
    광주: '05',
    대전: '06',
    울산: '07',
    세종: '08',
    경기: '10',
    강원: '11',
    충북: '12',
    충남: '13',
    전북: '14',
    전남: '15',
    경북: '16',
    경남: '17',
    제주: '18'
  }[a];
}

function toArea(area) {
  return area;
}

function inferSchoolLevel(name) {
  const idx = name.length - (name.endsWith('학교') ? 3 : 1);
  const table = {
    원: 1,
    초: 2,
    중: 3,
    고: 4
  };
  return table[name[idx]] || table[name[idx - 1]] || 5;
}

class SelfcheckError extends Error {}

exports.SelfcheckError = SelfcheckError;

class RawBinary extends Uint8Array {
  hex() {
    return [...this].map(x => x.toString(16).padStart(2, "0")).join("");
  }

  binary() {
    return this;
  }

  base64() {
    return btoa(String.fromCharCode.apply(null, [...this]));
  }

  base64url() {
    let a = btoa(String.fromCharCode.apply(null, [...this])).replace(/=/g, "");
    a = a.replace(/\+/g, "-");
    a = a.replace(/\//g, "_");
    return a;
  }

  base32() {
    const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const trim = [0, 1, 3, 7, 15, 31, 63, 127, 255];
    let output = "";
    let bits = 0;
    let current = 0;

    for (let i = 0; i < this.length; i++) {
      current = (current << 8) + this[i];
      bits += 8;

      while (bits >= 5) {
        bits -= 5;
        output += lookup[current >> bits];
        current = current & trim[bits];
      }
    }

    if (bits > 0) {
      output += lookup[current << 5 - bits];
    }

    return output;
  }

  toString() {
    return new TextDecoder().decode(this);
  }

}

const decoder = new TextDecoder();
const encoder = new TextEncoder();

function toHexString(buf) {
  return buf.reduce((hex, byte) => `${hex}${byte < 16 ? "0" : ""}${byte.toString(16)}`, "");
}

function fromHexString(hex) {
  const len = hex.length;

  if (len % 2 || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new TypeError("Invalid hex string.");
  }

  hex = hex.toLowerCase();
  const buf = new Uint8Array(Math.floor(len / 2));
  const end = len / 2;

  for (let i = 0; i < end; ++i) {
    buf[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return buf;
}

function rotl(x, n) {
  return x << n | x >>> 32 - n;
}

const lookup = [];
const revLookup = [];
const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

for (let i = 0, l = code.length; i < l; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
const decoder1 = new TextDecoder();
const encoder1 = new TextEncoder();

function toHexString1(buf) {
  return buf.reduce((hex, byte) => `${hex}${byte < 16 ? "0" : ""}${byte.toString(16)}`, "");
}

function fromHexString1(hex) {
  const len = hex.length;

  if (len % 2 || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new TypeError("Invalid hex string.");
  }

  hex = hex.toLowerCase();
  const buf = new Uint8Array(Math.floor(len / 2));
  const end = len / 2;

  for (let i1 = 0; i1 < end; ++i1) {
    buf[i1] = parseInt(hex.substr(i1 * 2, 2), 16);
  }

  return buf;
}

function digestLength(algorithm) {
  if (algorithm === "sha512") return 64;
  if (algorithm === "sha256") return 32;
  return 20;
}

function i2osp(x, length) {
  const t = new Uint8Array(length);

  for (let i1 = length - 1; i1 >= 0; i1--) {
    if (x === 0n) break;
    t[i1] = Number(x & 255n);
    x = x >> 8n;
  }

  return t;
}

function os2ip(m) {
  let n = 0n;

  for (const c of m) n = (n << 8n) + BigInt(c);

  return n;
}

function xor(a, b) {
  const c = new Uint8Array(a.length);

  for (let i1 = 0; i1 < c.length; i1++) {
    c[i1] = a[i1] ^ b[i1 % b.length];
  }

  return c;
}

function concat(...arg) {
  const length = arg.reduce((a, b) => a + b.length, 0);
  const c = new Uint8Array(length);
  let ptr = 0;

  for (let i1 = 0; i1 < arg.length; i1++) {
    c.set(arg[i1], ptr);
    ptr += arg[i1].length;
  }

  return c;
}

function random_bytes(length) {
  const n = new Uint8Array(length);

  for (let i1 = 0; i1 < length; i1++) n[i1] = (Math.random() * 254 | 0) + 1;

  return n;
}

function get_key_size(n) {
  const size_list = [64n, 128n, 256n, 512n, 1024n];

  for (const size of size_list) {
    if (n < 1n << size * 8n) return Number(size);
  }

  return 2048;
}

function base64_to_binary(b) {
  let binaryString = window.atob(b);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);

  for (var i1 = 0; i1 < len; i1++) {
    bytes[i1] = binaryString.charCodeAt(i1);
  }

  return bytes;
}

function ber_integer(bytes, from, length) {
  let n = 0n;

  for (const b of bytes.slice(from, from + length)) {
    n = (n << 8n) + BigInt(b);
  }

  return n;
}

function ber_oid(bytes, from, length) {
  const id = [bytes[from] / 40 | 0, bytes[from] % 40];
  let value = 0;

  for (const b of bytes.slice(from + 1, from + length)) {
    if (b > 128) value += value * 127 + (b - 128);else {
      value = value * 128 + b;
      id.push(value);
      value = 0;
    }
  }

  return id.join(".");
}

function ber_unknown(bytes, from, length) {
  return bytes.slice(from, from + length);
}

function ber_simple(n) {
  if (Array.isArray(n.value)) return n.value.map(x => ber_simple(x));
  return n.value;
}

class encode {
  static hex(data) {
    if (data.length % 2 !== 0) throw "Invalid hex format";
    const output = new RawBinary(data.length >> 1);
    let ptr = 0;

    for (let i1 = 0; i1 < data.length; i1 += 2) {
      output[ptr++] = parseInt(data.substr(i1, 2), 16);
    }

    return output;
  }

  static bigint(n) {
    const bytes = [];

    while (n > 0) {
      bytes.push(Number(n & 255n));
      n = n >> 8n;
    }

    bytes.reverse();
    return new RawBinary(bytes);
  }

  static string(data) {
    return new RawBinary(new TextEncoder().encode(data));
  }

  static base64(data) {
    return new RawBinary(Uint8Array.from(atob(data), c => c.charCodeAt(0)));
  }

  static base64url(data) {
    let input = data.replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;

    if (pad) {
      if (pad === 1) throw "Invalid length";
      input += new Array(5 - pad).join("=");
    }

    return encode.base64(input);
  }

  static binary(data) {
    return new RawBinary(data);
  }

  static base32(data) {
    data = data.toUpperCase();
    data = data.replace(/=+$/g, "");
    const lookup1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const size = data.length * 5 >> 3;
    const output = new RawBinary(size);
    let ptr = 0;
    let bits = 0;
    let current = 0;

    for (let i1 = 0; i1 < data.length; i1++) {
      const value = lookup1.indexOf(data[i1]);
      if (value < 0) throw "Invalid base32 format";
      current = (current << 5) + value;
      bits += 5;

      if (bits >= 8) {
        bits -= 8;
        const t = current >> bits;
        current -= t << bits;
        output[ptr++] = t;
      }
    }

    return output;
  }

}

const lookup1 = [];
const revLookup1 = [];
const code1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

for (let i1 = 0, l1 = code1.length; i1 < l1; ++i1) {
  lookup1[i1] = code1[i1];
  revLookup1[code1.charCodeAt(i1)] = i1;
}

function getLengths(b64) {
  const len = b64.length;
  let validLen = b64.indexOf("=");

  if (validLen === -1) {
    validLen = len;
  }

  const placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}

function init(lookup2, revLookup2, urlsafe = false) {
  function _byteLength(validLen, placeHoldersLen) {
    return Math.floor((validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen);
  }

  function tripletToBase64(num) {
    return lookup2[num >> 18 & 63] + lookup2[num >> 12 & 63] + lookup2[num >> 6 & 63] + lookup2[num & 63];
  }

  function encodeChunk(buf, start, end) {
    const out = new Array((end - start) / 3);

    for (let i2 = start, curTriplet = 0; i2 < end; i2 += 3) {
      out[curTriplet++] = tripletToBase64((buf[i2] << 16) + (buf[i2 + 1] << 8) + buf[i2 + 2]);
    }

    return out.join("");
  }

  return {
    byteLength(b64) {
      return _byteLength.apply(null, getLengths(b64));
    },

    toUint8Array(b64) {
      const [validLen, placeHoldersLen] = getLengths(b64);
      const buf = new Uint8Array(_byteLength(validLen, placeHoldersLen));
      const len = placeHoldersLen ? validLen - 4 : validLen;
      let tmp;
      let curByte = 0;
      let i2;

      for (i2 = 0; i2 < len; i2 += 4) {
        tmp = revLookup2[b64.charCodeAt(i2)] << 18 | revLookup2[b64.charCodeAt(i2 + 1)] << 12 | revLookup2[b64.charCodeAt(i2 + 2)] << 6 | revLookup2[b64.charCodeAt(i2 + 3)];
        buf[curByte++] = tmp >> 16 & 255;
        buf[curByte++] = tmp >> 8 & 255;
        buf[curByte++] = tmp & 255;
      }

      if (placeHoldersLen === 2) {
        tmp = revLookup2[b64.charCodeAt(i2)] << 2 | revLookup2[b64.charCodeAt(i2 + 1)] >> 4;
        buf[curByte++] = tmp & 255;
      } else if (placeHoldersLen === 1) {
        tmp = revLookup2[b64.charCodeAt(i2)] << 10 | revLookup2[b64.charCodeAt(i2 + 1)] << 4 | revLookup2[b64.charCodeAt(i2 + 2)] >> 2;
        buf[curByte++] = tmp >> 8 & 255;
        buf[curByte++] = tmp & 255;
      }

      return buf;
    },

    fromUint8Array(buf) {
      const maxChunkLength = 16383;
      const len = buf.length;
      const extraBytes = len % 3;
      const len2 = len - extraBytes;
      const parts = new Array(Math.ceil(len2 / 16383) + (extraBytes ? 1 : 0));
      let curChunk = 0;
      let chunkEnd;

      for (let i2 = 0; i2 < len2; i2 += 16383) {
        chunkEnd = i2 + 16383;
        parts[curChunk++] = encodeChunk(buf, i2, chunkEnd > len2 ? len2 : chunkEnd);
      }

      let tmp;

      if (extraBytes === 1) {
        tmp = buf[len2];
        parts[curChunk] = lookup2[tmp >> 2] + lookup2[tmp << 4 & 63];
        if (!urlsafe) parts[curChunk] += "==";
      } else if (extraBytes === 2) {
        tmp = buf[len2] << 8 | buf[len2 + 1] & 255;
        parts[curChunk] = lookup2[tmp >> 10] + lookup2[tmp >> 4 & 63] + lookup2[tmp << 2 & 63];
        if (!urlsafe) parts[curChunk] += "=";
      }

      return parts.join("");
    }

  };
}

function rsa_pkcs1_encrypt(bytes, n, e, m) {
  const p = concat([0, 2], random_bytes(bytes - m.length - 3), [0], m);
  const msg = os2ip(p);
  const c = rsaep(n, e, msg);
  return i2osp(c, bytes);
}

function rsa_pkcs1_decrypt(key2, c) {
  const em = i2osp(rsadp(key2, os2ip(c)), key2.length);
  if (em[0] !== 0) throw "Decryption error";
  if (em[1] !== 2) throw "Decryption error";
  let psCursor = 2;

  for (; psCursor < em.length; psCursor++) {
    if (em[psCursor] === 0) break;
  }

  if (psCursor < 10) throw "Decryption error";
  return em.slice(psCursor + 1);
}

function rsa_pkcs1_sign(bytes, n, d, message, algorithm) {
  const oid = [48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, algorithm === "sha512" ? 3 : 1, 5, 0];
  const der = [48, message.length + 2 + oid.length, ...oid, 4, message.length, ...message];
  const ps = new Array(bytes - 3 - der.length).fill(255);
  const em = new Uint8Array([0, 1, ...ps, 0, ...der]);
  const msg = os2ip(em);
  const c = rsaep(n, d, msg);
  return new RawBinary(i2osp(c, bytes));
}

function rsa_import_jwk(key2) {
  if (typeof key2 !== "object") throw new TypeError("Invalid JWK format");
  if (!key2.n) throw new TypeError("RSA key requires n");
  const n = os2ip(encode.base64url(key2.n));
  return {
    e: key2.e ? os2ip(encode.base64url(key2.e)) : undefined,
    n: os2ip(encode.base64url(key2.n)),
    d: key2.d ? os2ip(encode.base64url(key2.d)) : undefined,
    p: key2.p ? os2ip(encode.base64url(key2.p)) : undefined,
    q: key2.q ? os2ip(encode.base64url(key2.q)) : undefined,
    dp: key2.dp ? os2ip(encode.base64url(key2.dp)) : undefined,
    dq: key2.dq ? os2ip(encode.base64url(key2.dq)) : undefined,
    qi: key2.qi ? os2ip(encode.base64url(key2.qi)) : undefined,
    length: get_key_size(n)
  };
}

function rsa_export_pkcs8_public(key2) {
  const content = BER.createSequence([BER.createSequence([new Uint8Array([6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1]), BER.createNull()]), BER.createBitString(BER.createSequence([BER.createInteger(key2.n), BER.createInteger(key2.e || 0n)]))]);
  return "-----BEGIN PUBLIC KEY-----\n" + add_line_break(encode.binary(content).base64()) + "\n-----END PUBLIC KEY-----\n";
}

function rsa_export_pkcs8_private(key2) {
  const content = BER.createSequence([BER.createInteger(0), BER.createInteger(key2.n), BER.createInteger(key2.e || 0n), BER.createInteger(key2.d || 0n), BER.createInteger(key2.p || 0n), BER.createInteger(key2.q || 0n), BER.createInteger(key2.dp || 0n), BER.createInteger(key2.dq || 0n), BER.createInteger(key2.qi || 0n)]);
  const ber = encode.binary(content).base64();
  return "-----BEGIN RSA PRIVATE KEY-----\n" + add_line_break(ber) + "\n-----END RSA PRIVATE KEY-----\n";
}

class RSAKey {
  constructor(params) {
    this.n = params.n;
    this.e = params.e;
    this.d = params.d;
    this.p = params.p;
    this.q = params.q;
    this.dp = params.dp;
    this.dq = params.dq;
    this.qi = params.qi;
    this.length = params.length;
  }

  pem() {
    if (this.d) {
      return rsa_export_pkcs8_private(this);
    } else {
      return rsa_export_pkcs8_public(this);
    }
  }

  jwk() {
    let jwk = {
      kty: "RSA",
      n: encode.bigint(this.n).base64url()
    };
    if (this.d) jwk = { ...jwk,
      d: encode.bigint(this.d).base64url()
    };
    if (this.e) jwk = { ...jwk,
      e: encode.bigint(this.e).base64url()
    };
    if (this.p) jwk = { ...jwk,
      p: encode.bigint(this.p).base64url()
    };
    if (this.q) jwk = { ...jwk,
      q: encode.bigint(this.q).base64url()
    };
    if (this.dp) jwk = { ...jwk,
      dp: encode.bigint(this.dp).base64url()
    };
    if (this.dq) jwk = { ...jwk,
      dq: encode.bigint(this.dq).base64url()
    };
    if (this.qi) jwk = { ...jwk,
      qi: encode.bigint(this.qi).base64url()
    };
    return jwk;
  }

}

function normalizeArea(area) {
  for (const char of '남북') {
    if (area.includes(char)) return toArea(area[0] + char);
  }

  return toArea(area.slice(0, 2));
}

const {
  byteLength,
  toUint8Array,
  fromUint8Array
} = init(lookup, revLookup);

function encode1(str, encoding = "utf8") {
  if (/^utf-?8$/i.test(encoding)) {
    return encoder1.encode(str);
  } else if (/^base64(?:url)?$/i.test(encoding)) {
    return toUint8Array(str);
  } else if (/^hex(?:adecimal)?$/i.test(encoding)) {
    return fromHexString1(str);
  } else {
    throw new TypeError("Unsupported string encoding.");
  }
}

const {
  byteLength: byteLength1,
  toUint8Array: toUint8Array1,
  fromUint8Array: fromUint8Array1
} = init(lookup1, revLookup1, true);

function decode(buf, encoding = "utf8") {
  if (/^utf-?8$/i.test(encoding)) {
    return decoder.decode(buf);
  } else if (/^base64$/i.test(encoding)) {
    return fromUint8Array1(buf);
  } else if (/^hex(?:adecimal)?$/i.test(encoding)) {
    return toHexString(buf);
  } else {
    throw new TypeError("Unsupported string encoding.");
  }
}

function encode2(str, encoding = "utf8") {
  if (/^utf-?8$/i.test(encoding)) {
    return encoder.encode(str);
  } else if (/^base64$/i.test(encoding)) {
    return toUint8Array1(str);
  } else if (/^hex(?:adecimal)?$/i.test(encoding)) {
    return fromHexString(str);
  } else {
    throw new TypeError("Unsupported string encoding.");
  }
}

class SHA1 {
  constructor() {
    _defineProperty(this, "hashSize", 20);

    _defineProperty(this, "_buf", new Uint8Array(64));

    _defineProperty(this, "_K", new Uint32Array([1518500249, 1859775393, 2400959708, 3395469782]));

    this.init();
  }

  static F(t, b, c, d) {
    if (t <= 19) {
      return b & c | ~b & d;
    } else if (t <= 39) {
      return b ^ c ^ d;
    } else if (t <= 59) {
      return b & c | b & d | c & d;
    } else {
      return b ^ c ^ d;
    }
  }

  init() {
    this._H = new Uint32Array([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
    this._bufIdx = 0;
    this._count = new Uint32Array(2);

    this._buf.fill(0);

    this._finalized = false;
    return this;
  }

  update(msg, inputEncoding) {
    if (msg === null) {
      throw new TypeError("msg must be a string or Uint8Array.");
    } else if (typeof msg === "string") {
      msg = encode2(msg, inputEncoding);
    }

    for (let i2 = 0; i2 < msg.length; i2++) {
      this._buf[this._bufIdx++] = msg[i2];

      if (this._bufIdx === 64) {
        this.transform();
        this._bufIdx = 0;
      }
    }

    const c = this._count;

    if ((c[0] += msg.length << 3) < msg.length << 3) {
      c[1]++;
    }

    c[1] += msg.length >>> 29;
    return this;
  }

  digest(outputEncoding) {
    if (this._finalized) {
      throw new Error("digest has already been called.");
    }

    this._finalized = true;
    const b = this._buf;
    let idx = this._bufIdx;
    b[idx++] = 128;

    while (idx !== 56) {
      if (idx === 64) {
        this.transform();
        idx = 0;
      }

      b[idx++] = 0;
    }

    const c = this._count;
    b[56] = c[1] >>> 24 & 255;
    b[57] = c[1] >>> 16 & 255;
    b[58] = c[1] >>> 8 & 255;
    b[59] = c[1] >>> 0 & 255;
    b[60] = c[0] >>> 24 & 255;
    b[61] = c[0] >>> 16 & 255;
    b[62] = c[0] >>> 8 & 255;
    b[63] = c[0] >>> 0 & 255;
    this.transform();
    const hash = new Uint8Array(20);

    for (let i2 = 0; i2 < 5; i2++) {
      hash[(i2 << 2) + 0] = this._H[i2] >>> 24 & 255;
      hash[(i2 << 2) + 1] = this._H[i2] >>> 16 & 255;
      hash[(i2 << 2) + 2] = this._H[i2] >>> 8 & 255;
      hash[(i2 << 2) + 3] = this._H[i2] >>> 0 & 255;
    }

    this.init();
    return outputEncoding ? decode(hash, outputEncoding) : hash;
  }

  transform() {
    const h = this._H;
    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];
    const w = new Uint32Array(80);

    for (let i2 = 0; i2 < 16; i2++) {
      w[i2] = this._buf[(i2 << 2) + 3] | this._buf[(i2 << 2) + 2] << 8 | this._buf[(i2 << 2) + 1] << 16 | this._buf[i2 << 2] << 24;
    }

    for (let t = 0; t < 80; t++) {
      if (t >= 16) {
        w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
      }

      const tmp = rotl(a, 5) + SHA1.F(t, b, c, d) + e + w[t] + this._K[Math.floor(t / 20)] | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = tmp;
    }

    h[0] = h[0] + a | 0;
    h[1] = h[1] + b | 0;
    h[2] = h[2] + c | 0;
    h[3] = h[3] + d | 0;
    h[4] = h[4] + e | 0;
  }

}

function sha1(msg, inputEncoding, outputEncoding) {
  return new SHA1().update(msg, inputEncoding).digest(outputEncoding);
}

class SHA256 {
  constructor() {
    _defineProperty(this, "hashSize", 32);

    this._buf = new Uint8Array(64);
    this._K = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
    this.init();
  }

  init() {
    this._H = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]);
    this._bufIdx = 0;
    this._count = new Uint32Array(2);

    this._buf.fill(0);

    this._finalized = false;
    return this;
  }

  update(msg, inputEncoding) {
    if (msg === null) {
      throw new TypeError("msg must be a string or Uint8Array.");
    } else if (typeof msg === "string") {
      msg = encode2(msg, inputEncoding);
    }

    for (let i2 = 0, len = msg.length; i2 < len; i2++) {
      this._buf[this._bufIdx++] = msg[i2];

      if (this._bufIdx === 64) {
        this._transform();

        this._bufIdx = 0;
      }
    }

    const c = this._count;

    if ((c[0] += msg.length << 3) < msg.length << 3) {
      c[1]++;
    }

    c[1] += msg.length >>> 29;
    return this;
  }

  digest(outputEncoding) {
    if (this._finalized) {
      throw new Error("digest has already been called.");
    }

    this._finalized = true;
    const b = this._buf;
    let idx = this._bufIdx;
    b[idx++] = 128;

    while (idx !== 56) {
      if (idx === 64) {
        this._transform();

        idx = 0;
      }

      b[idx++] = 0;
    }

    const c = this._count;
    b[56] = c[1] >>> 24 & 255;
    b[57] = c[1] >>> 16 & 255;
    b[58] = c[1] >>> 8 & 255;
    b[59] = c[1] >>> 0 & 255;
    b[60] = c[0] >>> 24 & 255;
    b[61] = c[0] >>> 16 & 255;
    b[62] = c[0] >>> 8 & 255;
    b[63] = c[0] >>> 0 & 255;

    this._transform();

    const hash = new Uint8Array(32);

    for (let i2 = 0; i2 < 8; i2++) {
      hash[(i2 << 2) + 0] = this._H[i2] >>> 24 & 255;
      hash[(i2 << 2) + 1] = this._H[i2] >>> 16 & 255;
      hash[(i2 << 2) + 2] = this._H[i2] >>> 8 & 255;
      hash[(i2 << 2) + 3] = this._H[i2] >>> 0 & 255;
    }

    this.init();
    return outputEncoding ? decode(hash, outputEncoding) : hash;
  }

  _transform() {
    const h = this._H;
    let h0 = h[0];
    let h1 = h[1];
    let h2 = h[2];
    let h3 = h[3];
    let h4 = h[4];
    let h5 = h[5];
    let h6 = h[6];
    let h7 = h[7];
    const w = new Uint32Array(16);
    let i2;

    for (i2 = 0; i2 < 16; i2++) {
      w[i2] = this._buf[(i2 << 2) + 3] | this._buf[(i2 << 2) + 2] << 8 | this._buf[(i2 << 2) + 1] << 16 | this._buf[i2 << 2] << 24;
    }

    for (i2 = 0; i2 < 64; i2++) {
      let tmp;

      if (i2 < 16) {
        tmp = w[i2];
      } else {
        let a = w[i2 + 1 & 15];
        let b = w[i2 + 14 & 15];
        tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
      }

      tmp = tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + this._K[i2] | 0;
      h7 = h6;
      h6 = h5;
      h5 = h4;
      h4 = h3 + tmp;
      h3 = h2;
      h2 = h1;
      h1 = h0;
      h0 = tmp + (h1 & h2 ^ h3 & (h1 ^ h2)) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10) | 0;
    }

    h[0] = h[0] + h0 | 0;
    h[1] = h[1] + h1 | 0;
    h[2] = h[2] + h2 | 0;
    h[3] = h[3] + h3 | 0;
    h[4] = h[4] + h4 | 0;
    h[5] = h[5] + h5 | 0;
    h[6] = h[6] + h6 | 0;
    h[7] = h[7] + h7 | 0;
  }

}

function sha256(msg, inputEncoding, outputEncoding) {
  return new SHA256().update(msg, inputEncoding).digest(outputEncoding);
}

function decode1(buf, encoding = "utf8") {
  if (/^utf-?8$/i.test(encoding)) {
    return decoder1.decode(buf);
  } else if (/^base64$/i.test(encoding)) {
    return fromUint8Array(buf);
  } else if (/^base64url$/i.test(encoding)) {
    return fromUint8Array1(buf);
  } else if (/^hex(?:adecimal)?$/i.test(encoding)) {
    return toHexString1(buf);
  } else {
    throw new TypeError("Unsupported string encoding.");
  }
}

class SHA512 {
  constructor() {
    _defineProperty(this, "hashSize", 64);

    _defineProperty(this, "_buffer", new Uint8Array(128));

    this._K = new Uint32Array([1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591]);
    this.init();
  }

  init() {
    this._H = new Uint32Array([1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209]);
    this._bufferIndex = 0;
    this._count = new Uint32Array(2);

    this._buffer.fill(0);

    this._finalized = false;
    return this;
  }

  update(msg, inputEncoding) {
    if (msg === null) {
      throw new TypeError("msg must be a string or Uint8Array.");
    } else if (typeof msg === "string") {
      msg = encode1(msg, inputEncoding);
    }

    for (let i2 = 0; i2 < msg.length; i2++) {
      this._buffer[this._bufferIndex++] = msg[i2];

      if (this._bufferIndex === 128) {
        this.transform();
        this._bufferIndex = 0;
      }
    }

    let c = this._count;

    if ((c[0] += msg.length << 3) < msg.length << 3) {
      c[1]++;
    }

    c[1] += msg.length >>> 29;
    return this;
  }

  digest(outputEncoding) {
    if (this._finalized) {
      throw new Error("digest has already been called.");
    }

    this._finalized = true;
    var b = this._buffer,
        idx = this._bufferIndex;
    b[idx++] = 128;

    while (idx !== 112) {
      if (idx === 128) {
        this.transform();
        idx = 0;
      }

      b[idx++] = 0;
    }

    let c = this._count;
    b[112] = b[113] = b[114] = b[115] = b[116] = b[117] = b[118] = b[119] = 0;
    b[120] = c[1] >>> 24 & 255;
    b[121] = c[1] >>> 16 & 255;
    b[122] = c[1] >>> 8 & 255;
    b[123] = c[1] >>> 0 & 255;
    b[124] = c[0] >>> 24 & 255;
    b[125] = c[0] >>> 16 & 255;
    b[126] = c[0] >>> 8 & 255;
    b[127] = c[0] >>> 0 & 255;
    this.transform();
    let i2,
        hash = new Uint8Array(64);

    for (i2 = 0; i2 < 16; i2++) {
      hash[(i2 << 2) + 0] = this._H[i2] >>> 24 & 255;
      hash[(i2 << 2) + 1] = this._H[i2] >>> 16 & 255;
      hash[(i2 << 2) + 2] = this._H[i2] >>> 8 & 255;
      hash[(i2 << 2) + 3] = this._H[i2] & 255;
    }

    this.init();
    return outputEncoding ? decode1(hash, outputEncoding) : hash;
  }

  transform() {
    let h = this._H,
        h0h = h[0],
        h0l = h[1],
        h1h = h[2],
        h1l = h[3],
        h2h = h[4],
        h2l = h[5],
        h3h = h[6],
        h3l = h[7],
        h4h = h[8],
        h4l = h[9],
        h5h = h[10],
        h5l = h[11],
        h6h = h[12],
        h6l = h[13],
        h7h = h[14],
        h7l = h[15];
    let ah = h0h,
        al = h0l,
        bh = h1h,
        bl = h1l,
        ch = h2h,
        cl = h2l,
        dh = h3h,
        dl = h3l,
        eh = h4h,
        el = h4l,
        fh = h5h,
        fl = h5l,
        gh = h6h,
        gl = h6l,
        hh = h7h,
        hl = h7l;
    let i2,
        w = new Uint32Array(160);

    for (i2 = 0; i2 < 32; i2++) {
      w[i2] = this._buffer[(i2 << 2) + 3] | this._buffer[(i2 << 2) + 2] << 8 | this._buffer[(i2 << 2) + 1] << 16 | this._buffer[i2 << 2] << 24;
    }

    let gamma0xl, gamma0xh, gamma0l, gamma0h, gamma1xl, gamma1xh, gamma1l, gamma1h, wrl, wrh, wr7l, wr7h, wr16l, wr16h;

    for (i2 = 16; i2 < 80; i2++) {
      gamma0xh = w[(i2 - 15) * 2];
      gamma0xl = w[(i2 - 15) * 2 + 1];
      gamma0h = (gamma0xl << 31 | gamma0xh >>> 1) ^ (gamma0xl << 24 | gamma0xh >>> 8) ^ gamma0xh >>> 7;
      gamma0l = (gamma0xh << 31 | gamma0xl >>> 1) ^ (gamma0xh << 24 | gamma0xl >>> 8) ^ (gamma0xh << 25 | gamma0xl >>> 7);
      gamma1xh = w[(i2 - 2) * 2];
      gamma1xl = w[(i2 - 2) * 2 + 1];
      gamma1h = (gamma1xl << 13 | gamma1xh >>> 19) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
      gamma1l = (gamma1xh << 13 | gamma1xl >>> 19) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xh << 26 | gamma1xl >>> 6);
      wr7h = w[(i2 - 7) * 2], wr7l = w[(i2 - 7) * 2 + 1], wr16h = w[(i2 - 16) * 2], wr16l = w[(i2 - 16) * 2 + 1];
      wrl = gamma0l + wr7l;
      wrh = gamma0h + wr7h + (wrl >>> 0 < gamma0l >>> 0 ? 1 : 0);
      wrl += gamma1l;
      wrh += gamma1h + (wrl >>> 0 < gamma1l >>> 0 ? 1 : 0);
      wrl += wr16l;
      wrh += wr16h + (wrl >>> 0 < wr16l >>> 0 ? 1 : 0);
      w[i2 * 2] = wrh;
      w[i2 * 2 + 1] = wrl;
    }

    let chl, chh, majl, majh, sig0l, sig0h, sig1l, sig1h, krl, krh, t1l, t1h, t2l, t2h;

    for (i2 = 0; i2 < 80; i2++) {
      chh = eh & fh ^ ~eh & gh;
      chl = el & fl ^ ~el & gl;
      majh = ah & bh ^ ah & ch ^ bh & ch;
      majl = al & bl ^ al & cl ^ bl & cl;
      sig0h = (al << 4 | ah >>> 28) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
      sig0l = (ah << 4 | al >>> 28) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
      sig1h = (el << 18 | eh >>> 14) ^ (el << 14 | eh >>> 18) ^ (eh << 23 | el >>> 9);
      sig1l = (eh << 18 | el >>> 14) ^ (eh << 14 | el >>> 18) ^ (el << 23 | eh >>> 9);
      krh = this._K[i2 * 2];
      krl = this._K[i2 * 2 + 1];
      t1l = hl + sig1l;
      t1h = hh + sig1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
      t1l += chl;
      t1h += chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
      t1l += krl;
      t1h += krh + (t1l >>> 0 < krl >>> 0 ? 1 : 0);
      t1l = t1l + w[i2 * 2 + 1];
      t1h += w[i2 * 2] + (t1l >>> 0 < w[i2 * 2 + 1] >>> 0 ? 1 : 0);
      t2l = sig0l + majl;
      t2h = sig0h + majh + (t2l >>> 0 < sig0l >>> 0 ? 1 : 0);
      hh = gh;
      hl = gl;
      gh = fh;
      gl = fl;
      fh = eh;
      fl = el;
      el = dl + t1l | 0;
      eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
      dh = ch;
      dl = cl;
      ch = bh;
      cl = bl;
      bh = ah;
      bl = al;
      al = t1l + t2l | 0;
      ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
    }

    h0l = h[1] = h0l + al | 0;
    h[0] = h0h + ah + (h0l >>> 0 < al >>> 0 ? 1 : 0) | 0;
    h1l = h[3] = h1l + bl | 0;
    h[2] = h1h + bh + (h1l >>> 0 < bl >>> 0 ? 1 : 0) | 0;
    h2l = h[5] = h2l + cl | 0;
    h[4] = h2h + ch + (h2l >>> 0 < cl >>> 0 ? 1 : 0) | 0;
    h3l = h[7] = h3l + dl | 0;
    h[6] = h3h + dh + (h3l >>> 0 < dl >>> 0 ? 1 : 0) | 0;
    h4l = h[9] = h4l + el | 0;
    h[8] = h4h + eh + (h4l >>> 0 < el >>> 0 ? 1 : 0) | 0;
    h5l = h[11] = h5l + fl | 0;
    h[10] = h5h + fh + (h5l >>> 0 < fl >>> 0 ? 1 : 0) | 0;
    h6l = h[13] = h6l + gl | 0;
    h[12] = h6h + gh + (h6l >>> 0 < gl >>> 0 ? 1 : 0) | 0;
    h7l = h[15] = h7l + hl | 0;
    h[14] = h7h + hh + (h7l >>> 0 < hl >>> 0 ? 1 : 0) | 0;
  }

}

function sha512(msg, inputEncoding, outputEncoding) {
  return new SHA512().init().update(msg, inputEncoding).digest(outputEncoding);
}

function digest(algorithm, m) {
  if (algorithm === "sha1") {
    return sha1(m);
  } else if (algorithm === "sha256") {
    return sha256(m);
  } else if (algorithm === "sha512") {
    return sha512(m);
  }

  throw "Unsupport hash algorithm";
}

function mgf1(seed, length, hash) {
  let counter = 0n;
  let output = [];

  while (output.length < length) {
    const c = i2osp(counter, 4);
    const h = new Uint8Array(digest(hash, new Uint8Array([...seed, ...c])));
    output = [...output, ...h];
    counter++;
  }

  return new Uint8Array(output.slice(0, length));
}

function eme_oaep_encode(label, m, k, algorithm) {
  const labelHash = new Uint8Array(digest(algorithm, label));
  const ps = new Uint8Array(k - labelHash.length * 2 - 2 - m.length);
  const db = concat(labelHash, ps, [1], m);
  const seed = random_bytes(labelHash.length);
  const dbMask = mgf1(seed, k - labelHash.length - 1, algorithm);
  const maskedDb = xor(db, dbMask);
  const seedMask = mgf1(maskedDb, labelHash.length, algorithm);
  const maskedSeed = xor(seed, seedMask);
  return concat([0], maskedSeed, maskedDb);
}

function eme_oaep_decode(label, c, k, algorithm) {
  const labelHash = new Uint8Array(digest(algorithm, label));
  const maskedSeed = c.slice(1, 1 + labelHash.length);
  const maskedDb = c.slice(1 + labelHash.length);
  const seedMask = mgf1(maskedDb, labelHash.length, algorithm);
  const seed = xor(maskedSeed, seedMask);
  const dbMask = mgf1(seed, k - labelHash.length - 1, algorithm);
  const db = xor(maskedDb, dbMask);
  let ptr = labelHash.length;

  while (ptr < db.length && db[ptr] === 0) ptr++;

  return db.slice(ptr + 1);
}

function rsa_oaep_encrypt(bytes, n, e, m, algorithm) {
  const em = eme_oaep_encode(new Uint8Array(0), m, bytes, algorithm);
  const msg = os2ip(em);
  const c = rsaep(n, e, msg);
  return i2osp(c, bytes);
}

function rsa_oaep_decrypt(key2, c, algorithm) {
  const em = rsadp(key2, os2ip(c));
  const m = eme_oaep_decode(new Uint8Array(0), i2osp(em, key2.length), key2.length, algorithm);
  return m;
}

function emsa_pss_encode(m, emBits, sLen, algorithm) {
  const mHash = digest(algorithm, m);
  const hLen = mHash.length;
  const emLen = Math.ceil(emBits / 8);
  if (emLen < hLen + sLen + 2) throw "Encoding Error";
  const salt = new Uint8Array(sLen);
  crypto.getRandomValues(salt);
  const m1 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, ...mHash, ...salt]);
  const h = digest(algorithm, m1);
  const ps = new Uint8Array(emLen - sLen - hLen - 2);
  const db = new Uint8Array([...ps, 1, ...salt]);
  const dbMask = mgf1(h, emLen - hLen - 1, algorithm);
  const maskedDB = xor(db, dbMask);
  const leftMost = 8 * emLen - emBits;
  maskedDB[0] = maskedDB[0] & 255 >> leftMost;
  return new Uint8Array([...maskedDB, ...h, 188]);
}

function emsa_pss_verify(m, em, emBits, sLen, algorithm) {
  const mHash = digest(algorithm, m);
  const hLen = mHash.length;
  const emLen = Math.ceil(emBits / 8);
  if (emLen < hLen + sLen + 2) return false;
  if (em[em.length - 1] !== 188) return false;
  const maskedDB = em.slice(0, emLen - hLen - 1);
  const h = em.slice(emLen - hLen - 1, emLen - 1);
  const leftMost = 8 * emLen - emBits;
  if (maskedDB[0] >> 8 - leftMost != 0) return false;
  const dbMask = mgf1(h, emLen - hLen - 1, algorithm);
  const db = xor(maskedDB, dbMask);
  db[0] = db[0] & 255 >> leftMost;

  for (let i2 = 1; i2 < emLen - hLen - sLen - 2; i2++) {
    if (db[i2] !== 0) return false;
  }

  if (db[emLen - hLen - sLen - 2] !== 1) return false;
  const salt = db.slice(emLen - hLen - sLen - 1);
  const m1 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, ...mHash, ...salt]);
  const h1 = digest(algorithm, m1);

  for (let i3 = 0; i3 < hLen; i3++) {
    if (h1[i3] !== h[i3]) return false;
  }

  return true;
}

function rsassa_pss_sign(key2, m, algorithm) {
  if (!key2.d) throw "Invalid RSA Key";
  const hLen = digestLength(algorithm);
  let em = emsa_pss_encode(m, key2.length * 8 - 1, hLen, algorithm);
  return new RawBinary(i2osp(rsaep(key2.n, key2.d, os2ip(em)), key2.length));
}

function rsassa_pss_verify(key2, m, signature, algorithm) {
  if (!key2.e) throw "Invalid RSA Key";
  const hLen = digestLength(algorithm);
  const em = i2osp(rsaep(key2.n, key2.e, os2ip(signature)), key2.length);
  return emsa_pss_verify(m, em, key2.length * 8 - 1, hLen, algorithm);
}

function rsa_pkcs1_verify(key2, s, m) {
  if (!key2.e) throw "Invalid RSA key";
  let em = i2osp(rsaep(key2.n, key2.e, os2ip(s)), key2.length);
  if (em[0] !== 0) throw "Decryption error";
  if (em[1] !== 1) throw "Decryption error";
  let psCursor = 2;

  for (; psCursor < em.length; psCursor++) {
    if (em[psCursor] === 0) break;
  }

  if (psCursor < 10) throw "Decryption error";
  em = em.slice(psCursor + 1);
  const ber = ber_simple(ber_decode1(em));
  const decryptedMessage = ber[1];
  if (decryptedMessage.length !== m.length) return false;

  for (let i2 = 0; i2 < decryptedMessage.length; i2++) {
    if (decryptedMessage[i2] !== m[i2]) return false;
  }

  return true;
}

class PureRSA {
  static async encrypt(key, message, options) {
    if (!key.e) throw "Invalid RSA key";

    if (options.padding === "oaep") {
      return new RawBinary(rsa_oaep_encrypt(key.length, key.n, key.e, message, options.hash));
    } else if (options.padding === "pkcs1") {
      return new RawBinary(rsa_pkcs1_encrypt(key.length, key.n, key.e, message));
    }

    throw "Invalid parameters";
  }

  static async decrypt(key, ciper, options) {
    if (!key.d) throw "Invalid RSA key";

    if (options.padding === "oaep") {
      return new RawBinary(rsa_oaep_decrypt(key, ciper, options.hash));
    } else if (options.padding === "pkcs1") {
      return new RawBinary(rsa_pkcs1_decrypt(key, ciper));
    }

    throw "Invalid parameters";
  }

  static async verify(key, signature, message, options) {
    if (!key.e) throw "Invalid RSA key";

    if (options.algorithm === "rsassa-pkcs1-v1_5") {
      return rsa_pkcs1_verify(key, signature, digest(options.hash, message));
    } else {
      return rsassa_pss_verify(key, message, signature, options.hash);
    }
  }

  static async sign(key, message, options) {
    if (!key.d) throw "You need private key to sign the message";

    if (options.algorithm === "rsassa-pkcs1-v1_5") {
      return rsa_pkcs1_sign(key.length, key.n, key.d, digest(options.hash, message), options.hash);
    } else {
      return rsassa_pss_sign(key, message, options.hash);
    }
  }

}

function rsa_import_pem_cert(key2) {
  const trimmedKey = key2.substr(27, key2.length - 53);
  const parseKey = ber_simple(ber_decode2(base64_to_binary(trimmedKey)));
  return {
    length: get_key_size(parseKey[0][5][1][0][0]),
    n: parseKey[0][5][1][0][0],
    e: parseKey[0][5][1][0][1]
  };
}

function rsa_import_pem_private(key2) {
  const trimmedKey = key2.substr(31, key2.length - 61);
  const parseKey = ber_simple(ber_decode2(base64_to_binary(trimmedKey)));
  return {
    n: parseKey[1],
    d: parseKey[3],
    e: parseKey[2],
    p: parseKey[4],
    q: parseKey[5],
    dp: parseKey[6],
    dq: parseKey[7],
    qi: parseKey[8],
    length: get_key_size(parseKey[1])
  };
}

function rsa_import_pem_private_pkcs8(key2) {
  const trimmedKey = key2.substr(27, key2.length - 57);
  const parseWrappedKey = ber_simple(ber_decode2(base64_to_binary(trimmedKey)));
  const parseKey = ber_simple(ber_decode2(parseWrappedKey[2]));
  return {
    n: parseKey[1],
    d: parseKey[3],
    e: parseKey[2],
    p: parseKey[4],
    q: parseKey[5],
    dp: parseKey[6],
    dq: parseKey[7],
    qi: parseKey[8],
    length: get_key_size(parseKey[1])
  };
}

function rsa_import_pem_public(key2) {
  const trimmedKey = key2.substr(26, key2.length - 51);
  const parseKey = ber_simple(ber_decode2(base64_to_binary(trimmedKey)));
  return {
    length: get_key_size(parseKey[1][0][0]),
    n: parseKey[1][0][0],
    e: parseKey[1][0][1]
  };
}

function rsa_import_pem(key2) {
  if (typeof key2 !== "string") throw new TypeError("PEM key must be string");
  const trimmedKey = key2.trim();
  const maps = [["-----BEGIN RSA PRIVATE KEY-----", rsa_import_pem_private], ["-----BEGIN PRIVATE KEY-----", rsa_import_pem_private_pkcs8], ["-----BEGIN PUBLIC KEY-----", rsa_import_pem_public], ["-----BEGIN CERTIFICATE-----", rsa_import_pem_cert]];

  for (const [prefix, func] of maps) {
    if (trimmedKey.indexOf(prefix) === 0) return func(trimmedKey);
  }

  throw new TypeError("Unsupported key format");
}

function rsa_import_key(key2, format) {
  const finalFormat = format === "auto" ? detect_format(key2) : format;
  if (finalFormat === "jwk") return rsa_import_jwk(key2);
  if (finalFormat === "pem") return rsa_import_pem(key2);
  throw new TypeError("Unsupported key format");
}

class RSA {
  constructor(key2) {
    this.key = key2;
  }

  async encrypt(m, options) {
    const computedOption = computeOption(options);
    const func = WebCryptoRSA.isSupported(computedOption) ? WebCryptoRSA.encrypt : PureRSA.encrypt;
    return new RawBinary(await func(this.key, computeMessage(m), computedOption));
  }

  async decrypt(m, options) {
    const computedOption = computeOption(options);
    const func = WebCryptoRSA.isSupported(computedOption) ? WebCryptoRSA.decrypt : PureRSA.decrypt;
    return new RawBinary(await func(this.key, m, computedOption));
  }

  async verify(signature, message, options) {
    const computedOption = {
      algorithm: "rsassa-pkcs1-v1_5",
      hash: "sha256",
      ...options
    };
    return await PureRSA.verify(this.key, signature, computeMessage(message), computedOption);
  }

  async sign(message, options) {
    const computedOption = {
      algorithm: "rsassa-pkcs1-v1_5",
      hash: "sha256",
      ...options
    };
    return await PureRSA.sign(this.key, computeMessage(message), computedOption);
  }

  static parseKey(key, format = "auto") {
    return this.importKey(key, format);
  }

  static importKey(key, format = "auto") {
    return new RSAKey(rsa_import_key(key, format));
  }

}

function initialize(user) {
  const headers = new Headers({
    Accept: 'application/json, text/plain, */*',
    'Accept-Encoding': `gzip, deflate, br`,
    'Accept-Language': `ko-KR,ko;q=0.9`,
    'Cache-Control': `no-cache`,
    Connection: `keep-alive`,
    Pragma: `no-cache`,
    Referer: `https"://hcs.eduro.go.kr/`,
    'sec-ch-ua': `"Google Chrome";v="87", "\"Not;A\\Brand";v="99", "Chromium";v="87"`,
    'sec-ch-ua-mobile': `?0`,
    'Sec-Fetch-Dest': `empty`,
    'Sec-Fetch-Site': `same-origin`,
    'Sec-Fetch-Mode': `cors`,
    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36`,
    'X-Requested-With': `XMLHttpRequest`
  });
  const {
    school,
    area,
    name,
    birthday,
    password
  } = user;
  if (!name || !area || !birthday || !password || !school) throw new SelfcheckError('INVALID_USER');
  let orgCode;
  let baseURL;
  let token;

  async function searchSchool() {
    const params1 = new URLSearchParams({
      schulCrseScCode: String(inferSchoolLevel(school)),
      lctnScCode: String(getAreaCode(normalizeArea(area))),
      orgName: school,
      loginType: 'school'
    });
    const url = `https://hcs.eduro.go.kr/v2/searchSchool?${params1}`;
    const response = await fetch(url, {
      headers
    });
    if (!response.ok) throw new SelfcheckError('CANNOT_FIND_SCHOOL');
    const data = await response.json();
    if (!data || !data.schulList) throw new SelfcheckError('CANNOT_FIND_SCHOOL');
    const schoolItem = data.schulList[0];
    baseURL = normalizeUrl(schoolItem.atptOfcdcConctUrl);
    orgCode = schoolItem.orgCode;
    return orgCode;
  }

  async function findUser() {
    const body = JSON.stringify({
      name: await encrypt(name),
      birthday: await encrypt(birthday.slice(-6)),
      orgCode,
      loginType: 'school'
    });
    headers.set('Sec-Fetch-Site', 'same-site');
    headers.set('Origin', 'https://hcs.eduro.go.kr');
    headers.set('Content-Type', 'application/json;charset=UTF-8');
    const temp = await fetch(new URL('/v2/findUser', baseURL), {
      method: 'POST',
      headers,
      body
    });
    if (!temp.ok) throw new SelfcheckError('CANNOT_FIND_USER');
    const data = await temp.json();
    if (!data.token) throw new SelfcheckError('CANNOT_FIND_USER');
    headers.set('Authorization', data.token);
    const r = await fetch(new URL('/v2/validatePassword', baseURL), {
      method: 'POST',
      body: JSON.stringify({
        deviceUuid: '',
        password: await encrypt(String(password))
      }),
      headers
    });
    token = await r.json();
    if (!r.ok || typeof token !== 'string') throw new Error('PASSWORD_ERROR');
    headers.set('Authorization', token);
    return token;
  }

  async function sendRequest() {
    const body = JSON.stringify({
      rspns01: '1',
      rspns02: '1',
      rspns03: null,
      rspns04: null,
      rspns05: null,
      rspns06: null,
      rspns07: null,
      rspns08: null,
      rspns09: '0',
      rspns10: null,
      rspns11: null,
      rspns12: null,
      rspns13: null,
      rspns14: null,
      rspns15: null,
      rspns00: 'Y',
      deviceUuid: '',
      upperToken: token,
      upperUserNameEncpt: name
    });
    const response = await fetch(new URL('/registerServey', baseURL), {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      throw new SelfcheckError('RESPONSE_ERROR');
    }

    const data = await response.json();
    if (data.registerDtm) return data;else {
      console.error(data.message);
      throw new SelfcheckError('RESPONSE_ERROR');
    }
  }

  return {
    searchSchool,
    sendRequest,
    findUser
  };
}

var _default = async user => {
  const {
    searchSchool,
    sendRequest,
    findUser
  } = initialize(user);

  try {
    await searchSchool();
    await findUser();
    return await sendRequest();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

exports.default = _default;

async function validate(user) {
  const {
    searchSchool,
    findUser
  } = initialize(user);

  try {
    await searchSchool();
    const token = await findUser();
    if (token.length > 1) return true;else return false;
  } catch {
    return false;
  }
}

const publicKey = RSA.parseKey({
  kty: 'RSA',
  e: 'AQAB',
  n: '81dCnCKt0NVH7j5Oh2-SGgEU0aqi5u6sYXemouJWXOlZO3jqDsHYM1qfEjVvCOmeoMNFXYSXdNhflU7mjWP8jWUmkYIQ8o3FGqMzsMTNxr-bAp0cULWu9eYmycjJwWIxxB7vUwvpEUNicgW7v5nCwmF5HS33Hmn7yDzcfjfBs99K5xJEppHG0qc-q3YXxxPpwZNIRFn0Wtxt0Muh1U8avvWyw03uQ_wMBnzhwUC8T4G5NclLEWzOQExbQ4oDlZBv8BM_WxxuOyu0I8bDUDdutJOfREYRZBlazFHvRKNNQQD2qDfjRz484uFs7b5nykjaMB9k_EJAuHjJzGs9MMMWtQ'
});
const rsa = new RSA(publicKey);

async function encrypt(payload) {
  const bin = await rsa.encrypt(String(payload), {
    padding: 'pkcs1',
    hash: 'sha256'
  });
  return bin.base64();
}

function ber_decode(bytes, from, to) {
  return ber_next(bytes);
}

function ber_sequence(bytes, from, length) {
  const end = from + length;
  let res = [];
  let ptr = from;

  while (ptr < end) {
    const next = ber_next(bytes, ptr);
    res.push(next);
    ptr += next.totalLength;
  }

  return res;
}

function ber_next(bytes, from, to) {
  if (!from) from = 0;
  if (!to) to = bytes.length;
  let ptr = from;
  const type = bytes[ptr++];
  let size = bytes[ptr++];

  if ((size & 128) > 0) {
    let ext = size - 128;
    size = 0;

    while (--ext >= 0) {
      size = (size << 8) + bytes[ptr++];
    }
  }

  let value = null;

  if (type === 48) {
    value = ber_sequence(bytes, ptr, size);
  } else if (type === 2) {
    value = ber_integer(bytes, ptr, size);
  } else if (type === 3) {
    value = ber_sequence(bytes, ptr + 1, size - 1);
  } else if (type === 5) {
    value = null;
  } else if (type === 6) {
    value = ber_oid(bytes, ptr, size);
  } else {
    value = ber_unknown(bytes, ptr, size);
  }

  return {
    totalLength: ptr - from + size,
    type,
    length: size,
    value
  };
}

const ber_decode1 = ber_decode;
const ber_decode2 = ber_decode;

