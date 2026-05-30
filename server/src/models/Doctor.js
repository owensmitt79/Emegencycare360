import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  availableForChat: { type: Boolean, default: false },
  availableForVoiceCalls: { type: Boolean, default: false },
  availableForVideoCalls: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalConsultations: { type: Number, default: 0 },
  yearsOfExperience: { type: Number, default: 0 },
  hospitalName: String,
  consultationFee: { type: Number, default: 0 },
  bio: String,
  profilePictureUrl: String,
}, { timestamps: true });

export const Doctor = mongoose.model('Doctor', doctorSchema);
