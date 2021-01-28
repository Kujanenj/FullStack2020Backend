import express from "express";
import patientService from "../services/patients";
import {createEntry,toNewPatient} from "../utils"
const router = express.Router();
router.get("/", (_req, res) => {
  let test = patientService.getNonSensitiveEntries()
  res.send(test);
})
router.post('/:id/entries',(req,res)=>{
  const patient = patientService.getPatient(req.params.id)
  if(!patient) throw new Error('No patient')
  const newEntry = createEntry(req.body)
  res.send(patientService.addEntry(newEntry,patient))
})
router.post('/', (req, res) => {

  const newPatient = toNewPatient(req.body)
  const addedPatient = patientService.addPatient(
    newPatient
  );
  res.json(addedPatient);
});
export default router;
router.get('/:id',(req,res)=>{

  res.send(patientService.getPatient(req.params.id))
})
