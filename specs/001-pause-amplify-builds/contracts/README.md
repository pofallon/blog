# Contracts Overview – Pause Amplify Builds

Reference implementation lives in [pause-builds.openapi.yaml](./pause-builds.openapi.yaml). The tables below summarize how each field maps to operational artifacts and which user story owns the requirement.

## `/amplify/pause`

| Payload | Field | Source Artifact | Notes | Story Owner |
|---------|-------|-----------------|-------|-------------|
| Request | `appId` | Quickstart Phase A step 2 (`aws amplify list-branches`) | Guards CLI commands to the production app. | US1 |
| Request | `productionBranch` | Plan Technical Context + data-model "Amplify Branch (Production)" | Typically `main`; must have auto-build disabled. | US1 |
| Request | `placeholderBranch` | Data model "Amplify Branch (Placeholder)" | Created/attached before the freeze. | US1 |
| Request | `engineer.name/contact` | Runbooks/pause-builds.md notifications section | Tracks who executed the freeze. | US1 |
| Request | `reason` | Communication Packet template | Captures freeze justification for stakeholders. | US1 |
| Request | `notifyChannels[]` | plan.md#Communication templates | Slack/email destinations for proactive alerts. | US1 |
| Response | `checklistId` | verification-checklist.md | Identifier recorded once evidence is captured. | US1 / US3 |
| Response | `pausedAt` | Runbooks/pause-builds.md evidence log | Timestamp inserted into quickstart Phase B. | US1 |
| Response | `monitoringBranch` | Should return `amplify-paused` when successful | Confirms Amplify is watching the placeholder branch. | US1 |
| Response | `verification.buildHistoryUrl` | Screenshots/CLI output stored in runbooks/dry-run-log.md | Points reviewers to captured artifacts. | US3 |
| Response | `verification.curlEvidenceUrl` | Quickstart Phase B synthetic request output | Uploaded hash output. | US3 |
| Response | `verification.playwrightEvidenceUrl` | scripts/verify-pause.spec.ts results | DOM snapshot reference. | US3 |

## `/amplify/resume`

| Payload | Field | Source Artifact | Notes | Story Owner |
|---------|-------|-----------------|-------|-------------|
| Request | `appId` | Same value captured during pause | Prevents cross-app resume. | US2 |
| Request | `targetBranch` | Typically `main`; runbooks/resume-builds.md step 1 | Auto-build toggled back on. | US2 |
| Request | `engineer.*` | Resume runbook approval matrix | Person executing the resume. | US2 |
| Request | `checklistId` | verification-checklist.md `resumeAck` | Ensures verification approved resuming. | US2 / US3 |
| Response | `resumedAt` | Resume runbook timeline | Logged in dry-run-log.md. | US2 |
| Response | `monitoringBranch` | Should report `main` after success | Confirms placeholder branch detached. | US2 |
| Response | `nextSteps` | plan.md#Communication resume template | Summarizes stakeholder follow-up. | US2 |
