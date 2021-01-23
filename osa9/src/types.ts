
export interface Entry {
}
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
    name: string,
    ssn: string,
    entries: Entry[]
}
export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >
export type NonSensetivePatient = Omit<Patient,'ssn'>;
export type NewPatient = Omit<Patient, 'id'>;
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}