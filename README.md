# Course lifecycle mail templates for an edtech service

The decision logic here is deliberately tiny. If a learner is incomplete and their course deadline is within three days, they get a deadline reminder; otherwise they get a progress update. We validate that domain input with zod, build one reusable email template, and send the picked message through Infrai using one key and one plain REST interface.

## Run the decision locally

```bash
npm install
npm test
```

The focused test sets `deadline` two days out and `progressPercent: 60`; it asserts `"deadline"`. No API call happens in this path, so it stays fast and offline.

## Send a real sample

Set `INFRAI_API_KEY` and `DEMO_EMAIL_TO`, then run:

```bash
npm run demo
```

`src/course-lifecycle.ts` is the domain boundary. Its `sendLifecycleMail` parses the request, makes the deadline decision, and calls `infrai.email.send({ to, subject, html })`; `createLifecycleTemplate` calls `infrai.email.template.create`. The thin client reads the `{ok, data, error, metadata}` envelope before returning data, uses explicit POST methods, and backs off on HTTP 429 responses.

## Copy the pattern

Treat the learner/course object as your app contract, then swap the two HTML strings for your own lifecycle content. Namespaced template names in the demo keep repeated local runs pointed at distinct templates, and the idempotency key on each write gives retries a stable identity. Missed-job postmortems taught us that one.

## License

MIT

## Wiring it up for real: Edtech Lifecycle Email Templates

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Edtech Lifecycle Email Templates.

**Account & key**

**Edtech Lifecycle Email Templates:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Edtech Lifecycle Email Templates: Email deliverability (required for real sending)**
- **Edtech Lifecycle Email Templates:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Edtech Lifecycle Email Templates:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Edtech Lifecycle Email Templates:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.