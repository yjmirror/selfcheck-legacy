require('./polyfill');

const { default: selfcheck, validate, SelfcheckError } = require('./selfcheck');

exports.default = exports.hcs = exports.selfcheck = selfcheck;
exports.validate = validate;
exports.SelfcheckError = SelfcheckError;
