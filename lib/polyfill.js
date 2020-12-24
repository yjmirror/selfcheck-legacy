if (!global.fetch) {
  global.fetch = require('node-fetch');
  global.Headers = fetch.Headers;
}
if (!global.atob) {
  global.btoa = function btoa(b) {
    return Buffer.from(b, 'binary').toString('base64');
  };
  global.atob = function atob(a) {
    return Buffer.from(a, 'base64').toString('binary');
  };
}
if (!global.crypto) {
  const nodeCrypto = require('crypto');
  global.crypto = {
    getRandomValues: nodeCrypto.randomFillSync,
  };
}

if (!global.window) {
  global.window = global;
}
