# Quickstart – Pause AWS Amplify Builds

## Prerequisites
- AWS CLI v2.15+ and AWS Amplify CLI ≥ 12.10 installed with Node.js 18 LTS.
- IAM role with `amplify:ListBranches`, `amplify:UpdateBranch`, `amplify:CreateBranch`, `amplify:ListJobs`.
- GitHub admin access to create and lock the `amplify-paused` branch.
- Placeholder branch exists and only contains a README + pause notice; branch protection enabled.

Export baseline variables before running any commands:
```bash
export APP_ID=your-amplify-app-id
export PROD_BRANCH=main
export PLACEHOLDER_BRANCH=amplify-paused
```

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

## Phase B – Verification checklist
1. **Build history**: Capture screenshot/CLI output of `aws amplify list-jobs --app-id $APP_ID --branch-name $PROD_BRANCH --max-items 3`. Ensure no jobs start after the pause timestamp.
2. **Hosting status**: From Amplify console, confirm Production branch still shows last successful deploy.
3. **Synthetic request**:  
   ```bash
   curl -sS -w "%{http_code}\n" https://prod.example.com -o /tmp/prod.html
   shasum -a 256 /tmp/prod.html
   ```
4. **Playwright probe (optional but recommended)**  
   ```bash
   npx playwright test path/to/verify-pause.spec.ts
   ```
5. Record results plus evidence links in `verification-checklist.md` (create alongside this quickstart).

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
5. Trigger verification run that a new commit now produces a build, then announce “freeze lifted”.
