#!/bin/bash

# SAI Fitness Assessment - Setup Script
# This script sets up the development environment for the SAI Fitness Assessment app

echo "🏃‍♂️ SAI Fitness Assessment - Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    print_info "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 16 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -ge 16 ]; then
            print_status "Node.js version is compatible (16+)"
        else
            print_error "Node.js version 16 or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        print_info "Download from: https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_info "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Install React Native CLI
install_react_native_cli() {
    print_info "Installing React Native CLI..."
    if command -v react-native &> /dev/null; then
        print_status "React Native CLI is already installed"
    else
        npm install -g @react-native-community/cli
        print_status "React Native CLI installed successfully"
    fi
}

# Install project dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    npm install
    print_status "Project dependencies installed"
    
    print_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_status "Backend dependencies installed"
}

# Setup iOS (macOS only)
setup_ios() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Setting up iOS dependencies..."
        
        # Check if Xcode is installed
        if command -v xcodebuild &> /dev/null; then
            print_status "Xcode is installed"
        else
            print_warning "Xcode is not installed. iOS development will not be available."
            print_info "Install Xcode from the Mac App Store to enable iOS development."
            return
        fi
        
        # Check if CocoaPods is installed
        if command -v pod &> /dev/null; then
            print_status "CocoaPods is installed"
        else
            print_info "Installing CocoaPods..."
            sudo gem install cocoapods
            print_status "CocoaPods installed"
        fi
        
        # Install iOS dependencies
        cd ios
        pod install
        cd ..
        print_status "iOS dependencies installed"
    else
        print_info "Skipping iOS setup (not on macOS)"
    fi
}

# Setup Android
setup_android() {
    print_info "Setting up Android development environment..."
    
    # Check if Android Studio is installed
    if [ -d "$HOME/Android/Sdk" ]; then
        print_status "Android SDK found"
        
        # Set up environment variables
        if ! grep -q "ANDROID_HOME" ~/.bashrc; then
            echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
            echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
            echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.bashrc
            echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.bashrc
            echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
            print_status "Android environment variables added to ~/.bashrc"
            print_warning "Please restart your terminal or run 'source ~/.bashrc' to apply changes"
        else
            print_status "Android environment variables already configured"
        fi
    else
        print_warning "Android SDK not found. Please install Android Studio and set up the Android SDK."
        print_info "Download Android Studio from: https://developer.android.com/studio"
    fi
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    mkdir -p backend/uploads/videos
    mkdir -p backend/logs
    print_status "Directories created"
}

# Setup environment files
setup_environment() {
    print_info "Setting up environment files..."
    
    # Copy backend environment example
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_status "Backend environment file created"
        print_warning "Please edit backend/.env with your configuration"
    else
        print_status "Backend environment file already exists"
    fi
    
    # Create React Native environment file
    if [ ! -f .env ]; then
        cat > .env << EOF
API_BASE_URL=http://localhost:3000/api
TENSORFLOW_MODEL_URL=https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4
ENABLE_OFFLINE_ANALYSIS=true
CHEAT_DETECTION_ENABLED=true
EOF
        print_status "React Native environment file created"
    else
        print_status "React Native environment file already exists"
    fi
}

# Main setup function
main() {
    echo ""
    print_info "Starting setup process..."
    echo ""
    
    check_nodejs
    check_npm
    install_react_native_cli
    install_dependencies
    create_directories
    setup_environment
    setup_android
    setup_ios
    
    echo ""
    print_status "Setup completed successfully! 🎉"
    echo ""
    print_info "Next steps:"
    echo "1. Edit backend/.env with your configuration"
    echo "2. Start the backend server: cd backend && npm start"
    echo "3. Start the React Native app: npm run android (or npm run ios)"
    echo ""
    print_info "For more information, see README.md"
    echo ""
}

# Run main function
main
