import { chooseLifecycleMail } from "./course-lifecycle.js";
const soon = { learnerEmail: "a@b.com", learnerName: "Ari", courseTitle: "Algebra", deadline: new Date(Date.now() + 2 * 86400000).toISOString(), progressPercent: 60 };
if (chooseLifecycleMail(soon) !== "deadline") throw new Error("incomplete learners near a deadline need a deadline mail");
console.log("business decision test passed");
