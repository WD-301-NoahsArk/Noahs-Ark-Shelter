import { Collection, MongoClient, type WithId, type Document } from 'mongodb'
import "dotenv/config"

const mongoUserName = process.env.USR_MONGO
const mongoUserPWD = process.env.PWD_MONGO
const mongoUri = `mongodb+srv://${mongoUserName}:${mongoUserPWD}@noahsarktest.znrgw.mongodb.net/`
const client = new MongoClient(mongoUri, { monitorCommands: true });
const dbName = 'Noahs_Ark'
const db = client.db(dbName);


export type queryFunc = (col: Collection) => Promise<WithId<Document>[]>

/* Connect to db to query 
 * pass a function type queryFunc for callback
 */
//export async function connDB(func: queryFunc): Promise<WithId<Document>[]> {
//  try {
//    await client.connect()
//    console.log('Connected successfully to server');
//    const db = client.db(dbName)
//    const collection = db.collection('users');
//    const res = func(collection)
//    return res
//  } catch (error) {
//    console.error('Error connecting to db or executing query', error);
//    throw error
//  }
//}

export const collections = {
  staff: db.collection('staff_col'),
  animals: db.collection('animal_col'),
  adoptees: db.collection('adoptee_col'),
  events: db.collection('event_col'),
};

// Date
type DateString = `${number}-${number}-${number}`;
export function isValidDate(date: DateString): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  // Ensures they insert real/valid dates
  const [year, month, day] = date.split("-").map(Number);
  const dt = new Date(year, month - 1, day);
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
}

// Password should be >=8
type Password = string & { __type: "Password" };
export function isValidPassword(password: string): password is Password {
  return password.length >= 8;
}

// 0000-000-0000 FORMAT
type PhoneNumber = `${number}-${number}-${number}`;
export function isValidPhone(phone: string): phone is PhoneNumber {
  return /^\d{4}-\d{3}-\d{4}$/.test(phone);
}

// Date with Time 
type DateTimeString = `${number}-${number}-${number} ${number}:${number}`;
export function isValidDateTime(dateTime: DateTimeString): boolean {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  if (!regex.test(dateTime)) return false;

  const [datePart, timePart] = dateTime.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const dt = new Date(year, month - 1, day, hour, minute);
  return (
    dt.getFullYear() === year &&
    dt.getMonth() === month - 1 &&
    dt.getDate() === day &&
    dt.getHours() === hour &&
    dt.getMinutes() === minute
  );
}



/**
 * Preprocesses and validates staff data before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Staff | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const staffInfo = {
 *   first_name: " John ",
 *   last_name: " Doe ",
 *   user_name: "JohnDoe",
 *   email: "JohnDoe@example.com",
 *   phone: "0912-345-6789,
 *   password: "securepassword",
 *   birthdate: "1990-12-25",
 * };
 *
 * const staffMember = preprocessStaff(staffInfo);
 * if (staffMember) {
 *   console.log("Valid staff member:", staffMember);
 * } else {
 *   console.error("Invalid staff data, insertion blocked.");
 * }
 */

export type Staff = {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  phone: PhoneNumber;
  password: Password;
  birthdate: DateString;
  role: "admin" | "staff";
};

type ValidationError = {
  field: string;
  message: string;
}

export function preprocessStaff(data: Staff): [Staff | null, ValidationError | null] {
  const requiredFields: (keyof Staff)[] = ['first_name', 'last_name', 'user_name', 'email', 'phone', 'password', 'birthdate', 'role'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return [null, {
        field,
        message: `${field} is required`
      }];
    }
  }

  if (!isValidDate(data.birthdate)) {
    return [null, {
      field: 'birthdate',
      message: 'Invalid date format. Use YYYY-MM-DD format'
    }];
  }

  if (!isValidPhone(data.phone)) {
    return [null, {
      field: 'phone',
      message: 'Invalid phone number format. Use XXXX-XXX-XXXX format'
    }];
  }

  if (!isValidPassword(data.password)) {
    return [null, {
      field: 'password',
      message: 'Password must be at least 8 characters long'
    }];
  }

  if (data.role !== "admin" && data.role !== "staff") {
    return [null, {
      field: 'role',
      message: 'Invalid role. Must be either "admin" or "staff"'
    }];
  }

  return [{
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    user_name: data.user_name.toLowerCase().trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone as PhoneNumber,
    password: data.password as Password,
    birthdate: data.birthdate as DateString,
    role: data.role
  }, null];
}

/**
 * Preprocesses and validates Animals Information before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Animal | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const animalInfo = {
 *   name: "Amber",
 *   rescue_date: "1999-01-01", // YYYY-MM-DD FORMAT
 *   personality: ["Energetic", "Chaotic"],
 *   breed: "Aspin",
 *   code: "1ed0e640sg",
 *   status: "Ok",
 *   animal_pic: "path/to/picture", 
 * };
 *
 * const animalData = preprocessAnimal(animalInfo);
 * if (animalData) {
 *   console.log("Valid Animal Information:", animalData);
 * } else {
 *   console.error("Invalid Animal Information, insertion blocked.");
 * }
 */

