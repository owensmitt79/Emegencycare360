import mongoose from 'mongoose';

const emergencyRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emergency_type: { type: String, required: true },
  priority: { type: String, default: 'medium' },
  address: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  contact_phone: String,
  symptoms_description: String,
  assigned_responder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Responder',
    default: null
  },
  assigned_ambulance_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    default: null
  }
}, { timestamps: true });

export const EmergencyRequest = mongoose.model('EmergencyRequest', emergencyRequestSchema);
