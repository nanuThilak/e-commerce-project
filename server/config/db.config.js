import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectDb = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MONGODB IS CONNECTED ${connectDb.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB