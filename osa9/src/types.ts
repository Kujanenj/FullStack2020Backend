export interface Diagnose {
    code : string,
    name : string,
    latin? : string
}
export interface Patient {
    id: string,
    dateOfBirth: string,
    gender: string,
    occupation: string,
    ssn: string
}
export type NonSensetivePatient = Omit<Patient,'ssn'>;