import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), (req, res) => {
  const { originalname } = req.file;
  if (originalname.includes("wheat")) {
    res.json({ disease: "Wheat Rust", solution: "Use fungicide XYZ" });
  } else if (originalname.includes("rice")) {
    res.json({ disease: "Rice Leaf Blight", solution: "Spray ABC solution" });
  } else {
    res.json({ disease: "Unknown", solution: "Forward to expert" });
  }
});

export default router;
