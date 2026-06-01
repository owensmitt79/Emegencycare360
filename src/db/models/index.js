import { User } from './User.js';
import { Doctor } from './Doctor.js';
import { EmergencyRequest } from './EmergencyRequest.js';
import { Responder, Ambulance, PartnerHospital, Consultation, Message } from './OtherModels.js';
import { AuditLog } from './AuditLog.js';

export async function initModels() {
  return {
    User,
    Doctor,
    EmergencyRequest,
    Responder,
    Ambulance,
    PartnerHospital,
    Consultation,
    Message,
    AuditLog,
  };
}

export {
  User,
  Doctor,
  EmergencyRequest,
  Responder,
  Ambulance,
  PartnerHospital,
  Consultation,
  Message,
  AuditLog,
};
