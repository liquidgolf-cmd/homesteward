# RealEstateBuddy – Live Wireframe

Click-through wireframe for the RealEstateBuddy app. Aligned with the implementation plan and conversation 2 (realestatebuddy-chatgptconvo 2.rtf): onboarding, dashboard, touchpoints, AVM meter, import flow, event creator, and homeowner portal.

## Run locally

```bash
cd wireframe
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and use the top nav to switch between:

- **Onboarding** – Welcome splash: “Upload contacts (CSV)”, “Import from CRM (optional)”, Concierge import
- **Dashboard** – “187 households under care”, hero CTAs (Review this month, Add client), quick actions (+ Add client, Import, Create event, Settings), This quarter — meaningful touchpoints preview, Property value updates meter
- **Touchpoints** – This quarter — meaningful touchpoints; filters (All, Priority, New, RSVP); cards with Review & send
- **Touchpoint compose** – Review & send; prefilled message; Send via Push / Email / SMS; Send message
- **Property value updates** – Meter detail: 142/300 used, estimated cost, breakdown (quarterly refresh, on-demand, import enrichment), Purchase add-on, Change refresh cadence, Pause value refresh
- **Add client** – Form: first/last name, email/phone (optional), property address, city/state/zip, closing date, goal dropdown
- **Import mapping** – Map your columns; CSV header → Mapped field table; Confirm & enrich (opens estimated usage modal); Import without enrichment
- **Post-import success** – “All set. Your database is organized.” 187 households — 22 entering 5–7 year window; Go to touchpoints
- **Create event** – Host client event: title, date & time, location, note, upload flyer, audience, RSVP; Send invite
- **Homeowner portal** – Agent-branded home snapshot, seasonal reminders, annual review, optional actions

No backend or data — static wireframe only.
