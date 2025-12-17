# Pause Builds Runbook – Amplify Console Path

Use this path when engineers prefer the AWS Amplify Console UI. Capture screenshots for each callout and store them next to the CLI evidence for audits.

## Navigation Map

1. Sign in to the AWS console with the `OpsEngineer` role.
2. Open **Amplify Console → All apps → {{appName}}**.
3. Select **App settings → Branches**.

## Step-by-step

1. **Document pre-state (Callout A)**
   - Screenshot the Branches table showing `main` with `Auto-build` enabled.
   - Record the timestamp and currently connected repository commit.

2. **Disable monitoring on `main` (Callout B)**
   - Click the `main` branch row → **Edit**.
   - Toggle **Enable auto-build** off.
   - Ensure **Last successful deploy** still references the desired commit.
   - Save changes and capture a screenshot of the confirmation toast.

3. **Attach placeholder branch (Callout C)**
   - Click **Connect branch**.
   - Choose `amplify-paused` from the drop-down (create from GitHub if missing).
   - Leave auto-build enabled but confirm the branch contains only the placeholder README.
   - Label the screenshot with the new branch card showing `Auto-build: On`.

4. **Verify build queue (Callout D)**
   - Navigate to **Monitoring → Builds**.
   - Filter by `main` and confirm no builds start after the freeze timestamp.
   - Filter by `amplify-paused` and confirm no jobs complete (expected failure is acceptable).

5. **Update evidence references**
   - Upload screenshots A–D to the evidence store and paste their URLs into `verification-checklist.md`.
   - Add summary bullets to `runbooks/pause-builds.md` and `runbooks/dry-run-log.md`.
