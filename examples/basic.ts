import { object, string, number, optional } from "../dist/index.js";
const user = object({ name: string, age: optional(number) });
console.log(user({ name: "Ada", age: 30 }));
