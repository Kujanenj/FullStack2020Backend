import patientData from "../../data/patients.json";
import { v4 as uuidv4 } from 'uuid';
import { Patient, NonSensetivePatient, NewPatient } from "../types";
const patients = patientData;
const getPatients = (): NonSensetivePatient[] => {
    return patients;
};
const addPatient = (patient: NewPatient): Patient => {


    const newPatient = {
        id: uuidv4(),
        ...patient
    }

    patients.push(newPatient);
    return newPatient;
};
const getNonSensitiveEntries = (): NonSensetivePatient[] => {
    return patients.map(({
        id, name, occupation, gender, dateOfBirth }) =>
        ({ id, name, occupation, gender, dateOfBirth }));
};
export default {
    getPatients,
    addPatient,
    getNonSensitiveEntries
};