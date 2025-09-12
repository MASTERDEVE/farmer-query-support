import mongoose from "mongoose";
const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});
export default mongoose.model("Faq", faqSchema);
