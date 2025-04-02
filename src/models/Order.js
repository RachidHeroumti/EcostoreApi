import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const connection = mongoose.connection; 

const OrderSchema = new mongoose.Schema(
  {
    order_num: { type: Number, unique: true },
    fullname: { type: String, required: true, maxLength: 100 },
    email: { type: String, maxLength: 100 },
    address: { type: String, required: true, maxLength: 100 },
    city: { type: String, required: true, maxLength: 100 },
    phon: { type: String, required: true, maxLength: 100 },
    country: { type: String, default: "Morocco", maxLength: 100 },
    products: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: String, required: true },
        images: [{ type: String, required: true }],
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"],
      required: true,
      default: "pending",
    },
    offer: {
      type: { type: String, default: "normal" },
      rate: { type: Number, min: 0, max: 100, default: 0 },
    },
    toshipp: {
      type:Boolean,default:false
    }
  },
  { timestamps: true }
);


OrderSchema.plugin(AutoIncrement(connection), { inc_field: "order_num" });

export default mongoose.model("Order", OrderSchema);
