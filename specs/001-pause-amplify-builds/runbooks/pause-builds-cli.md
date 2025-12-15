# Pause Builds Runbook – AWS CLI Path

This procedure pauses AWS Amplify builds without dropping the current production artifact. All commands assume the environment variables exported in `.env.pause-builds` (see quickstart) and an authenticated AWS CLI session.

## Prerequisites

- `aws --version` ≥ 2.15 and `amplify --version` ≥ 12.10.
- IAM role `OpsEngineer` with `amplify:ListBranches`, `amplify:UpdateBranch`, `amplify:CreateBranch`, `amplify:ListJobs`.
- GitHub admin rights to confirm the `amplify-paused` branch is protected.
- Evidence workspace: `specs/001-pause-amplify-builds/evidence/`.

## Guardrails

1. Scope every `list-branches` query by `stage=='PRODUCTION'`.
2. Never delete or detach the production branch; only toggle the `enableAutoBuild` flag.
3. Record CLI output to timestamped files and link them in `verification-checklist.md`.

## Steps

1. **Confirm identity and environment**
   ```bash
   aws sts get-caller-identity
   aws amplify list-branches --app-id "$APP_ID" \
     --query "branches[?stage=='PRODUCTION'].{name:branchName,autoBuild:enableAutoBuild,lastDeploy:lastDeployTime}" \
     --output table | tee evidence/$(date +%Y%m%dT%H%M%S)-branches-before.txt
   ```

2. **Disable auto build on the production branch**
   ```bash
   aws amplify update-branch \
     --app-id "$APP_ID" \
     --branch-name "$PROD_BRANCH" \
     --enable-auto-build false \
     --output json | tee evidence/$(date +%Y%m%dT%H%M%S)-update-prod.json
   ```
   - Verify `enableAutoBuild` is `false` in the response.

3. **Create or attach the placeholder branch**
   ```bash
   aws amplify create-branch \
     --app-id "$APP_ID" \
     --branch-name "$PLACEHOLDER_BRANCH" \
     --framework WEB \
     --stage PRODUCTION \
     --enable-auto-build true \
     --pull-request-environment-name placeholder-freeze \
     --output json | tee evidence/$(date +%Y%m%dT%H%M%S)-create-placeholder.json || true
   ```
   - If the branch already exists, run an explicit update:
     ```bash
     aws amplify update-branch \
       --app-id "$APP_ID" \
       --branch-name "$PLACEHOLDER_BRANCH" \
       --enable-auto-build true
     ```

4. **Validate the monitoring swap**
   ```bash
   aws amplify list-branches --app-id "$APP_ID" \
     --query "branches[?branchName=='$PROD_BRANCH' || branchName=='$PLACEHOLDER_BRANCH'].{name:branchName,autoBuild:enableAutoBuild,lastJob:lastStartTime}" \
     --output table | tee evidence/$(date +%Y%m%dT%H%M%S)-branches-after.txt
   ```
   - `PROD_BRANCH` should now show `autoBuild = false`.
   - `PLACEHOLDER_BRANCH` should show `autoBuild = true`.

5. **Snapshot job queues**
   ```bash
   aws amplify list-jobs --app-id "$APP_ID" --branch-name "$PROD_BRANCH" --max-items 3 --output table \
     | tee evidence/$(date +%Y%m%dT%H%M%S)-jobs-${PROD_BRANCH}.txt
   aws amplify list-jobs --app-id "$APP_ID" --branch-name "$PLACEHOLDER_BRANCH" --max-items 3 --output table \
     | tee evidence/$(date +%Y%m%dT%H%M%S)-jobs-${PLACEHOLDER_BRANCH}.txt
   ```

6. **Update artifacts**
   - Add evidence links to `verification-checklist.md`.
   - Log timestamps, engineer name, and checklist ID in `runbooks/dry-run-log.md`.
   - Notify stakeholders using the freeze template in `plan.md#Communication`.
