'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mynumbers = require('./mynumbers');

var _mynumbers2 = _interopRequireDefault(_mynumbers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var LotterySchema = new Schema({
    gameType: {
        type: String,
        required: true
    },
    drawDate: {
        type: Date,
        required: true
    },
    standardNumbers: {
        type: [Number],
        required: true
    },
    bonusNumber: {
        type: Number,
        required: true
    },
    myNumbers: [{ type: Schema.Types.ObjectId, ref: 'MyNumbers' }]
});

module.exports = _mongoose2.default.model('Lottery', LotterySchema);
//# sourceMappingURL=lottery.js.map