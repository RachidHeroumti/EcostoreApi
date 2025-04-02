import mongoose from "mongoose";

let instanceDb = null;

const connectDB = async () => {
  if (!instanceDb) {
    try {
      instanceDb = await mongoose.connect(process.env.URL_DB);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1); 
    }
  }

  return instanceDb;
};


export default connectDB;
