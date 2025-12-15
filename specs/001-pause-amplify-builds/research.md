# Research – Pause AWS Amplify Build Automation

## Branch control tooling
- Decision: Require AWS Amplify CLI ≥ 12.10 and AWS CLI v2.15+ with Node.js 18 LTS for all scripted steps so engineers can list/update branches and environment mappings exposed after the 2024 CLI refactor.  
- Rationale: These versions include the current GitHub OAuth device authorization flow and `aws amplify update-branch`/`list-webhooks` improvements that older releases lack, preventing auth failures mid-freeze.  
- Alternatives considered: Staying on legacy Amplify CLI v11 (blocked because it still depends on Node 16 and the deprecated GitHub token scopes); using only the Amplify Console (rejected because we must document CLI parity per spec).

## Switching monitored branch to `amplify-paused`
- Decision: In the Amplify Console use **App settings → Branches → main → Edit → Auto-build** to turn off monitoring on `main`, then use **Connect branch** to attach `amplify-paused` and leave auto-build enabled there; mirror this via CLI with `aws amplify update-branch --app-id $APP_ID --branch-name main --enable-auto-build false` followed by `aws amplify create-branch --app-id $APP_ID --branch-name amplify-paused --enable-auto-build true --stage PRODUCTION --framework WEB` (idempotent when the branch already exists).  
- Rationale: Amplify serves the last successful artifact for `main` even after auto-build is disabled, while the only branch still monitored is the dormant placeholder, preventing new deployments yet keeping a reversible pointer.  
- Alternatives considered: Disconnecting the production branch entirely (fails because it would remove the associated domain/rewrites) and relying solely on branch protection without toggling monitoring (insufficient audit evidence that builds are paused).

## Synthetic verification tooling
- Decision: Standardize on `curl -sS -w "%{http_code}" https://prod.example.com -o /tmp/response.html` plus a lightweight Playwright script to capture DOM hash, ensuring verifiable HTTP 200 + unchanged content.  
- Rationale: curl is ubiquitous for on-call engineers and works in isolated bastions, while Playwright (or `npx playwright test verify-pause.spec.ts`) gives a quick DOM diff to prove the UI stayed stable.  
- Alternatives considered: Lighthouse or browserstack-based checks (too heavy for 10-minute re-enable SLA), AWS CloudWatch Synthetics canaries (nice but slower to configure).

## Multi-environment guardrails
- Decision: Scope all commands with explicit `APP_ID`/`BRANCH_NAME` variables and require `aws amplify list-branches --app-id $APP_ID --query 'branches[?stage==\`PRODUCTION\`].branchName'` verification before mutations so staging/dev Amplify environments stay untouched.  
- Rationale: Amplify apps often include preview branches; forcing `stage==PRODUCTION` filters and confirmation prompts prevents accidental freezes on preview apps.  
- Alternatives considered: Free-form instructions that rely on engineers “being careful” (rejected because audits need deterministic guardrails).

## GitHub placeholder governance
- Decision: Create the `amplify-paused` branch from the current production SHA, delete `amplify.yml`/src files so only a README + pause marker remain, lock it via branch protection (`--enforce-admins`) and add a cron GitHub Action to alert if commits land, ensuring it remains dormant.  
- Rationale: The placeholder must stay empty so Amplify never produces a new artifact; branch protection plus monitoring enforces that while the missing build spec makes any accidental build fail immediately without touching production.  
- Alternatives considered: Using a tag instead of a branch (Amplify can only track branches); using `main-paused` naming (less explicit and could collide with existing flows).

## AWS Amplify Console best practices
- Decision: Capture screenshots/step numbers for App settings navigation, explicitly note that the previous deployment remains live until a new job finishes, and instruct operators to watch the **Builds** tab for five minutes after switching to ensure no residual job starts.  
- Rationale: Console UX occasionally queues a “redeploy latest commit” job if the engineer accidentally clicks “Redeploy” during edits; documenting the safe path prevents that.  
- Alternatives considered: Assuming console familiarity (not acceptable for a runbook intended for any L2 engineer).
