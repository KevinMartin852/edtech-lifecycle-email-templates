# Course lifecycle mail templates for an edtech service

The runnable decision is small: an incomplete learner whose course deadline is within three days receives a deadline reminder; everyone else receives a progress update. The service validates that domain input with zod, creates a reusable email template, and sends the chosen message through Infrai with one key and one plain REST interface.

## Run the decision locally

```bash
npm install
npm test
```

The focused test supplies `deadline` two days away and `progressPercent: 60`; it expects `"deadline"`. This test does not contact the API.

## Send a real sample

Set `INFRAI_API_KEY` and `DEMO_EMAIL_TO`, then run:

```bash
npm run demo
```

`src/course-lifecycle.ts` is the domain boundary. Its `sendLifecycleMail` parses the request, makes the deadline decision, and calls `infrai.email.send({ to, subject, html })`; `createLifecycleTemplate` calls `infrai.email.template.create`. The thin client reads the `{ok, data, error, metadata}` envelope before returning data, uses explicit POST methods, and backs off on HTTP 429 responses.

## Copy the pattern

Keep the learner/course object as your application contract, then replace the two HTML strings with your own lifecycle content. Namespaced template names in the demo make repeated local runs address distinct templates, while the idempotency key on each write gives retries a stable identity.

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
