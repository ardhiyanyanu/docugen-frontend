# AWS Cognito Migration Guide

This project has been migrated from Stack Auth to AWS Cognito for authentication. This guide explains the changes and how to set up AWS Cognito.

## What Changed

### Dependencies
- **Removed**: `@stackframe/stack`
- **Added**: `aws-amplify`, `@aws-amplify/ui-react`

### File Changes

#### New Files
- `lib/cognito-config.ts` - AWS Amplify configuration for Cognito
- `lib/auth.ts` - Authentication utility functions
- `app/auth/signin/page.tsx` - Sign-in page using Cognito
- `app/auth/signup/page.tsx` - Sign-up page using Cognito

#### Deleted Files
- `stack.tsx` - Removed Stack Auth configuration
- `app/handler/[...stack]/` - Removed Stack Auth handler pages

#### Modified Files
- `package.json` - Updated dependencies
- `.env.local.example` - Updated environment variables
- `app/provider.tsx` - Now uses AWS Amplify configuration
- `components/landing-page-header.tsx` - Uses `useAuthenticator` hook
- `components/handler-header.tsx` - Custom user menu with Cognito
- `app/dashboard/page-client.tsx` - Uses Cognito groups for teams
- `app/dashboard/[teamId]/layout.tsx` - Team management via Cognito groups
- `app/(landing-page)/page.tsx` - Updated auth links

## AWS Setup Required

### 1. Create AWS Cognito User Pool

1. Go to AWS Console → Cognito
2. Click "Create user pool"
3. Configure sign-in options:
   - Select "Email" as sign-in option
   - Enable "Email" as required attribute
4. Configure password policy (must match config in `lib/cognito-config.ts`):
   - Minimum length: 8
   - Require lowercase, uppercase, numbers, and special characters
5. Configure MFA (optional but recommended)
6. Enable self-registration
7. Configure email delivery (use Amazon SES for production)
8. Create app client:
   - **Don't generate a client secret** (for web apps)
   - Enable "ALLOW_USER_PASSWORD_AUTH" auth flow
9. Note the following values:
   - User Pool ID (us-east-1_XXXXXXXXX)
   - Client ID
   - Region

### 2. Create Identity Pool (for S3 access)

1. Go to AWS Console → Cognito → Identity Pools
2. Click "Create identity pool"
3. Enable "Authenticated access"
4. Connect to your User Pool created above
5. Configure IAM roles for authenticated users with S3 access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/${cognito-identity.amazonaws.com:sub}/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME",
      "Condition": {
        "StringLike": {
          "s3:prefix": "${cognito-identity.amazonaws.com:sub}/*"
        }
      }
    }
  ]
}
```

6. Note the Identity Pool ID

### 3. Create S3 Bucket

1. Create an S3 bucket for file storage
2. Enable CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION=us-east-1

# AWS S3 Configuration (for file upload/download)
NEXT_PUBLIC_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## Team Management with Cognito Groups

### Creating Teams

Teams are implemented using Cognito Groups. To create a team:

1. Go to AWS Console → Cognito → User Pools → Your Pool → Groups
2. Click "Create group"
3. Enter group name (this will be the team ID)
4. Optionally set precedence and description
5. Assign IAM role if needed

### Adding Users to Teams

1. Go to Groups → Select group → Add users
2. Or use AWS CLI:

```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id YOUR_USER_POOL_ID \
  --username user@example.com \
  --group-name team-name
```

### Programmatic Team Creation

To enable users to create teams from the UI, you'll need to implement a backend API that:

1. Calls AWS Cognito API to create a new group
2. Adds the user to that group

Example Lambda function or API route:

```typescript
import { CognitoIdentityProviderClient, CreateGroupCommand, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function createTeam(userEmail: string, teamName: string) {
  const client = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_AWS_REGION });
  
  // Create group
  await client.send(new CreateGroupCommand({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    GroupName: teamName,
    Description: `Team: ${teamName}`,
  }));
  
  // Add user to group
  await client.send(new AdminAddUserToGroupCommand({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    Username: userEmail,
    GroupName: teamName,
  }));
}
```

## Authentication Usage

### Client Components

```typescript
import { useAuthenticator } from '@aws-amplify/ui-react';

export function MyComponent() {
  const { user, signOut } = useAuthenticator();
  
  if (user) {
    return <div>Welcome {user.signInDetails?.loginId}</div>;
  }
  
  return <a href="/auth/signin">Sign In</a>;
}
```

### Server Components / API Routes

```typescript
import { getAuthenticatedUser, getUserTeams } from '@/lib/auth';

export async function GET() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const teams = await getUserTeams();
  
  return Response.json({ user, teams });
}
```

## S3 File Upload/Download

The project is configured with AWS Amplify Storage for S3 access. Users will have access to their own folder based on their Cognito identity.

### Upload File

```typescript
import { uploadData } from 'aws-amplify/storage';

async function uploadFile(file: File) {
  try {
    const result = await uploadData({
      path: `documents/${file.name}`,
      data: file,
      options: {
        contentType: file.type,
      }
    }).result;
    
    console.log('Upload success:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}
```

### Download File

```typescript
import { getUrl } from 'aws-amplify/storage';

async function getDownloadUrl(key: string) {
  try {
    const { url } = await getUrl({
      path: key,
      options: {
        validateObjectExistence: true,
        expiresIn: 3600, // 1 hour
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error('Get URL error:', error);
  }
}
```

## Migration Checklist

- [ ] Create AWS Cognito User Pool
- [ ] Create AWS Cognito Identity Pool
- [ ] Create S3 bucket with CORS configuration
- [ ] Set up IAM roles for authenticated users
- [ ] Configure environment variables
- [ ] Run `npm install`
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Create test teams (Cognito groups)
- [ ] Test team switching
- [ ] Test S3 file upload
- [ ] Test S3 file download
- [ ] Implement team creation API (optional)

## Known Differences from Stack Auth

1. **Team Creation**: Stack Auth had built-in team creation. With Cognito, you need to implement this via AWS SDK or manage teams manually in AWS Console.

2. **User Management UI**: Stack Auth provided a dashboard. With Cognito, use AWS Console or build custom admin pages.

3. **Social OAuth**: Stack Auth simplified OAuth setup. With Cognito, you need to configure identity providers in the User Pool settings.

4. **Pricing**: Cognito has a free tier (50,000 MAUs), then pay-per-user. Stack Auth pricing was different.

5. **Multi-region**: Cognito is region-specific. For global apps, consider Cognito global sign-in or multiple user pools.

## Support

For issues specific to:
- **AWS Cognito**: Check [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- **AWS Amplify**: Check [Amplify Documentation](https://docs.amplify.aws/)
- **This Migration**: Open an issue on GitHub

## Next Steps

1. Complete AWS setup following this guide
2. Test authentication flows
3. Implement team creation API if needed
4. Configure social OAuth providers if needed
5. Set up production environment variables
6. Deploy to your hosting platform
