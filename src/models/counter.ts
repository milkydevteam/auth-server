const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    _id: String,
    sequence: { type: Number, default: 0 },
  },
  {
    _id: false,
    versionKey: false,
  },
);

// eslint-disable-next-line func-names
counterSchema.statics.incrementCount = async function(counter) {
  try {
    const model = await this.findOne({ _id: counter });
    if (!model) {
      const data = await this.create({ _id: counter, sequence: 1 });
      await data.save();
      return 1;
    }
    const id = Number.parseInt(model.sequence, 10) + 1;
    model.sequence = id;
    await model.save();
    return id;
  } catch (error) {
    throw error.message;
  }
};

const counter = mongoose.model('Counter', counterSchema);

export default counter;
