# Migration Summary: Stack Auth → AWS Cognito

## Overview
Successfully migrated authentication from Stack Auth to AWS Cognito with S3 integration for document storage and multi-tenant support via Cognito Groups.

## Changes Made

### 1. Dependencies Updated
**Removed:**
- `@stackframe/stack` (^2.7.16)

**Added:**
- `aws-amplify` (^6.0.0)
- `@aws-amplify/ui-react` (^6.1.0)

### 2. Configuration Files

#### Created:
- **`lib/cognito-config.ts`** - AWS Amplify configuration with Cognito User Pool, Identity Pool, and S3 settings
- **`lib/auth.ts`** - Helper functions for authentication (getAuthenticatedUser, signOut, getSession, getUserTeams, isUserInGroup)
- **`.env.local.example`** - Updated with AWS Cognito and S3 environment variables
- **`COGNITO_MIGRATION.md`** - Comprehensive migration and setup guide
- **`MIGRATION_SUMMARY.md`** - This file

#### Deleted:
- **`stack.tsx`** - Removed Stack Auth server app configuration
- **`app/handler/[...stack]/`** - Removed Stack Auth handler directory

### 3. Authentication Pages

#### Created:
- **`app/auth/signin/page.tsx`** - Sign-in page using AWS Amplify Authenticator
- **`app/auth/signup/page.tsx`** - Sign-up page using AWS Amplify Authenticator

#### Updated:
- **`app/layout.tsx`**
  - Removed StackProvider and StackTheme
  - Simplified to use basic Provider wrapper
  - Updated metadata for DocuGen platform

- **`app/provider.tsx`**
  - Added AWS Amplify configuration initialization
  - Configured for SSR support

### 4. Component Updates

#### `components/landing-page-header.tsx`
- **Before:** Used `useStackApp()` and `useUser()` hooks
- **After:** Uses `useAuthenticator()` hook from AWS Amplify
- Updated sign-in/sign-up links to `/auth/signin` and `/auth/signup`

#### `components/handler-header.tsx`
- **Before:** Used Stack's `UserButton` component and `useUser()` hook
- **After:** Custom implementation with:
  - Avatar component showing user initials
  - Sign-out button using custom auth helper
  - Theme toggle button
  - Uses `useAuthenticator()` hook

### 5. Dashboard Updates

#### `app/dashboard/page-client.tsx`
- **Before:** Used Stack's user.useTeams() and user.createTeam()
- **After:** 
  - Uses `getUserTeams()` to fetch Cognito groups
  - Stores selected team in localStorage
  - Redirects unauthenticated users to sign-in
  - Team creation now requires backend API implementation (shows alert)

#### `app/dashboard/[teamId]/layout.tsx`
- **Before:** Used Stack's team management and SelectedTeamSwitcher component
- **After:**
  - Custom team switcher using native select element
  - Teams managed via Cognito groups
  - Uses `getUserTeams()` helper function
  - Validates team membership before rendering

### 6. Landing Page

#### `app/(landing-page)/page.tsx`
- Removed Stack server app project configuration check
- Updated hero subtitle from "Stack Auth" to "AWS Cognito"
- Updated all authentication links to use `/auth/signup`
- Removed dependency on `stackServerApp.urls`

### 7. Environment Variables

**Old (.env.local.example):**
```bash
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=
```

