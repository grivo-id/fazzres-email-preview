# FazzRes Email Preview

A local browser workbench for reviewing the current FazzRes email templates. It renders sample HTML and plain-text bodies; it does not send email or use production credentials.

## Included previews

- Registration verification code
- Password reset
- Subscription renewal reminder (Bahasa Indonesia)
- Payment received notification
- Payment failed/expired notification
- Admin product announcement
- Customer payment receipt (Bahasa Indonesia)

## Run locally

Install dependencies, then start Vite:

```bash
bun install
bun run dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5180`).

You can switch between templates, rendered HTML and plain text, desktop and mobile widths, and copy the current preview body. Preview values are synthetic and links are examples only.

Reference captures: [desktop](./screenshots/desktop.png) · [mobile](./screenshots/mobile.png).

The preview data and renderers live in `src/previews.ts` and `src/email.ts`. The logo in `public/assets/fazzres-logo.png` is copied from the panel app's brand assets. When an email template changes in the services, update the corresponding preview entry here to keep this workbench in sync.
