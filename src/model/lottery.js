import mongoose from 'mongoose';
import MyNumbers from './mynumbers';
let Schema = mongoose.Schema;

let LotterySchema = new Schema({
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
    myNumbers: [{ type: Schema.Types.ObjectId, ref: 'MyNumbers'}]
});

module.exports = mongoose.model('Lottery', LotterySchema);