export type Animal = {
  name: string,
  rescue_date: DateString,
  personality: string,
  breed: string,
  status: boolean,
  code: string,
  animal_pic: string
}

export function preprocessAnimal(data: Animal): [Animal | null, ValidationError | null] {
  const requiredFields: (keyof Animal) [] = ['name', 'rescue_date', 'personality','breed', 'status', 'code', 'animal_pic'];
  for (const field of requiredFields) {
    if(!data[field]) {
      return [null, {
        field,
        message: `${field} is required`
      }];
    }
  }

  if (!isValidDate(data.rescue_date)) {
    return [null, {
      field: 'rescue_date',
      message: 'Invalid Rescue Date format. Please use YYYY-MM-DD'
    }];
  }

  return[{
    name: data.name.trim(),
    rescue_date: data.rescue_date as DateString,
    personality: data.personality.trim(),
    breed: data.breed.trim(),
    status: data.status,
    code: data.code.trim(),
    animal_pic: data.animal_pic.trim()
  }, null];
}


/**
 * Preprocesses and validates Adoptee Information before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Adoptee | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const adopteeInfo = {
 *   first_name: "Maria",
 *   last_name: "Estrada", 
 *   email: "mariaest@example.com",
 *   phone: "0912-345-6789",
 *   animal_code: "1ed0e640sg",
 *   date_avail: "2025-04-18" // YYYY-MM-DD HH:MM FORMAT
 * };
 *
 * const adopteeData = preprocessAdoptee(adopteeInfo);
 * if (adopteeData) {
 *   console.log("Valid Adoptee Information:", adopteeData);
 * } else {
 *   console.error("Invalid Adoptee Information, insertion blocked.");
 * }
 */

export type Adoptee = {
  first_name: string,
  last_name: string,
  user_name: string,
  email: string,
  phone: PhoneNumber,
  animal_code: string,
  date_avail: DateTimeString
}

export function preprocessAdoptee(data: Adoptee): [Adoptee | null, ValidationError | null ] {
  const requiredFields: (keyof Adoptee)[] = ['first_name', 'last_name', 'user_name', 'email', 'phone', 'animal_code', 'date_avail'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return [null, {
        field,
        message: `${field} is required`
      }];
    }
  }

  if (!isValidDateTime(data.date_avail)) {
    return [null, {
      field: 'date_avail',
      message: 'Invalid date format. Please use YYYY-MM-DD HH:MM'
    }];
  }

  if (!isValidPhone(data.phone)) {
    return [null, {
      field: 'phone',
      message: 'Invalid phone number format. Use XXXX-XXX-XXXX format'
    }];
  }

  return [{
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    user_name: data.user_name.toLowerCase().trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone as PhoneNumber,
    animal_code: data.animal_code.trim(),
    date_avail: data.date_avail as DateTimeString
  }, null];
}

/**
 * Preprocesses and validates Event Information before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Event | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const eventInfo = {
 *   title: "Fun Run",
 *   details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", 
 *   thumbnail: "path/to/pic",
 *   venue: "SM Clark Pampanga",
 *   start_date: "2025-04-19 14:00", // YYYY-MM-DD HH:MM FORMAT
 *   end_date: "2025-04-19 16:00" // YYYY-MM-DD HH:MM FORMAT
 * };
 *
 * const eventData = preprocessEvent(eventInfo);
 * if (eventData) {
 *   console.log("Valid Event Information:", eventData);
 * } else {
 *   console.error("Invalid Event Information, insertion blocked.");
 * }
 */

export type Event = {
  title: string;
  details: string;
  thumbnail: string;
  venue: string;
  start_date: DateTimeString;
  end_date: DateTimeString;
};

export function preprocessEvent(data: Event): [Event | null, ValidationError | null] {
  const requiredFields: (keyof Event)[] = ['title', 'details', 'thumbnail', 'venue', 'start_date', 'end_date'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return [null, {
        field,
        message: `${field} is required`
      }];
    }
  }

  if (!isValidDateTime(data.start_date) || !isValidDateTime(data.end_date)) {
    return [null, {
      field: 'date',
      message: 'Invalid date format. Please use YYYY-MM-DD HH:MM format'
    }];
  }

  return [{
    title: data.title.trim(),
    details: data.details.trim(),
    thumbnail: data.thumbnail.trim(),
    venue: data.venue.trim(),
    start_date: data.start_date as DateTimeString,
    end_date: data.end_date as DateTimeString
  }, null];
}



export default client;

