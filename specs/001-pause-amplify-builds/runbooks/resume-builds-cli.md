# Resume Builds Runbook – AWS CLI Path

Use this procedure after `resumeAck` approval to restore Amplify monitoring to the production branch.

## Prerequisites
- `resumeAck` field completed in `verification-checklist.md`.
- `runbooks/dry-run-log.md` entry opened for the cycle.
- AWS CLI v2.15+, authenticated as the `ReleaseLead` role.

## Steps
1. **Confirm approval + branch state**
   ```bash
   echo "resumeAck: $RESUME_ACK_ID"
   aws amplify list-branches --app-id "$APP_ID" \
     --query "branches[?branchName=='$PROD_BRANCH' || branchName=='$PLACEHOLDER_BRANCH'].{name:branchName,autoBuild:enableAutoBuild}" \
     --output table | tee evidence/$(date +%Y%m%dT%H%M%S)-resume-branches-before.txt
   ```

2. **Re-enable auto build on production**
   ```bash
   aws amplify update-branch \
     --app-id "$APP_ID" \
     --branch-name "$PROD_BRANCH" \
     --enable-auto-build true \
     --framework WEB \
     --output json | tee evidence/$(date +%Y%m%dT%H%M%S)-resume-update-prod.json
   ```

3. **Disable placeholder monitoring**
   ```bash
   aws amplify update-branch \
     --app-id "$APP_ID" \
     --branch-name "$PLACEHOLDER_BRANCH" \
     --enable-auto-build false \
     --output json | tee evidence/$(date +%Y%m%dT%H%M%S)-resume-update-placeholder.json
   ```
   - If the branch should be removed after audit, document the deletion plan instead of immediate cleanup.

4. **Map contract fields**
   - Populate `/amplify/resume` request payload:
     ```json
     {
       "appId": "$APP_ID",
       "targetBranch": "$PROD_BRANCH",
       "engineer": {"name": "$ENGINEER", "contact": "$CONTACT"},
       "checklistId": "$CHECKLIST_ID"
     }
     ```
   - Store the response body (monitoring branch + `resumedAt`) with the evidence set.

5. **Dry-run validation**
   - Follow Quickstart Phase C step 5 to push an empty commit.
   - Use `aws amplify list-jobs --app-id "$APP_ID" --branch-name "$PROD_BRANCH" --max-items 1` to confirm the new job completes.

6. **Close out**
   - Update `runbooks/dry-run-log.md`.
   - Send the resume communication template.
   - Archive outputs next to the pause artifacts.
