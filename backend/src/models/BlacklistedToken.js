import mongoose from 'mongoose';

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

export default BlacklistedToken;
