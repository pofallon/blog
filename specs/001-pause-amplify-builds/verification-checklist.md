# Verification Checklist – Pause Amplify Builds

Fill out this template for every freeze. Store completed copies next to the evidence artifacts and reference the `checklistId` inside the pause/resume contracts.

## Metadata
- **checklistId**: `CHK-YYYYMMDD-##`
- **appId**: 
- **engineer on-call**: 
- **executedAt (UTC)**: 
- **pause reason**: 
- **resumeAck (approval code)**: _(leave blank until resume)_

## Evidence Matrix

| Item | Status | Link / Attachment | Notes |
|------|--------|-------------------|-------|
| Build history snapshot (`aws amplify list-jobs` for `$PROD_BRANCH`) | [ ] |  | e.g., evidence/20251215T041500-jobs-main.txt |
| Placeholder branch job snapshot (`amplify list-jobs` for `$PLACEHOLDER_BRANCH`) | [ ] |  | Expected to show zero jobs or failures. |
| Hosting status screenshot | [ ] |  | Amplify Console screenshot showing last successful deploy. |
| Curl response body + HTTP code | [ ] |  | Attach raw output + command log. |
| SHA-256 hash of response | [ ] |  | `shasum -a 256 /tmp/prod.html` output. |
| Playwright DOM snapshot (`scripts/verify-pause.spec.ts`) | [ ] |  | Include screenshot + trace ZIP. |
| Hourly re-check (timestamp + outcome) | [ ] |  | Repeat curl/hash hourly until resumeAck. |
| Communication Packet link | [ ] |  | Points to freeze/resume announcements. |

## Hourly Follow-up Log

| Timestamp (UTC) | Branch auto-build states | Curl hash (first 8 chars) | Notes |
|-----------------|-------------------------|---------------------------|-------|
|                 |                         |                           |       |
|                 |                         |                           |       |
|                 |                         |                           |       |

## Resume Checklist

- [ ] `resumeAck` approved by ____________________ at ____________________ UTC.
- [ ] Empty commit pushed to `$PROD_BRANCH` and Amplify job ID `______________` completed successfully.
- [ ] Placeholder branch status updated to (Retired / Dormant) and logged in `runbooks/dry-run-log.md`.
- [ ] Resume communication sent with evidence links.
