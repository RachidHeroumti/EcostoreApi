import mongoose from "mongoose";

const sectionSchema = mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
  
    images: [{ type: String, required: true }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required:true},
    products: [
      {
          id:{type:String},
          title: { type: String },
          price: { type: String},
          images: [{ type: String }],
          quantity: { type: Number, default: 1 },
      },
    ],
    total :{type: Number, default :0},
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
