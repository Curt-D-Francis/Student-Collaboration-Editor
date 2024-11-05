
const mongo = require('mongoose');

const Schema = mongo.Schema;

const documentSchema = new Schema({
  title: String,
  content: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, // reference to a User document
  collaborators: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      permission: {type: String,
                   enum: ['view', 'edit', 'comment'],
                   default: 'view'
      }
    }
  ],
},{timestamps:true});

documentSchema.index({ owner: 1 });
documentSchema.index({ 'collaborators.userId': 1 });

const Document = mongo.model('Document', documentSchema);

module.exports = Document;

