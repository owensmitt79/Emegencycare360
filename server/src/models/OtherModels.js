import mongoose from 'mongoose';

// Ensure virtuals (like id) are included when converting to JSON
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.__v;
  }
});

// We can put all the minor models here for now to speed up the migration
const responderSchema = new mongoose.Schema({
  employee_id: String,
  certification_number: String,
  status: { type: String, default: 'available' },
  rating: { type: Number, default: 0 },
  total_responses: { type: Number, default: 0 },
  current_latitude: Number,
  current_longitude: Number,
  base_location_id: Object
}, { timestamps: true });
export const Responder = mongoose.model('Responder', responderSchema);

const ambulanceSchema = new mongoose.Schema({
  vehicle_number: String,
  type: String,
  status: { type: String, default: 'available' },
  fuel_level: Number,
  current_latitude: Number,
  current_longitude: Number
}, { timestamps: true });
export const Ambulance = mongoose.model('Ambulance', ambulanceSchema);

const partnerHospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  emergency_phone: String,
  capacity_status: String,
  latitude: Number,
  longitude: Number
}, { timestamps: true });
export const PartnerHospital = mongoose.model('PartnerHospital', partnerHospitalSchema);

const consultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  status: { type: String, default: 'Pending' },
  consultationDate: Date,
}, { timestamps: true });
export const Consultation = mongoose.model('Consultation', consultationSchema);

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  sender: String,
  senderName: String,
  text: String,
}, { timestamps: true });
export const Message = mongoose.model('Message', messageSchema);
