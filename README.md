# Next.js Multi-tenant Document Generation Platform

A minimalistic multi-tenant Next.js starter template with AWS Cognito authentication and S3 integration for document storage.

> **Note**: This project has been migrated from Stack Auth to AWS Cognito. See [COGNITO_MIGRATION.md](./COGNITO_MIGRATION.md) for detailed migration guide.

## Landing Page

<div align="center">
<img src="./assets/landing-page.png" alt="Teams" width="600"/>
</div>

## Dashboard

<div align="center">
<img src="./assets/dashboard-overview.png" alt="Teams" width="600"/>
</div>

## Multi-tenancy (Teams)

<div align="center">
<img src="./assets/team-switcher.png" alt="Teams" width="400"/>
</div>

## Account Settings

<div align="center">
<img src="./assets/account-settings.png" alt="Teams" width="500"/>
</div>

## Getting Started

1. Clone the repository

    ```bash
    git clone git@github.com:stack-auth/stack-template.git
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up AWS Cognito and S3

    Follow the detailed setup guide in [COGNITO_MIGRATION.md](./COGNITO_MIGRATION.md) to:
    - Create AWS Cognito User Pool
    - Create AWS Cognito Identity Pool  
    - Set up S3 bucket for file storage
    - Configure IAM roles
    - Set environment variables

4. Copy `.env.local.example` to `.env.local` and fill in your AWS credentials

    ```bash
    cp .env.local.example .env.local
    ```

5. Start the development server and go to [http://localhost:3000](http://localhost:3000)

    ```bash
    npm run dev 
    ```

## Features & Tech Stack

- Next.js 14 app router
- TypeScript
- Tailwind & Shadcn UI
- AWS Cognito authentication
- AWS S3 for file storage
- Multi-tenancy via Cognito Groups (teams/orgs)
- Dark mode
- AWS Amplify integration

## Inspired by

- [Shadcn UI](https://github.com/shadcn-ui/ui)
- [Shadcn Taxonomy](https://github.com/shadcn-ui/taxonomy)
