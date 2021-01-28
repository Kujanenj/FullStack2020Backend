
import { v4 as uuidv4 } from 'uuid';
import { NewPatient, Gender,  BaseEntry, Diagnose, Entry,   HealthCheckRating } from './types';
const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
}
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error("Bad name")
  }
  return name
}
const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};
const parseGender = (gender: string): string => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
}
const isDiagnoseCode = (object: any): Boolean => {
  return (isString(object))

}
const parseDiagnosisCodes = (diagnosis: any): Array<Diagnose['code']> => {
  if (!diagnosis) {
    throw new Error('Something wrong with entries')
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  diagnosis.forEach((diagnose: any) => {
    if (!isDiagnoseCode(diagnose)) {
      throw new Error('Something wrong with entries')
    }
  });
  return diagnosis
}
const parseHealthCheckRating = (object: any): HealthCheckRating => {
  if (!Object.values(HealthCheckRating).includes(object)) {
    throw new Error("Error in health rating?")
  }
  return object
}
const createEntry = (object: any): Entry => {
  const partialEntry: BaseEntry = {
    id: uuidv4(),
    description: parseName(object.description),
    date: parseDate(object.date),
    specialist: parseName(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
  }

  switch (object.type) {

    case "OccupationalHealthcare":
      return {
        ...partialEntry, type: object.type,
        employerName: parseName(object.employerName)
      }

    case "Hospital":
      return {
        ...partialEntry, type: object.type,
        discharge: {
          date: parseDate(object?.discharge?.date),
          criteria: parseName(object?.discharge?.criteria)
        }
      }
    case "HealthCheck":
      return {
        ...partialEntry, type: object.type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      }
    default:
      throw new Error('Wrong type')
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
const toNewPatient = (object: any): NewPatient => {

  return {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    gender: parseGender(object.gender),
    occupation: parseName(object.occupation),
    ssn: parseName(object.ssn),
    entries: []
  };
}

export {
  toNewPatient,
  createEntry
}

