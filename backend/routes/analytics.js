import express from "express";
import Query from "../models/Query.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Query.aggregate([
    { $group: { _id: "$disease", count: { $sum: 1 } } },
  ]);
  res.json(data);
});

export default router;
