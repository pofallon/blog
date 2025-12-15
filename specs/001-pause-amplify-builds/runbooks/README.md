# Runbooks – Pause AWS Amplify Builds

This directory centralizes the operational procedures referenced across the feature plan. Each document links back to the contracts, data model, and quickstart instructions for traceability.

## Pause Procedures
- [pause-builds-cli.md](./pause-builds-cli.md) – AWS CLI workflow to disable the production branch, attach the placeholder branch, and guard against drift.
- [pause-builds-console.md](./pause-builds-console.md) – Amplify Console click-through with screenshot callouts.
- [pause-builds.md](./pause-builds.md) – Consolidated pause playbook (notifications, approvals, evidence capture).

## Resume Procedures
- [resume-builds-cli.md](./resume-builds-cli.md) – CLI commands to re-enable the production branch and retire the placeholder branch.
- [resume-builds-console.md](./resume-builds-console.md) – Console navigation to restore monitoring and auto-build.
- [resume-builds.md](./resume-builds.md) – Decision log plus resumeAck approval guidance.

## Evidence & Verification
- [../verification-checklist.md](../verification-checklist.md) – Template completed after each freeze/resume cycle.
- [../scripts/verify-pause.spec.ts](../scripts/verify-pause.spec.ts) – Playwright probe referenced by the quickstart and checklist.
- [dry-run-log.md](./dry-run-log.md) – Chronicle of rehearsal runs with timestamps, approvers, and evidence links.
