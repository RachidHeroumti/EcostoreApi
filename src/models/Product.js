import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: String }], 
    images: [{ type: String, required: true }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brands: [{ type: String }],
    reviews: [
      {
        review: { type: String },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    offers: [{
      price: { type: Number, min: 0 },
      rate: { type: Number, min: 0, max: 100 },
      time: { type: Number },
      title: { type: String },
    }],
    publish: { type: Boolean, default: true },
    details:{type:String}
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
