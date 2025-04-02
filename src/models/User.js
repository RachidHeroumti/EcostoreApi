import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const UserSchema = mongoose.Schema(
  {
    firstname: { type: String, required: true, maxLength: 50 },
    lastname: { type: String, required: true, maxLength: 50 },
    email: { type: String, required: true, unique: true, maxLength: 100 },
    password: { type: String, required: true, minLength: 6 },
    isActive: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["ceo", "admin", "callcenter", "user"],
      default: "user",
    },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);


UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password) ;
   }

   UserSchema.pre("save", async function (next) {
     if (!this.isModified) {
       next();
     }
   
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password, salt);
   });

export default mongoose.model("User", UserSchema);
