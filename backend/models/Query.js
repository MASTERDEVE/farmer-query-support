import mongoose from "mongoose";
const querySchema = new mongoose.Schema({
  query: String,
  answer: String,
  disease: String,
  timestamp: { type: Date, default: Date.now },
});
export default mongoose.model("Query", querySchema);
