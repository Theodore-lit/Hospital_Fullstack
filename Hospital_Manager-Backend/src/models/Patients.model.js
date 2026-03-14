import mongoose from "mongoose";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 4 },
    lastName: { type: String, required: true, trim: true, minlength: 4 },
    gender: { type: String, required: true, trim: true, enum: ["M", "F"]},
    phone: { type: Number, required: true, trim: true, minlength: 8},
    bloodGroup: { type: String, required: true, trim: true},
    status: { type: String, required: true, trim: true},
    roomId: { type: Number, default: null},
    doctorId: { type: Number, default: null},
    aptDate: { type: Date, default: null},
    needRoom: { type: Boolean, default: false},
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);