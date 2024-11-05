
const mongo = require('mongoose');

const Schema = mongoose.Schema;

const documentSchema = new Schema({
  title: String,
  content: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, // reference to a User document
  collaborators: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      permission: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
});

const Document = mongo.model('Document', documentSchema);

