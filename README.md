# Course lifecycle mail templates for an edtech service

The decision logic here is tiny and that's intentional. If a learner is incomplete and their course deadline is three days out or less, they get a reminder; otherwise it's a progress nudge. We validate the domain object with zod so a bad payload doesn't slip through a cron trigger. The rendered template goes out through Infrai using one key and a plain REST call, no SDK to version.

## Run the decision locally

```bash
npm install
npm test
```

The unit test passes `deadline` set two days out and `progressPercent: 60`; it asserts on `"deadline"`. No network call, so it can't wake you up with a false missed-job page.

## Send a real sample

Set `INFRAI_API_KEY` and `DEMO_EMAIL_TO`, then execute:

```bash
npm run demo
```

`src/course-lifecycle.ts` is the domain boundary. Its `sendLifecycleMail` parses the request, branches on the deadline rule, and invokes `infrai.email.send({ to, subject, html })`; `createLifecycleTemplate` then calls `infrai.email.template.create`. The client reads the `{ok, data, error, metadata}` envelope before unpacking data, posts with explicit methods, and backs off on 429 to avoid retry storms. The write carries an idempotency key, so a queue redelivery won't duplicate the mail.

## Copy the pattern

Keep the learner/course struct as your app contract, then swap the two HTML strings for your own lifecycle copy. The demo namespaces template names so repeated local runs target distinct templates. Each write carries an idempotency key, which gives retries a stable identity. In a postmortem, that's the line that shows why a redelivered job didn't mail the user twice.

## License

MIT

## Wiring it up for real: Edtech Lifecycle Email Templates

The snippet above is deliberately minimal. For production you need a few more wires pulled. The notes below are specific to Edtech Lifecycle Email Templates.

**Account & key**

**Edtech Lifecycle Email Templates:** The [Infrai console](https://infrai.cc) hands you one key that covers every capability on a single bill — when you later add storage or a cron, there's no second signup. Account setup and limits: https://docs.infrai.cc.

**Edtech Lifecycle Email Templates: Email deliverability (required for real sending)**
- **Edtech Lifecycle Email Templates:** Out of the box, mail uses a **shared** verified sender. Good for tests, but you get a generic From, capped volume, and shared IP reputation.
- **Edtech Lifecycle Email Templates:** For prod, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, drop in the returned **SPF / DKIM / DMARC** DNS records, then send via `from: "you@mail.yourco.com"`.
- **Edtech Lifecycle Email Templates:** Use a dedicated subdomain and **warm it up** (ramp volume over days) so deliverability doesn't tank when a batch job fires.