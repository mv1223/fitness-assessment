@echo off
REM SAI Fitness Assessment - Windows Setup Script
REM This script sets up the development environment for the SAI Fitness Assessment app

echo.
echo 🏃‍♂️ SAI Fitness Assessment - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
echo ℹ️  Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    echo ℹ️  Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js is installed: %NODE_VERSION%
)

REM Check if npm is installed
echo ℹ️  Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm is installed: %NPM_VERSION%
)

REM Install React Native CLI
echo ℹ️  Installing React Native CLI...
react-native --version >nul 2>&1
if %errorlevel% neq 0 (
    npm install -g @react-native-community/cli
    echo ✅ React Native CLI installed successfully
) else (
    echo ✅ React Native CLI is already installed
)

REM Install project dependencies
echo ℹ️  Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install project dependencies
    pause
    exit /b 1
)
echo ✅ Project dependencies installed

REM Install backend dependencies
echo ℹ️  Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed

REM Create necessary directories
echo ℹ️  Creating necessary directories...
if not exist "backend\uploads\videos" mkdir "backend\uploads\videos"
if not exist "backend\logs" mkdir "backend\logs"
echo ✅ Directories created

REM Setup environment files
echo ℹ️  Setting up environment files...

REM Copy backend environment example
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo ✅ Backend environment file created
    echo ⚠️  Please edit backend\.env with your configuration
) else (
    echo ✅ Backend environment file already exists
)

REM Create React Native environment file
if not exist ".env" (
    echo API_BASE_URL=http://localhost:3000/api > .env
    echo TENSORFLOW_MODEL_URL=https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4 >> .env
    echo ENABLE_OFFLINE_ANALYSIS=true >> .env
    echo CHEAT_DETECTION_ENABLED=true >> .env
    echo ✅ React Native environment file created
) else (
    echo ✅ React Native environment file already exists
)

REM Check Android setup
echo ℹ️  Checking Android development environment...
if exist "%ANDROID_HOME%" (
    echo ✅ Android SDK found
) else (
    echo ⚠️  Android SDK not found. Please install Android Studio and set up the Android SDK.
    echo ℹ️  Download Android Studio from: https://developer.android.com/studio
    echo ℹ️  After installation, set ANDROID_HOME environment variable
)

echo.
echo ✅ Setup completed successfully! 🎉
echo.
echo ℹ️  Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Start the backend server: cd backend ^&^& npm start
echo 3. Start the React Native app: npm run android
echo.
echo ℹ️  For more information, see README.md
echo.
pause
