import patientData from "../../data/patients.json";
import { NonSensetivePatient } from "../types";
const patients = patientData;
const getPatients = (): NonSensetivePatient[] => {
    return patients;
};
const addPatient = () => {
    return null;
};
const getNonSensitiveEntries = (): NonSensetivePatient [] => {
    return patients.map(({
        id, name, occupation, gender, dateOfBirth }) =>
        ({ id, name, occupation, gender, dateOfBirth }));
};
export default {
    getPatients,
    addPatient,
    getNonSensitiveEntries
};