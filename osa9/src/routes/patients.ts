import express from "express";
import patientService from "../services/patients";
import toNewPatient from "../utils"
const router = express.Router();
router.get("/", (_req, res) => {
  let test = patientService.getNonSensitiveEntries()
  res.send(test);
})
router.post('/', (req, res) => {

  const newPatient = toNewPatient(req.body)
  const addedPatient = patientService.addPatient(
    newPatient
  );
  res.json(addedPatient);
});
export default router;


