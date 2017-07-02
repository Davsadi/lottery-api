'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lottery = require('./lottery');

var _lottery2 = _interopRequireDefault(_lottery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var MyNumbersSchema = new Schema({
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
    checkedYet: {
        type: Boolean,
        default: false
    },
    matchedNumbers: [],
    matchedBonus: {
        type: Boolean,
        default: false
    },
    lottery: {
        type: Schema.Types.ObjectId,
        ref: 'Lottery'
    }
});

module.exports = _mongoose2.default.model('MyNumbers', MyNumbersSchema);
//# sourceMappingURL=mynumbers.js.map