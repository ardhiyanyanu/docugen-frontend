# AWS Cognito Setup Checklist

## ✅ Code Migration Complete

- [x] Removed Stack Auth dependencies
- [x] Added AWS Amplify dependencies  
- [x] Created Cognito configuration files
- [x] Updated all components to use Cognito
- [x] Created authentication pages
- [x] Updated environment variables template
- [x] Created migration documentation

## ⏳ AWS Infrastructure Setup Needed

Follow these steps to complete the setup:

### 1. AWS Cognito User Pool
- [ ] Created User Pool in AWS Console
- [ ] Configured email sign-in
- [ ] Set password policy (min 8 chars, uppercase, lowercase, numbers, special chars)
- [ ] Created App Client (without client secret)
- [ ] Enabled ALLOW_USER_PASSWORD_AUTH flow
- [ ] Noted User Pool ID: `us-east-1_________`
- [ ] Noted Client ID: `________________________`

### 2. AWS Cognito Identity Pool  
- [ ] Created Identity Pool
- [ ] Connected to User Pool
- [ ] Created authenticated IAM role
- [ ] Noted Identity Pool ID: `us-east-1:____-____-____-____-________`

### 3. AWS S3 Bucket
- [ ] Created S3 bucket
- [ ] Bucket name: `docugen-files-____________`
- [ ] Configured CORS for localhost:3000
- [ ] Will add production domain to CORS later

### 4. IAM Permissions
- [ ] Updated authenticated role with S3 permissions
- [ ] Permissions allow: GetObject, PutObject, DeleteObject
- [ ] Permissions scoped to specific bucket

### 5. Environment Variables
- [ ] Copied `.env.local.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- [ ] Set `NEXT_PUBLIC_COGNITO_CLIENT_ID`
- [ ] Set `NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID`
- [ ] Set `NEXT_PUBLIC_AWS_REGION`
- [ ] Set `NEXT_PUBLIC_S3_BUCKET`

### 6. Testing
- [ ] Ran `npm install` successfully
- [ ] Started dev server with `npm run dev`
- [ ] Created test account
- [ ] Verified email
- [ ] Signed in successfully
- [ ] Created Cognito group for team
- [ ] Added user to group via AWS CLI
- [ ] Verified dashboard access

### 7. Team Management
- [ ] Created at least one Cognito group (team)
- [ ] Added test user to group
- [ ] Tested team switching (if multiple groups)
- [ ] Understood team creation requires backend API

## 📚 Documentation Created

- [x] `COGNITO_MIGRATION.md` - Complete migration guide with AWS setup
- [x] `MIGRATION_SUMMARY.md` - Summary of all code changes
- [x] `QUICK_START.md` - Fast setup guide with CLI commands
- [x] `SETUP_CHECKLIST.md` - This file
- [x] Updated `README.md` - Updated project description

## 🚀 Next Steps

### Immediate (Required for basic functionality)
1. [ ] Complete AWS infrastructure setup (steps 1-6 above)
2. [ ] Test sign up/sign in flow
3. [ ] Create and test teams (Cognito groups)

### Short-term (Recommended)
4. [ ] Implement team creation API endpoint
5. [ ] Add file upload UI component
6. [ ] Add file download/list UI
7. [ ] Implement user profile page
8. [ ] Add team invitation system

### Long-term (Production)
9. [ ] Set up Amazon SES for email delivery
10. [ ] Enable MFA for users
11. [ ] Configure CloudWatch monitoring
12. [ ] Set up CI/CD pipeline
13. [ ] Configure production environment
14. [ ] Add custom domain
15. [ ] Implement role-based permissions within teams
16. [ ] Add audit logging

## 🔍 Verification Commands

Check if AWS is configured correctly:

```bash
# Test AWS CLI access
aws sts get-caller-identity

# List your Cognito User Pools
aws cognito-idp list-user-pools --max-results 10

# List groups in your User Pool
aws cognito-idp list-groups --user-pool-id YOUR_POOL_ID

# List users in your User Pool  
aws cognito-idp list-users --user-pool-id YOUR_POOL_ID
```

## 📊 Current Project Status

### ✅ Working
- Authentication UI (sign up/sign in pages)
- AWS Amplify integration
- Cognito configuration
- Landing page
- Basic dashboard structure
- Theme switching
- Responsive design

### ⚠️ Needs AWS Setup
- User registration (needs Cognito User Pool)
- User login (needs Cognito User Pool)
- Team access (needs Cognito Groups)
- File storage (needs S3 bucket)

### 🚧 Needs Implementation
- Team creation from UI (needs backend API)
- File upload component
- File download component
- User profile editing
- Team member management
- Role-based access control within teams

## ⚡ Quick Test After Setup

```bash
# 1. Create a test group
aws cognito-idp create-group \
  --user-pool-id YOUR_POOL_ID \
  --group-name "test-team" \
  --description "Test Team"

# 2. Start the app
npm run dev

# 3. Sign up at http://localhost:3000/auth/signup

# 4. Add yourself to the group (replace with your email)
aws cognito-idp admin-add-user-to-group \
  --user-pool-id YOUR_POOL_ID \
  --username your-email@example.com \
  --group-name "test-team"

# 5. Sign in at http://localhost:3000/auth/signin

# 6. Should redirect to /dashboard/test-team
```

## 📞 Getting Help

**AWS Console:** https://console.aws.amazon.com/
**AWS Documentation:** https://docs.aws.amazon.com/cognito/
**Amplify Documentation:** https://docs.amplify.aws/
**Project Issues:** Check existing GitHub issues or create new one

## 💰 Cost Tracking

Monitor your AWS costs:
- AWS Cost Explorer: https://console.aws.amazon.com/cost-management/home
- Set up billing alerts for unexpected charges
- Free tier covers development usage

Expected monthly cost for development: **$0** (free tier)

---

**Last Updated:** Migration completed, AWS setup pending
**Next Action:** Complete "AWS Infrastructure Setup Needed" section above
