import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ApiKey: { type: String, required: true },
    Idkey: { type: String, required: true },
    isdefault: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Shipping", ShippingSchema);
