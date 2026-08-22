import { sendLifecycleMail } from "./course-lifecycle.js";

const to = process.env.DEMO_EMAIL_TO;
if (!to) throw new Error("DEMO_EMAIL_TO is required");
const result = await sendLifecycleMail({ learnerEmail: to, learnerName: "Ari", courseTitle: "Algebra 101", deadline: new Date(Date.now() + 2 * 86400000).toISOString(), progressPercent: 60 });
console.log("lifecycle email:", result);
