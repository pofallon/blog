# Pause Builds Playbook

This playbook synthesizes the CLI and Console procedures to pause Amplify builds while maintaining audit evidence. Use it as the canonical checklist when initiating a freeze.

## Related Artifacts
- [pause-builds-cli.md](./pause-builds-cli.md) – Command-by-command guide.
- [pause-builds-console.md](./pause-builds-console.md) – UI walkthrough with screenshot callouts.
- [../quickstart.md](../quickstart.md#phase-a--pause-builds) – Phase-level context.
- [../plan.md#communication](../plan.md#communication) – Notification templates.
- [../verification-checklist.md](../verification-checklist.md) – Evidence log tied to FR-004/FR-006.

## Unified Workflow

1. **Prep & Notify**
   - Source `.env.pause-builds` for `APP_ID`, `PROD_BRANCH`, `PLACEHOLDER_BRANCH`.
   - Send the freeze-initiation template (plan.md#Communication) with placeholders filled.
   - Create a new entry in `runbooks/dry-run-log.md`.
2. **Disable monitoring on production**
   - Follow either CLI Step 2 or Console Callout B to set `enableAutoBuild=false` on `$PROD_BRANCH`.
   - Record the response JSON or screenshot reference.
3. **Attach placeholder branch**
   - Execute CLI Step 3 or Console Callout C to ensure `amplify-paused` is monitored.
   - Confirm the branch only contains the README stub from GitHub.
4. **Validate and capture evidence**
   - Use CLI Step 4/5 or Console Callout D to export branch/job states.
   - Store outputs in `evidence/` and link them from the verification checklist.
5. **Gate on verification**
   - Complete `verification-checklist.md` items for build history, curl hash, and Playwright snapshot before declaring the freeze active.

## Placeholder Branch Governance

- Origin must be the latest production commit; delete build specs so new builds fail fast.
- Enforce GitHub branch protection (`Require status checks`, `Enforce admins`) and describe the rules inside the checklist row.
- Document any drift (e.g., accidental pushes) in `runbooks/dry-run-log.md` and notify in #release-ops.

## Notifications & Evidence (FR-004, FR-006)

| Requirement | Action |
|-------------|--------|
| FR-004 – Stakeholder notification | Use the freeze template with fields: `appId`, `productionBranch`, `placeholderBranch`, `pausedAt`, `evidenceUrl`, `nextUpdate`. Include the Communication Packet audience list. |
| FR-006 – Evidence capture | Attach branch/job outputs, curl hash, and Playwright snapshots to the checklist. Update the `Communication Packet` entry with `messageTemplate`, `evidenceLinks`, and `timestamp` and paste the packet ID back into this playbook entry. |

Close the pause by transitioning to the resume playbook once `resumeAck` is issued.
