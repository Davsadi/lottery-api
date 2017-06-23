import mongoose from 'mongoose';
import Lottery from './lottery';
let Schema = mongoose.Schema;

let MyNumbersSchema = new Schema({
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
    matchedBonus: { type: Boolean },
    lottery: {
        type: Schema.Types.ObjectId,
        ref: 'Lottery'
    }
});

module.exports = mongoose.model('MyNumbers', MyNumbersSchema);
