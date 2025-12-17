# Resume Builds Runbook – Amplify Console Path

Follow these steps when restoring builds via the AWS Console UI.

1. **Verify approvals**
   - Confirm `resumeAck` and checklist links are signed off in `verification-checklist.md`.
   - Announce intent to resume in #release-ops.
2. **Re-enable production monitoring**
   - Navigate to **App settings → Branches → main → Edit**.
   - Toggle **Enable auto-build** on.
   - Capture a screenshot of the confirmation toast (Callout R1).
3. **Disable placeholder monitoring**
   - Open the `amplify-paused` branch card.
   - Toggle **Enable auto-build** off.
   - Note whether the branch will remain for later freezes (Callout R2).
4. **Optional cleanup**
   - If policy allows removing the placeholder branch, document the deletion decision and keep the GitHub branch protected.
5. **Validation**
   - Switch to **Monitoring → Builds**, filter by `main`, and observe the new build triggered by the dry-run commit.
   - Record the job ID and attach screenshot Callout R3 to the dry-run log.
6. **Communicate completion**
   - Send the resume template from plan.md#Communication with `resumedAt`, `monitoringBranch`, and evidence links.
