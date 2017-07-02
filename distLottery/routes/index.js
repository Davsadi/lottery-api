'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _lottery = require('../controller/lottery');

var _lottery2 = _interopRequireDefault(_lottery);

var _account = require('../controller/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

//Allow all requests from all domains & localhost
/*router.all('/*', function(req, res, next) {
  router.header("Access-Control-Allow-Origin", "*");
  router.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  router.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});*/

// connect to db
(0, _db2.default)(function (db) {

    // internal middleware
    router.use((0, _middleware2.default)({ config: _config2.default, db: db }));

    // api routes v1 (/v1)
    router.use('/lottery', (0, _lottery2.default)({ config: _config2.default, db: db }));
    router.use('/account', (0, _account2.default)({ config: _config2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map