
export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose['code']>;
}
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare',
  sickLeave?: {
    startDate : string,
    endDate : string
  },
  employerName: string
}
export interface HospitalEntry extends BaseEntry {
  type: 'Hospital',
  discharge : {
    date: string,
    criteria: string
  }
}
interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}



export interface Diagnose {
  code: string,
  name: string,
  latin?: string
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
export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>
export type NonSensetivePatient = Omit<Patient, 'ssn'>;
export type NewPatient = Omit<Patient, 'id'>;
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}