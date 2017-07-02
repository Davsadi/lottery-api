'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _lottery = require('../model/lottery');

var _lottery2 = _interopRequireDefault(_lottery);

var _mynumbers = require('../model/mynumbers');

var _mynumbers2 = _interopRequireDefault(_mynumbers);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    api.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
        return next();
    });

    // CRUD - Create Read Update Delete


    // '/v1/lottery/add' - Create
    api.post('/add', _authMiddleware.authenticate, function (req, res) {
        var newLottery = new _lottery2.default();
        newLottery.gameType = req.body.gameType;
        newLottery.drawDate = req.body.drawDate;
        newLottery.standardNumbers = req.body.standardNumbers;
        newLottery.bonusNumber = req.body.bonusNumber;
        newLottery.save(function (err) {
            if (err) {
                res.send(err);
            }
            //res.json({ message: "Lottery saved successfully" });
            res.json(newLottery.id);
        });
    });

    // '/v1/lottery/' - Read
    //Get all lotteries
    api.get('/', function (req, res) {
        _lottery2.default.find({}, function (err, lotterys) {
            if (err) {
                res.send(err);
            }
            //res.header("Access-Control-Allow-Origin", "*");
            //res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
            //res.header("Access-Control-Allow-Methods", "POST, GET");
            res.json(lotterys);
        });
    });

    // '/v1/lottery/latest' - Read
    //Get latest lottery numbers
    api.get('/latest', function (req, res) {
        _lottery2.default.find({}.sort({ "drawDate": -1 }), function (err, lotterys) {
            if (err) {
                res.send(err);
            }
            //res.header("Access-Control-Allow-Origin", "*");
            //res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
            //res.header("Access-Control-Allow-Methods", "POST, GET");
            res.json(lotterys);
        });
    });

    // '/v1/lottery/mynumbers' - Read
    //Get all my numbers
    api.get('/mynumbers/', function (req, res) {
        _mynumbers2.default.find({}, function (err, mynumbers) {
            if (err) {
                res.send(err);
            }
            res.json(mynumbers);
        });
    });

    // '/v1/lottery/:id' - Read
    //Get one lottery
    api.get('/:id', function (req, res) {
        _lottery2.default.findById(req.params.id, function (err, lottery) {
            if (err) {
                res.send(err);
            }
            res.json(lottery);
        });
    });

    // '/v1/lottery/:id' - Update
    api.put('/:id', _authMiddleware.authenticate, function (req, res) {
        _lottery2.default.findById(req.params.id, function (err, lottery) {
            if (err) {
                res.send(err);
            }
            lottery.gameType = req.body.gameType;
            lottery.drawDate = req.body.drawDate;
            lottery.standardNumbers = req.body.standardNumbers;
            lottery.bonusNumber = req.body.bonusNumber;
            lottery.myNumbers.push(req.body.myNumbers);
            lottery.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Lottery updated successfully" });
            });
        });
    });

    // '/v1/lottery/:id' - Delete
    api.delete('/:id', _authMiddleware.authenticate, function (req, res) {
        _lottery2.default.findById(req.params.id, function (err, lottery) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (lottery === null) {
                res.status(404).send("Lottery not found");
                return;
            }
            _lottery2.default.remove({
                _id: req.params.id
            }, function (err, lottery) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                _mynumbers2.default.remove({
                    lottery: req.params.id
                }, function (err, mynumbers) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: "Lottery successfully removed!" });
                });
            });
        });
    });

    // '/v1/lottery/mynumbers/add' - Create
    api.post('/mynumbers/add', _authMiddleware.authenticate, function (req, res) {
        var newMyNumbers = new _mynumbers2.default();

        newMyNumbers.gameType = req.body.gameType;
        newMyNumbers.drawDate = req.body.drawDate;
        newMyNumbers.standardNumbers = req.body.standardNumbers;
        newMyNumbers.bonusNumber = req.body.bonusNumber;

        //console.log(req.body);

        newMyNumbers.save(function (err, mynumbers) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            //console.log(res.sendStatus());
            res.json({ message: "My Numbers saved successfully" });
        });
    });

    // Update mynumbers to tie to specific lottery (once winning numbers are scraped)
    // '/v1/lottery/mynumbers/:id'
    api.put('/mynumbers/:id', _authMiddleware.authenticate, function (req, res) {
        _mynumbers2.default.findById(req.params.id, function (err, mynumbers) {
            if (err) {
                res.send(err);
            }
            mynumbers.gameType = req.body.gameType;
            mynumbers.drawDate = req.body.drawDate;
            mynumbers.standardNumbers = req.body.standardNumbers;
            mynumbers.bonusNumber = req.body.bonusNumber;
            if (req.body.matchedNumbers !== undefined) {
                mynumbers.matchedNumbers.push(req.body.matchedNumbers);
            }
            mynumbers.matchedBonus = req.body.matchedBonus;
            mynumbers.checkedYet = req.body.checkedYet;
            mynumbers.lottery = req.body.lottery;

            mynumbers.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "My Numbers updated successfully" });
            });
        });
    });

    // Get all mynumbers for a specific lottery ID
    // '/v1/lottery/mynumbers/:id'
    api.get('/mynumbers/:id', function (req, res) {
        _mynumbers2.default.find({ lottery: req.params.id }, function (err, mynumbers) {
            if (err) {
                res.send(err);
            }
            res.json(mynumbers);
        });
    });

    return api;
};
//# sourceMappingURL=lottery.js.map