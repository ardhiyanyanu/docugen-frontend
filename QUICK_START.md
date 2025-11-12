# Quick Start Guide - AWS Cognito Setup

## Prerequisites
- AWS Account
- AWS CLI installed (optional but recommended)
- Node.js and npm installed

## 1. Create Cognito User Pool (5 minutes)

```bash
# Via AWS Console
1. Go to: https://console.aws.amazon.com/cognito/
2. Click "Create user pool"
3. Sign-in options: ✓ Email
4. Password policy: Min 8 chars, require uppercase, lowercase, numbers, special chars
5. MFA: Optional (recommended: Optional MFA)
6. User account recovery: ✓ Email only
7. Self-registration: ✓ Enable
8. Email: Amazon SES or Cognito (use Cognito for testing)
9. App client: 
   - Name: docugen-web-client
   - ❌ DON'T generate client secret
   - ✓ ALLOW_USER_PASSWORD_AUTH
10. Save User Pool ID and Client ID
```

## 2. Create Identity Pool (3 minutes)

```bash
# Via AWS Console
1. Cognito → Identity pools → Create identity pool
2. Enable "Authenticated access"
3. Authentication providers → Amazon Cognito user pool
   - User pool ID: [from step 1]
   - App client ID: [from step 1]
4. IAM roles → Create new roles (basic role for now)
5. Save Identity Pool ID
```

## 3. Create S3 Bucket (2 minutes)

```bash
# Via AWS CLI
aws s3 mb s3://docugen-files-[YOUR-UNIQUE-ID] --region us-east-1

# Or via Console
1. S3 → Create bucket
2. Name: docugen-files-[YOUR-UNIQUE-ID]
3. Region: us-east-1 (match your Cognito region)
4. Block all public access: ✓ (keep enabled)
5. Versioning: Optional
6. Create bucket
```

## 4. Configure S3 CORS

```bash
# Via AWS Console: S3 → Your bucket → Permissions → CORS
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## 5. Set Up IAM Role for S3 Access

```bash
# Edit the authenticated role created by Identity Pool
# IAM → Roles → [Your Identity Pool Auth Role] → Add permissions

Policy JSON:
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
      "Resource": "arn:aws:s3:::docugen-files-[YOUR-ID]/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::docugen-files-[YOUR-ID]"
    }
  ]
}
```

## 6. Configure Environment Variables

```bash
cd /home/ardhiyan/code/docugen-frontend
cp .env.local.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_S3_BUCKET=docugen-files-[YOUR-UNIQUE-ID]
```

## 7. Create Your First Team (Cognito Group)

```bash
# Via AWS CLI
aws cognito-idp create-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --group-name "my-first-team" \
  --description "My First Team"

# Or via Console
Cognito → User pools → Your pool → Groups → Create group
```

## 8. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 9. Test the Flow

1. Click "Get Started" or "Sign Up"
2. Create an account with your email
3. Verify email (check spam folder)
4. Sign in
5. You'll see "Create a team" message
6. Add yourself to the group you created:

```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username your-email@example.com \
  --group-name "my-first-team"
```

7. Refresh the page - you should see the dashboard!

## Troubleshooting

### Can't sign up?
- Check User Pool allows self-registration
- Check password meets policy requirements
- Check email delivery settings

### Can't see teams after signing in?
- Make sure you created a Cognito group
- Make sure you added your user to the group
- Check browser console for errors

### File upload not working?
- Verify S3 bucket exists
- Check CORS configuration
- Verify IAM role has S3 permissions
- Check Identity Pool is connected to User Pool

### TypeScript errors?
- Run: `npm install`
- Restart VS Code or TypeScript server
- Errors are expected until packages are installed

## Useful AWS CLI Commands

```bash
# List users
aws cognito-idp list-users --user-pool-id us-east-1_XXXXXXXXX

# List groups
aws cognito-idp list-groups --user-pool-id us-east-1_XXXXXXXXX

# Add user to group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username user@example.com \
  --group-name team-name

# Remove user from group
aws cognito-idp admin-remove-user-from-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username user@example.com \
  --group-name team-name

# Delete user (testing only)
aws cognito-idp admin-delete-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username user@example.com
```

## Cost Estimate (Free Tier)

- **Cognito User Pool:** Free for first 50,000 MAUs
- **Identity Pool:** Free
- **S3 Storage:** Free for first 5GB
- **S3 Requests:** Free for first 20,000 GET and 2,000 PUT requests

Total for development: **$0/month** (within free tier)

## Production Checklist

- [ ] Use Amazon SES for email delivery
- [ ] Enable MFA for users
- [ ] Set up custom domain for Cognito hosted UI (optional)
- [ ] Configure AWS WAF for API protection
- [ ] Set up CloudWatch alarms
- [ ] Use AWS Secrets Manager for credentials
- [ ] Enable S3 versioning and lifecycle policies
- [ ] Configure backup for User Pool
- [ ] Set up multiple environments (dev, staging, prod)
- [ ] Review IAM policies (principle of least privilege)

## Need Help?

- **Full Migration Guide:** COGNITO_MIGRATION.md
- **Code Changes:** MIGRATION_SUMMARY.md
- **AWS Support:** https://console.aws.amazon.com/support/
- **Amplify Discord:** https://discord.gg/amplify
