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
export async function connDB(func: queryFunc): Promise<WithId<Document>[]> {
  try {
    await client.connect()
    console.log('Connected successfully to server');
    const db = client.db(dbName)
    const collection = db.collection('users');
    const res = func(collection)
    return res
  } catch (error) {
    console.error('Error connecting to db or executing query', error);
    throw error
  } 
}

export const collections = {
  staff: db.collection('staff_col'),
  animals: db.collection('animal_col'),
  adoptees: db.collection('adoptee_col'),
  events: db.collection('event_col'),
};

type DateString = `${number}-${number}-${number}`;
function isValidDate(date: DateString): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  // Ensures they insert real/valid dates
  const [year, month, day] = date.split("-").map(Number);
  const dt = new Date(year, month - 1, day);
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
}

// Password should be >=8
type Password = string & { __type: "Password" };
function isValidPassword(password: string): password is Password {
  return password.length >= 8;
}

// 000-000-0000 FORMAT
type PhoneNumber = `${number}-${number}-${number}`;
function isValidPhone(phone: string): phone is PhoneNumber {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
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
 *   phone: "123-456-7890",
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

type Staff = {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  phone: PhoneNumber;
  password: Password;
  birthdate: DateString;
};

function preprocessStaff(data: any): Staff | null {
  if (
    isValidDate(data.birthdate) &&
    isValidPhone(data.phone) &&
    isValidPassword(data.password)
  ) {
    return {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      user_name: data.user_name.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone as PhoneNumber,
      password: data.password as Password,
      birthdate: data.birthdate as DateString,
    };
  }
  return null;
}

/**
 * Preprocesses and validates Animals Information before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Animal | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const animalInfo: Animal = {
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

type Animal = {
  name: string,
  rescue_date: DateString,
  personality: string,
  breed: string,
  status: boolean,
  code: string,
  animal_pic: string
}

function preprocessAnimal(data: any): Animal | null {
  if (
    isValidDate(data.rescue_date) 
  ) {
    return {
      name: data.name.trim(),
      rescue_date: data.rescue_date as DateString,
      personality: data.personality.trim(),
      breed: data.breed.trim(),
      status: data.status.trim(),
      code: data.code.trim(),
      animal_pic: data.animal_pic.trim()
    };
  }
  return null;
}


/**
 * Preprocesses and validates Adoptee Information before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Adoptee | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const adopteeInfo: Adoptee = {
 *   first_name: "Maria",
 *   last_name: "Estrada", 
 *   email: "mariaest@example.com",
 *   phone: "09123456789",
 *   animal_code: "1ed0e640sg",
 *   date_avail: "2025-04-18" // YYYY-MM-DD FORMAT
 * };
 *
 * const adopteeData = preprocessAdoptee(adopteeInfo);
 * if (adopteeData) {
 *   console.log("Valid Adoptee Information:", adopteeData);
 * } else {
 *   console.error("Invalid Adoptee Information, insertion blocked.");
 * }
 */

type Adoptee = {
  first_name: string,
  last_name: string,
  user_name: string,
  email: string,
  phone: PhoneNumber,
  animal_code: string,
  date_avail: DateString
}

function preprocessAdoptee(data: any): Adoptee | null {
  if (
    isValidDate(data.date_avail) &&
    isValidPhone(data.phone) 
  ) {
    return {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      user_name: data.user_name.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone as PhoneNumber,
      animal_code: data.animal_code.trim(),
      date_avail: data.date_avail as DateString,
    };
  }
  return null;
}

/**
 * Preprocesses and validates Event Information before insertion.
 *
 * @param {any} data - The raw staff data to be processed.
 * @returns {Event | null} - Returns a validated and formatted Staff object, or null if validation fails.
 *
 * @example
 * const eventInfo: Event = {
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

type Event = {
  title: string,
  details: string,
  thumbnail: string,
  venue: string,
  start_date: DateString,
  end_date: DateString
}

function preprocessEvent(data: any): Event | null {
  if (
    isValidDate(data.start_date) &&
    isValidDate(data.end_date) 
  ) {
    return {
      title: data.title.trim(),
      details: data.details.trim(),
      thumbnail: data.thumbnail.trim(),
      venue: data.venue.trim(),
      start_date: data.start_date as DateString,
      end_date: data.end_date as DateString
    };
  }
  return null;
}


export default client;

