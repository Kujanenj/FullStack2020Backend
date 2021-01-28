import { v4 as uuidv4 } from 'uuid';
import { Patient, PublicPatient, NewPatient, Entry} from "../types";
import { patients } from '../../data/patients';

const addEntry = (entry : Entry,patient:Patient):Patient=>{
    patient.entries.push(entry)
    return patient
}

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
    return patients.find(patient => patient.id === id)

}
export default {
    getPatients,
    getPatient,
    addPatient,
    getNonSensitiveEntries,
    addEntry
};