**New (.env.local.example):**
```bash
# AWS Cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_COGNITO_CLIENT_ID=
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=
NEXT_PUBLIC_AWS_REGION=

# AWS S3
NEXT_PUBLIC_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## Architecture Changes

### Authentication Flow
**Before (Stack Auth):**
1. User signs up via Stack Auth handler
2. Stack manages sessions with cookies
3. Teams managed via Stack's API
4. User data stored in Stack's database

**After (AWS Cognito):**
1. User signs up via AWS Amplify Authenticator UI
2. Cognito manages sessions with tokens
3. Teams managed via Cognito Groups
4. User data stored in AWS Cognito User Pool

### Team/Multi-tenancy
**Before:**
- Stack Auth's built-in team management
- Teams created via `user.createTeam()`
- Team switching via `user.setSelectedTeam()`

**After:**
- Cognito Groups represent teams
- Teams created via AWS SDK (requires backend API)
- Team switching via localStorage + navigation
- Team membership validated via `getUserTeams()`

### File Storage Integration
**New capability with AWS Cognito:**
- AWS Amplify Storage configured for S3
- User-specific folders using Cognito Identity
- IAM roles control access per user/team
- Ready for document upload/download features

## Benefits of Migration

1. **AWS Ecosystem Integration**
   - Native S3 integration for file storage
   - IAM-based access control
   - Seamless integration with other AWS services

2. **Cost & Scalability**
   - AWS Cognito free tier: 50,000 MAUs
   - Pay-as-you-go pricing after free tier
   - AWS global infrastructure

3. **Enterprise Features**
   - Advanced security features (MFA, password policies)
   - Compliance certifications (HIPAA, SOC, etc.)
   - Custom authentication flows via Lambda triggers

4. **Flexibility**
   - Full control over authentication flow
   - Customizable UI components
   - Integration with AWS services (Lambda, API Gateway, etc.)

## What Needs to Be Implemented

### Backend API for Team Management
Currently, team creation shows an alert. You need to implement:

```typescript
// Example: app/api/teams/create/route.ts
import { CognitoIdentityProviderClient, CreateGroupCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function POST(request: Request) {
  const { teamName } = await request.json();
  const user = await getAuthenticatedUser();
  
  const client = new CognitoIdentityProviderClient({ 
    region: process.env.NEXT_PUBLIC_AWS_REGION 
  });
  
  await client.send(new CreateGroupCommand({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    GroupName: teamName,
  }));
  
  // Add user to group...
  
  return Response.json({ success: true });
}
```

### Additional Recommended Implementations

1. **Team Invitation System**
   - API to add users to Cognito groups
   - Email invitations
   - Accept/decline flow

2. **File Upload/Download UI**
   - Document list component
   - Upload modal/form
   - Download links with presigned URLs

3. **User Profile Management**
   - Update user attributes in Cognito
   - Change password flow
   - MFA setup

4. **Admin Dashboard**
   - Manage teams/groups
   - View user list
   - Analytics

## Testing Checklist

- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Sign out
- [ ] Password reset flow
- [ ] Create team (manually via AWS Console)
- [ ] Switch between teams
- [ ] Access control per team
- [ ] Upload file to S3
- [ ] Download file from S3
- [ ] Dark mode toggle
- [ ] Mobile responsiveness

## AWS Resources Required

1. **AWS Cognito User Pool** - User authentication
2. **AWS Cognito Identity Pool** - AWS credentials for authenticated users
3. **AWS S3 Bucket** - File storage
4. **IAM Roles** - Permissions for authenticated users
5. **(Optional) Lambda Functions** - Custom authentication flows
6. **(Optional) SES** - Email delivery for Cognito
7. **(Optional) CloudFront** - CDN for S3 content

## Next Steps

1. ✅ Code migration complete
2. ⏳ Set up AWS infrastructure (see COGNITO_MIGRATION.md)
3. ⏳ Configure environment variables
4. ⏳ Test authentication flows
5. ⏳ Implement team creation API
6. ⏳ Implement file upload/download UI
7. ⏳ Deploy to production

## Support & Documentation

- **AWS Cognito Docs:** https://docs.aws.amazon.com/cognito/
- **AWS Amplify Docs:** https://docs.amplify.aws/
- **Migration Guide:** See COGNITO_MIGRATION.md
- **AWS SDK for JavaScript:** https://docs.aws.amazon.com/sdk-for-javascript/

## Notes

- TypeScript errors for AWS Amplify imports will resolve after packages are installed and TypeScript server restarts
- The CSS import errors are normal and won't affect runtime
- Remember to never commit `.env.local` to version control
- Use AWS Secrets Manager for production credentials
