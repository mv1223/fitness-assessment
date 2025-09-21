# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the SAI Fitness Assessment project.

## Workflows

### 1. Simple Project Check (`simple-check.yml`)
- **Trigger**: Push to main/develop branches, Pull requests
- **Purpose**: Basic project validation and structure verification
- **Duration**: ~2-3 minutes
- **What it checks**:
  - Project structure integrity
  - Package.json files existence
  - Dependencies validation
  - React Native setup verification
  - Android/iOS configuration

### 2. CI Pipeline (`ci.yml`)
- **Trigger**: Push to main/develop branches, Pull requests
- **Purpose**: Comprehensive testing and linting
- **Duration**: ~5-10 minutes
- **What it does**:
  - Backend testing and linting
  - Frontend testing and linting
  - Mobile app validation (Expo)
  - Security vulnerability scanning
  - Build verification

### 3. Deploy Pipeline (`deploy.yml`)
- **Trigger**: Push to main branch, Manual dispatch
- **Purpose**: Deployment and artifact generation
- **Duration**: ~10-15 minutes
- **What it does**:
  - Backend deployment package creation
  - Frontend web demo deployment to GitHub Pages
  - Mobile app build generation
  - Artifact upload for releases

## Workflow Status

- ✅ **Simple Check**: Always runs, validates basic project structure
- ⚠️ **CI Pipeline**: May require additional setup for full functionality
- ⚠️ **Deploy Pipeline**: Requires proper secrets and environment setup

## Troubleshooting

### Common Issues

1. **Workflow Fails on Dependencies**
   - Ensure all `package.json` files have valid dependencies
   - Check that `package-lock.json` files exist
   - Verify Node.js version compatibility

2. **Mobile App Build Fails**
   - Ensure Expo CLI is properly configured
   - Check `app.json` configuration
   - Verify React Native dependencies

3. **Backend Tests Fail**
   - Ensure all required environment variables are set
   - Check database connection requirements
   - Verify test configuration

### Getting Help

If workflows continue to fail:
1. Check the Actions tab in your GitHub repository
2. Review the specific step that failed
3. Check the logs for detailed error messages
4. Ensure all dependencies are properly installed locally

## Next Steps

1. **Enable GitHub Pages** (for frontend deployment):
   - Go to Settings → Pages
   - Select "GitHub Actions" as source

2. **Set up Secrets** (if needed for deployment):
   - Go to Settings → Secrets and variables → Actions
   - Add any required API keys or tokens

3. **Configure Branch Protection**:
   - Go to Settings → Branches
   - Add rules to require status checks before merging
