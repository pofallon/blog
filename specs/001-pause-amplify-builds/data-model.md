# Data Model – Pause AWS Amplify Build Automation

| Entity | Description | Key Fields | Relationships | Validation / Notes |
|--------|-------------|------------|---------------|--------------------|
| Amplify App | Production AWS Amplify application hosting the blog. | `appId`, `appName`, `defaultDomain`, `connectedRepository`, `environments[]`, `stage` | Owns multiple `Amplify Branch` records; linked to Verification Checklist entries. | `stage` must include at least one `PRODUCTION` branch; repository connection must stay authorized before edits. |
| Amplify Branch (Production) | Current branch (`main`) that deployed the live site. | `branchName`, `stage`, `enableAutoBuild`, `lastDeploymentTime`, `domainAssociations[]`, `buildSpec` | Child of Amplify App; paired 1:1 with Verification Checklist row capturing pause evidence. | `enableAutoBuild` toggled to `false` during pause; branch must retain last successful artifact and domain mapping. |
| Amplify Branch (Placeholder) | Dormant `amplify-paused` branch monitored during freeze. | `branchName`, `branchProtectionState`, `autoBuild`, `repoCommitSha`, `alertAction` | Child of Amplify App; references GitHub placeholder branch metadata. | Must be protected, allow zero content files (README only), and auto-build can stay `true` even though no commits land. Creation requires recorded timestamp + engineer ID. |
| GitHub Placeholder Branch | Repository branch used solely to satisfy Amplify monitoring requirement. | `branchName=amplify-paused`, `sourceSha`, `protectionRules`, `monitoringAction` | Associated to both Amplify Placeholder Branch and Comms template. | Cannot accept merges; protection enforces “no pushes except admins” plus required status check that always fails (to prevent accidental deploy). |
| Verification Checklist | Evidence artifact proving builds paused + site healthy. | `checklistId`, `appId`, `executedAt`, `engineer`, `buildHistorySnapshot`, `curlHash`, `playwrightScreenshot`, `hourlyRecheckAt`, `notes`, `resumeAck` | References Amplify App + Branch entries; stored per pause + re-enable cycle. | Requires 100% completion before change freeze considered active; `resumeAck` mandatory before re-enabling builds. |
| Communication Packet | Notification message templates for freeze/resume. | `audience`, `channel`, `messageTemplate`, `evidenceLinks`, `timestamp` | Linked to Verification Checklist to embed evidence links. | Must include pager handoff + Slack/email recipients defined in spec. |

## State transitions

1. **Amplify Branch (Production)**
   - `Active` → `Paused`: toggle `enableAutoBuild=false`, record pause metadata in Verification Checklist.
   - `Paused` → `Active`: re-enable auto build and reconnect monitoring to `main` after resume approval.

2. **Amplify Branch (Placeholder)**
   - `Untracked` → `Monitored`: branch connected and auto-build enabled (no commits expected).
   - `Monitored` → `Retired`: when freeze lifted, disable auto build and optionally delete branch after audit retention.

3. **Verification Checklist**
   - `Draft` → `Submitted`: all evidence fields populated.
   - `Submitted` → `Approved`: ops lead validates and archives link inside spec directory.

4. **Communication Packet**
   - `Prepared` → `Sent`: message delivered to release managers.
   - `Sent` → `Acknowledged`: confirmations captured from recipients.
