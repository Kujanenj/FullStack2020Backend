import patientData from "../../data/patients.json";
import { v4 as uuidv4 } from 'uuid';
import { Patient, PublicPatient, NewPatient} from "../types";
const formatPatients = (): Patient[] => {

    return patientData.map(({
        id, name, occupation, gender, dateOfBirth, ssn }) =>
        ({ id, name, occupation, gender, dateOfBirth, ssn, entries: [] }));

}

const patients = formatPatients();
const getPatients = (): PublicPatient[] => {
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
const getNonSensitiveEntries = (): PublicPatient[] => {
    return patients.map(({
        id, name, occupation, gender, dateOfBirth }) =>
        ({ id, name, occupation, gender, dateOfBirth }));
};
const getPatient = (id: string): Patient | undefined => {
    const patient = patients.find(patient => patient.id === id)
    return patient

}
export default {
    getPatients,
    getPatient,
    addPatient,
    getNonSensitiveEntries
};