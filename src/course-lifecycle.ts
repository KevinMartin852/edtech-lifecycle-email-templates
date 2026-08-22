import { z } from "zod";
import { infrai } from "./infrai-email.js";

export const lifecycleRequest = z.object({
  learnerEmail: z.string().email(),
  learnerName: z.string().min(1),
  courseTitle: z.string().min(1),
  deadline: z.string().datetime(),
  progressPercent: z.number().min(0).max(100)
});
export type LifecycleRequest = z.infer<typeof lifecycleRequest>;

export function chooseLifecycleMail(input: LifecycleRequest): "deadline" | "progress" {
  const days = (new Date(input.deadline).getTime() - Date.now()) / 86400000;
  return days <= 3 && input.progressPercent < 100 ? "deadline" : "progress";
}

export async function sendLifecycleMail(raw: unknown) {
  const input = lifecycleRequest.parse(raw);
  const kind = chooseLifecycleMail(input);
  const subject = kind === "deadline" ? `Deadline soon: ${input.courseTitle}` : `Course update: ${input.courseTitle}`;
  const html = kind === "deadline"
    ? `<p>Hi ${input.learnerName}, your ${input.courseTitle} deadline is ${input.deadline}.</p>`
    : `<p>Hi ${input.learnerName}, you are ${input.progressPercent}% through ${input.courseTitle}.</p>`;
  return infrai.email.send({ to: input.learnerEmail, subject, html }, `lifecycle-${input.learnerEmail}-${kind}`);
}

export async function createLifecycleTemplate(name: string) {
  return infrai.email.template.create({ name, subject: "{{courseTitle}}", html: "<p>{{learnerName}}</p>" }, `template-${name}`);
}
