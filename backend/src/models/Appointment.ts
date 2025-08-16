import mongoose, { Schema, Document } from "mongoose";

export interface SelectedService {
  serviceId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity?: number;
}

export interface UserDetails {
  name: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
}

export interface PaymentVerification {
  status: "pending" | "verified" | "failed";
  verifiedAt?: Date | null;
  notes?: string;
}

export interface AppointmentDocument extends Document {
  bookingId: string;
  refNumber?: string | null;
  timeSlot: {
    date: string;
    time: string;
  };
  selectedServices: SelectedService[];
  amount: number;
  userDetails: UserDetails;
  paymentVerification: PaymentVerification;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<AppointmentDocument>(
  {
    bookingId: { type: String, required: true, unique: true },
    refNumber: { type: String, default: null }, // initially null

    timeSlot: {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },

    selectedServices: [
      {
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],

    amount: { type: Number, required: true },

    userDetails: {
      name: { type: String, required: true },
      passportNumber: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },

    paymentVerification: {
      status: {
        type: String,
        enum: ["pending", "verified", "failed"],
        default: "pending",
      },
      verifiedAt: { type: Date, default: null },
      notes: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<AppointmentDocument>(
  "Appointment",
  AppointmentSchema
);
