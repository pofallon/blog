# Resume Builds Playbook

Consolidated guidance for restoring Amplify builds after a freeze. Use in tandem with the CLI/Console runbooks and quickstart Phase C.

## Related Artifacts
- [resume-builds-cli.md](./resume-builds-cli.md)
- [resume-builds-console.md](./resume-builds-console.md)
- [../quickstart.md#phase-c--resume-builds](../quickstart.md#phase-c--resume-builds)
- [../verification-checklist.md](../verification-checklist.md)

## Execution Flow
1. **Gate on approvals**
   - Confirm `verification-checklist.md` shows 100% complete with `resumeAck` signed by the Release Lead.
   - Record `resumeAck`, approver, and timestamp inside `runbooks/dry-run-log.md`.
2. **Choose path (CLI vs Console)**
   - CLI path recommended for scripted environments; console path for operators needing UI confirmation.
3. **Re-enable production branch**
   - Turn auto-build back on for `$PROD_BRANCH` and verify Amplify acknowledges the change.
4. **Retire placeholder branch**
   - Disable placeholder monitoring immediately.
   - Decide whether to keep the branch for future freezes or delete it after audit sign-off (see safeguards below).
5. **Trigger validation build**
   - Push the empty commit per quickstart instructions.
   - Capture the resulting job ID and attach evidence.
6. **Communicate completion**
   - Send the resume template and update the Communication Packet with evidence links.

## Placeholder Branch Retirement Safeguards
- Keep the GitHub branch protected even if Amplify deletes it; this ensures a new placeholder can be recreated without drift.
- If the branch is retained, disable auto-build and add a scheduled GitHub Action that alerts #release-ops when commits land.
- Document the selected safeguard in `runbooks/dry-run-log.md` (Retired vs Dormant).
- Update the data-model `Amplify Branch (Placeholder)` entry with the chosen lifecycle state.

## Decision Checkpoint – `resumeAck`

| Field | Description | How to Update |
|-------|-------------|---------------|
| `checklistId` | ID from `verification-checklist.md` entry tied to this freeze. | Copy directly into the `/amplify/resume` payload and dry-run log. |
| `resumeAck` signer | Release Lead who approves restoring builds. | Capture full name, role, and timestamp; paste into Communication Packet template. |
| Evidence bundle | Links to branch/job outputs, curl hash, Playwright run, notification screenshots. | Stored alongside dry-run log and referenced in the resume template. |

Do not apply resume commands until all fields are filled and acknowledged in the checkpoint table above.

## Alerts & Evidence Capture
- Configure CloudWatch alarm or GitHub Action notifications that fire if Amplify reports a job on `amplify-paused` after resume.
- Attach the alarm ARN or workflow link to the verification checklist row.
- Record `resumedAt`, Amplify job ID, and alarm status in the Communication Packet before closing the change.
