import express from "express";
import patientService from "../services/patients";
const router = express.Router();
router.get("/", (_req, res)  => {
  let test = patientService.getNonSensitiveEntries()
  res.send(test);
});
export default router;


