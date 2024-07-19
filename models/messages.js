const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
});

MessageSchema.virtual('date_format').get(function () {
  return `${this.date.toLocaleDateString(
    'pl-PL'
  )} / ${this.date.toLocaleTimeString('pl-PL')}`;
});

MessageSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Message', MessageSchema);
