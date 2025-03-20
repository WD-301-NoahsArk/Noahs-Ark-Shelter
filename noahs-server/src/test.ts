// To check if the function are running, test it.
// run "node --loader ts-node/esm src/test.ts" in the terminal.

import { isValidDate, isValidPhone, isValidDateTime, isValidPassword } from "./db.js";

console.log("✅ Date Tests:");
console.log(isValidDate("2024-03-20")); // Expected: true
console.log(isValidDate("2024-02-30")); // Expected: false (invalid date)
console.log(isValidDate("03-20-2024")); // Expected: false (wrong format)

console.log("\n✅ DateTime Tests:");
console.log(isValidDateTime("2025-12-31 23:59")); // Expected: true
console.log(isValidDateTime("2025-02-30 12:00")); // Expected: false (invalid date)
console.log(isValidDateTime("12-31-2025 23:59")); // Expected: false (wrong format)

console.log("\n✅ Phone Tests:");
console.log(isValidPhone("0912-345-6789")); // Expected: true
console.log(isValidPhone("123-456-7890")); // Expected: false (wrong format)
console.log(isValidPhone("09123456789")); // Expected: false (missing dashes)

console.log("\n✅ Password Tests:");
console.log(isValidPassword("securePass")); // Expected: true
console.log(isValidPassword("12345")); // Expected: false (too short)


