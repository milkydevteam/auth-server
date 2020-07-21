"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
    _id: String,
    sequence: { type: Number, default: 0 },
}, {
    _id: false,
    versionKey: false,
});
// eslint-disable-next-line func-names
counterSchema.statics.incrementCount = function (counter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const model = yield this.findOne({ _id: counter });
            if (!model) {
                const data = yield this.create({ _id: counter, sequence: 1 });
                yield data.save();
                return 1;
            }
            const id = Number.parseInt(model.sequence, 10) + 1;
            model.sequence = id;
            yield model.save();
            return id;
        }
        catch (error) {
            throw error.message;
        }
    });
};
const counter = mongoose.model('Counter', counterSchema);
exports.default = counter;
//# sourceMappingURL=counter.js.map