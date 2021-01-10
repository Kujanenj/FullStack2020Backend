
import { NewPatient, Gender} from './types';
const isString = (text:any):text is string =>{
    return typeof text === 'string' || text instanceof String;
}
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
const parseName =(name: any):  string =>{
    if(!name || !isString(name)){
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
const parseGender = (gender:string):string =>{
    if (!gender || !isGender(gender)) {
              throw new Error('Incorrect or missing gender: ' + gender);
}
return gender;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
const toNewPatient = (object:any): NewPatient => {

  return {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender : parseGender(object.gender),
      occupation: parseName(object.occupation),
      ssn: parseName(object.ssn)

  };
}

export default toNewPatient;

