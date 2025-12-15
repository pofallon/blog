# Quickstart – Pause AWS Amplify Builds

## Baseline environment
Create a reusable shell snippet so every terminal session exports the Amplify identifiers consistently:

```bash
cat <<'EOF' > .env.pause-builds
export APP_ID=your-amplify-app-id
export PROD_BRANCH=main
export PLACEHOLDER_BRANCH=amplify-paused
EOF

source ./.env.pause-builds
```

## Prerequisites
- AWS CLI v2.15+ and AWS Amplify CLI ≥ 12.10 installed with Node.js 18 LTS.
- IAM role with `amplify:ListBranches`, `amplify:UpdateBranch`, `amplify:CreateBranch`, `amplify:ListJobs`.
- GitHub admin access to create and lock the `amplify-paused` branch.
- Placeholder branch exists and only contains a README + pause notice; branch protection enabled.
- Baseline variables from `.env.pause-builds` sourced in the current shell.

## Phase A – Pause builds
1. **Notify stakeholders** using the template in `specs/001-pause-amplify-builds/plan.md` (Release managers + #ops channel).
2. **Confirm current production branch**  
   ```bash
   aws amplify list-branches --app-id $APP_ID \
     --query "branches[?stage=='PRODUCTION'].{name:branchName,autoBuild:enableAutoBuild,lastJob:lastDeployTime}"
   ```
3. **Disable auto build on `main`**  
   ```bash
   aws amplify update-branch --app-id $APP_ID --branch-name $PROD_BRANCH \
     --enable-auto-build false
   ```
4. **Connect placeholder branch (idempotent)**  
   ```bash
   aws amplify create-branch --app-id $APP_ID --branch-name $PLACEHOLDER_BRANCH \
     --stage PRODUCTION --enable-auto-build true || true
   ```
5. **Amplify Console fallback**  
   - Navigate to the app → *App settings → Branches*.  
   - Open `main`, toggle **Auto-build** off, save.  
   - Click **Connect branch**, choose `amplify-paused`, keep auto-build on (no commits will arrive).  
   - Verify no “Redeploy” button is highlighted.
6. **Sandbox rehearsal validation**  
   - Capture the authoritative branch state:
     ```bash
     aws amplify list-branches --app-id $APP_ID \
       --query "branches[?branchName==\`$PROD_BRANCH\` || branchName==\`$PLACEHOLDER_BRANCH\`].{name:branchName,autoBuild:enableAutoBuild,stage:stage}" \
       --output table > evidence/sandbox-$(date +%Y%m%dT%H%M%S)-branches.txt
     ```
   - For each branch, snapshot the last three jobs and confirm no new builds start after the pause timestamp:
     ```bash
     for BRANCH in $PROD_BRANCH $PLACEHOLDER_BRANCH; do
       aws amplify list-jobs --app-id $APP_ID --branch-name "$BRANCH" --max-items 3 \
         --output table > evidence/sandbox-$(date +%Y%m%dT%H%M%S)-jobs-${BRANCH}.txt
     done
     ```
   - Attach the captured files (or Amplify Console screenshots) to `runbooks/dry-run-log.md` and link them inside `verification-checklist.md`.

## Phase B – Verification checklist
1. **Build history**  
   ```bash
   aws amplify list-jobs --app-id $APP_ID --branch-name $PROD_BRANCH --max-items 3 --output json \
     | tee evidence/$(date +%Y%m%dT%H%M%S)-jobs-${PROD_BRANCH}.json
   ```
   - Attach the file (or screenshot) to the `Build history snapshot` row in `verification-checklist.md`.
2. **Hosting status**  
   - In Amplify Console, open **App settings → Branches → $PROD_BRANCH** and capture the card that shows **Last deploy** timestamp.
   - Upload the screenshot and reference it in the checklist.
3. **Synthetic request + hash**
   ```bash
   curl -sS -w "%{http_code}\n" https://prod.example.com -o /tmp/prod.html | tee evidence/$(date +%Y%m%dT%H%M%S)-curl.log
   shasum -a 256 /tmp/prod.html | tee evidence/$(date +%Y%m%dT%H%M%S)-curl.sha
   ```
   _Sample output_
   ```
   200
   e3d1b4f1c0c12ab3d7aee6f4cb9b1f8c8cb7410f5a573f143997cbb6a1c5d912  /tmp/prod.html
   ```
   - Store both files and copy the hash’s first 8 characters into the hourly follow-up log.
4. **Playwright probe**  
   ```bash
   npx playwright test specs/001-pause-amplify-builds/scripts/verify-pause.spec.ts --reporter=list
   ```
   - Upload the screenshot + trace ZIP generated in `playwright-report/` and link them in the checklist.
5. **Checklist update**  
   - Mark each Evidence Matrix row as complete in `verification-checklist.md`.
   - Create or update the Hourly Follow-up log and keep adding entries until `resumeAck` is approved.

## Phase C – Resume builds
1. Confirm release approval + checklist `resumeAck` field signed.
2. Re-enable auto build on `main`:  
   ```bash
   aws amplify update-branch --app-id $APP_ID --branch-name $PROD_BRANCH \
     --enable-auto-build true
   ```
3. Disable monitoring on placeholder:  
   ```bash
   aws amplify update-branch --app-id $APP_ID --branch-name $PLACEHOLDER_BRANCH \
     --enable-auto-build false
   ```
4. Optional cleanup: delete placeholder branch in Amplify (but keep GitHub branch for future freezes).
5. Trigger dry-run validation:
   ```bash
   git checkout $PROD_BRANCH && git pull origin $PROD_BRANCH
   git commit --allow-empty -m "Resume validation $(date +%Y-%m-%dT%H:%M:%S)"
   git push origin $PROD_BRANCH
   aws amplify list-jobs --app-id $APP_ID --branch-name $PROD_BRANCH --max-items 1 --output table
   ```
   - Confirm the pushed commit appears in Amplify within a few minutes and completes successfully.
6. Append the validation timestamp, Amplify job ID, and `resumeAck` reference to `runbooks/dry-run-log.md`, then send the resume template from plan.md#Communication.
