# Release & Deploy Process

This repository separates **release orchestration** and **deployment execution**:

- `/.github/workflows/release.yml` → runs Release Please and decides which environment should deploy.
- `/.github/workflows/deploy.yml` → performs the actual Cloudflare deployment.

## How it Works

### 1) Release workflow (`release.yml`)

Trigger:

- Push to `master`

What it does:

1. Runs `googleapis/release-please-action`.
2. Inspects outputs from Release Please.
3. Dispatches deploy events to `deploy.yml`:
   - `releases_created == 'true'` → dispatch `deploy-site` with `{"environment":"production"}`
   - `prs_created == 'true'` → dispatch `deploy-site` with `{"environment":"development"}`

### 2) Deploy workflow (`deploy.yml`)

Triggers:

- `repository_dispatch` with type `deploy-site`
- `workflow_dispatch` (manual run)

Input / payload:

- `environment`: `production` or `development`

What it does:

1. Validates target environment.
2. Checks out the repo.
3. Sets up `mise`.
4. Installs dependencies via `setup-yarn`.
5. Configures publishing (`setup-npm-publish`).
6. Runs deployment:

```bash
mise task run deploy --configuration="${TARGET_ENVIRONMENT}"
```

## Manual Usage

### Manual deployment (recommended)

From GitHub Actions:

1. Open **Deploy** workflow.
2. Click **Run workflow**.
3. Choose `environment`:
   - `production`
   - `development`
4. Run.

### Manual repository dispatch (API/automation)

Send a `repository_dispatch` event:

- `event_type`: `deploy-site`
- payload example:

```json
{
  "environment": "development"
}
```

## Conventional Commits for Release Please

Release Please determines version bumps from commit messages.

- `fix:` → patch bump
- `feat:` → minor bump
- `feat!:` / `fix!:` / `BREAKING CHANGE:` → breaking bump

## Operational Notes

- `release.yml` no longer runs deployment logic directly.
- `deploy.yml` is the single place where deploy steps live.
- If both `releases_created` and `prs_created` are `true`, both deploy dispatches can run.

## Do Not

- Do not manually edit version/changelog as part of normal release flow unless intentionally bypassing Release Please.
- Do not duplicate deploy logic back into `release.yml`.

## Troubleshooting

- **Deploy workflow fails with Cloudflare auth errors**
  - Verify `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets exist and are valid.
  - Ensure the token is scoped to the same Cloudflare account as `CLOUDFLARE_ACCOUNT_ID`.
  - Ensure token permissions include Cloudflare Pages write access for the target account/project.

- **Cloudflare Pages project not found / deploy rejected**
  - This repo deploys to Pages project name `zenobius` (see `.mise/tasks/deploy`).
  - Ensure a Pages project named `zenobius` exists in that Cloudflare account.
  - If your Pages project name differs, update `.mise/tasks/deploy`.

- **Wrong environment receives deploy**
  - Cloudflare Pages uses `wrangler pages deploy --branch` as an environment/channel label, not your repo branch name.
  - Current mapping in `.mise/tasks/deploy` is:
    - `production` → `wrangler pages deploy ... --branch production`
    - `development` → `wrangler pages deploy ... --branch development`
    - preview from PR workflow → `wrangler pages deploy ... --branch pr/{pr_number}`
  - Ensure your Pages project routing/expectations match these labels.

- **Deploy completes but site content is stale/missing**
  - Confirm `dist/` is generated in CI before deploy (`mise task run build`).
  - Confirm `wrangler pages deploy dist ...` is deploying the expected artifact.
  - Check Cloudflare Pages deployment logs for upload/build errors.

- **Deploy workflow fails with `Invalid environment`**
  - Ensure manual input or dispatch payload uses exactly `production` or `development`.

- **Release runs but no deploy is triggered**
  - Check `release-please` outputs in the Release job logs.
  - Deploy dispatch only happens when:
    - `releases_created == 'true'` (production)
    - `prs_created == 'true'` (development)

- **Manual deploy button not visible**
  - Confirm `.github/workflows/deploy.yml` is on the default branch.
  - Confirm you have permission to run Actions in the repository.
