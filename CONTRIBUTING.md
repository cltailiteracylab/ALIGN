# Contributing to ALIGN

Thank you for contributing to the ALIGN AI Literacy Platform.

This repository is shared across multiple sub-project teams. To keep the platform stable and make collaboration easier, all development should follow the workflow below.

## Development Workflow

All development should happen through feature branches.

Do not develop directly on `main`.

### 1. Update your local `main`

Before starting new work:

```bash
git checkout main
git pull origin main
```

### 2. Create a feature branch

Use this branch naming format:

```text
<team>/<feature-name>
```

Examples:

```text
1a/resource-search
1a/faculty-upload-workflow
2a/rag-retrieval
2b/classroom-agent
3b/game-generator
mentors/sso-integration
```

Create your branch:

```bash
git checkout -b 1a/resource-search
```

### 3. Make your changes

Work only on files relevant to your assigned task.

If your change affects another team's component, shared architecture, API contract, content schema, or shared package, coordinate with the relevant team or mentor before making the change.

### 4. Check your changes

Before committing:

```bash
git status
```

Make sure:

- Only intended files are changed
- No secrets or credentials are included
- The code runs locally
- Existing functionality is not broken
- Documentation is updated when needed

### 5. Commit your changes

Stage your changes:

```bash
git add .
```

Create a meaningful commit message:

```bash
git commit -m "Add resource search interface"
```

Good examples:

```text
Add faculty resource upload form
Implement RAG retrieval endpoint
Add game generation prompt template
Update AI literacy resource schema
Fix navigation issue on materials page
```

Avoid unclear commit messages such as:

```text
update
changes
fix
final
test
```

### 6. Push your branch

```bash
git push -u origin 1a/resource-search
```

### 7. Open a Pull Request

Open a Pull Request from your feature branch into `main`.

Your Pull Request should include:

- What was changed
- Why the change was needed
- How the change was tested
- Any dependencies or open issues
- Screenshots when the change affects the user interface

Do not merge directly into `main` without review.

### 8. Request review

Request review from the appropriate teammate, team owner, or mentor.

Address review comments before merging.

If your change affects shared components, authentication, architecture, schemas, or another team's work, make sure the relevant owners review it.

### 9. Merge after approval

After the Pull Request is approved and any required checks pass, merge it into `main`.

Delete the feature branch after the merge if it is no longer needed.

## Important Rules

- Do not push directly to `main`
- Do not commit passwords, API keys, tokens, private keys, or credentials
- Do not commit `.env` files
- Do not upload service-account files or secret configuration files
- Do not modify another team's component without coordination
- Do not overwrite shared schemas or API contracts without discussion
- Keep documentation updated when behavior or interfaces change
- Keep Pull Requests focused on one feature or task when possible
- Test your work before requesting review
- Ask for help early if you are blocked

## Environment Variables

Real credentials must never be committed to GitHub.

Use local environment files such as:

```text
.env
.env.local
```

These files are ignored by Git.

Use `.env.example` to document required environment variables without including real values.

Example:

```text
NEXT_PUBLIC_API_URL=
DATABASE_URL=
LLM_API_KEY=
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=
```

## Repository Structure

The repository is organized by platform components rather than by student teams.

```text
apps/
    User-facing platform applications

services/
    Backend AI and agent services

packages/
    Shared authentication, UI, types, and platform utilities

content/
    AI literacy resource schemas, metadata, and seed content

docs/
    Architecture, API contracts, governance, and project documentation
```

Teams should contribute to the component relevant to their assigned work.

## Shared Components

Some areas are shared across the entire platform.

Examples include:

```text
packages/auth/
packages/ui/
packages/shared-types/
docs/architecture/
```

Changes to shared components should be coordinated with the mentor team.

## Branch Naming

Preferred format:

```text
<team>/<short-feature-name>
```

Examples:

```text
1a/resource-filtering
1a/resource-metadata
2a/rag-pipeline
2a/embedding-service
2b/classroom-chat
3b/game-generator
mentors/auth-setup
mentors/shared-navigation
```

Use lowercase words separated by hyphens.

## Pull Request Guidelines

Keep Pull Requests small and focused when possible.

A good Pull Request should answer:

1. What changed?
2. Why was it needed?
3. How was it tested?
4. Does it affect another team?
5. Does documentation need to be updated?

## When to Coordinate Before Coding

Talk to the relevant mentor or team before making changes to:

- Authentication or SSO
- Shared UI components
- Shared navigation
- Content schemas
- Database schemas
- API contracts
- Repository-wide configuration
- Shared environment variables
- Cross-team integrations
- Architecture decisions

## Getting Help

If you are blocked:

1. Check the project documentation
2. Ask your subgroup
3. Ask your mentor
4. Raise the issue in the shared communication channel if it affects multiple teams

Do not wait until the next weekly meeting if a blocker is preventing progress.

## Goal

The goal of this workflow is to allow all sub-project teams to contribute independently while keeping the ALIGN platform integrated, reviewable, and stable.
```
