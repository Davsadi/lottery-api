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
    checked: {
        type: Boolean,
        default: false
    },
    matchedNumbers: [Number],
    lottery: {
        type: Schema.Types.ObjectId,
        ref: 'Lottery'
    }
});

module.exports = mongoose.model('MyNumbers', MyNumbersSchema);
