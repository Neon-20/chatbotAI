#!/bin/bash

# DomusAI Documentation Deployment Script
# This script builds and deploys the documentation website

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
BUILD_DIR="out"
DEPLOY_BRANCH="gh-pages"
REPO_URL="https://github.com/your-org/chatbotAI.git"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    log_success "All dependencies are satisfied"
}

install_dependencies() {
    log_info "Installing documentation dependencies..."
    
    cd "$DOCS_DIR"
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
    log_success "Dependencies installed successfully"
}

build_docs() {
    log_info "Building documentation..."
    
    cd "$DOCS_DIR"
    
    # Clean previous build
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Cleaned previous build"
    fi
    
    # Build the documentation
    npm run build
    npm run export
    
    # Verify build output
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "Build failed - output directory not found"
        exit 1
    fi
    
    # Check if index.html exists
    if [ ! -f "$BUILD_DIR/index.html" ]; then
        log_error "Build failed - index.html not found"
        exit 1
    fi
    
    cd ..
    log_success "Documentation built successfully"
}

deploy_to_github_pages() {
    log_info "Deploying to GitHub Pages..."
    
    # Check if gh-pages is installed
    if ! npm list -g gh-pages &> /dev/null; then
        log_info "Installing gh-pages globally..."
        npm install -g gh-pages
    fi
    
    cd "$DOCS_DIR"
    
    # Deploy to GitHub Pages
    npx gh-pages -d "$BUILD_DIR" -b "$DEPLOY_BRANCH" -m "Deploy documentation $(date)"
    
    cd ..
    log_success "Documentation deployed to GitHub Pages"
}

deploy_to_vercel() {
    log_info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd "$DOCS_DIR"
    
    # Deploy to Vercel
    vercel --prod
    
    cd ..
    log_success "Documentation deployed to Vercel"
}

deploy_to_netlify() {
    log_info "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        log_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    cd "$DOCS_DIR"
    
    # Deploy to Netlify
    netlify deploy --prod --dir="$BUILD_DIR"
    
    cd ..
    log_success "Documentation deployed to Netlify"
}

validate_build() {
    log_info "Validating build..."
    
    cd "$DOCS_DIR/$BUILD_DIR"
    
    # Check for common issues
    local issues=0
    
    # Check for broken internal links
    if command -v htmlproofer &> /dev/null; then
        log_info "Checking for broken links..."
        if ! htmlproofer . --disable-external --check-html; then
            log_warning "Found broken internal links"
            issues=$((issues + 1))
        fi
    else
        log_warning "htmlproofer not found - skipping link validation"
    fi
    
    # Check file sizes
    log_info "Checking file sizes..."
    find . -name "*.html" -size +1M -exec echo "Large HTML file: {}" \;
    find . -name "*.js" -size +500k -exec echo "Large JS file: {}" \;
    find . -name "*.css" -size +100k -exec echo "Large CSS file: {}" \;
    
    # Check for missing assets
    log_info "Checking for missing assets..."
    if [ ! -f "favicon.ico" ] && [ ! -f "_next/static/favicon.ico" ]; then
        log_warning "Favicon not found"
        issues=$((issues + 1))
    fi
    
    cd ../..
    
    if [ $issues -eq 0 ]; then
        log_success "Build validation passed"
    else
        log_warning "Build validation completed with $issues issues"
    fi
}

cleanup() {
    log_info "Cleaning up..."
    
    cd "$DOCS_DIR"
    
    # Remove build artifacts
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Removed build directory"
    fi
    
    # Remove node_modules if specified
    if [ "$CLEAN_DEPS" = "true" ]; then
        if [ -d "node_modules" ]; then
            rm -rf "node_modules"
            log_info "Removed node_modules"
        fi
    fi
    
    cd ..
    log_success "Cleanup completed"
}

show_help() {
    echo "DomusAI Documentation Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS] [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build           Build documentation only"
    echo "  deploy-gh       Deploy to GitHub Pages"
    echo "  deploy-vercel   Deploy to Vercel"
    echo "  deploy-netlify  Deploy to Netlify"
    echo "  validate        Validate build output"
    echo "  clean           Clean build artifacts"
    echo "  help            Show this help message"
    echo ""
    echo "Options:"
    echo "  --clean-deps    Remove node_modules after deployment"
    echo "  --skip-build    Skip build step (use existing build)"
    echo "  --skip-install  Skip dependency installation"
    echo "  --verbose       Enable verbose output"
    echo ""
    echo "Examples:"
    echo "  $0 build                    # Build documentation"
    echo "  $0 deploy-gh               # Build and deploy to GitHub Pages"
    echo "  $0 deploy-vercel --clean-deps  # Deploy to Vercel and clean up"
    echo ""
}

# Parse command line arguments
COMMAND=""
SKIP_BUILD=false
SKIP_INSTALL=false
CLEAN_DEPS=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        build|deploy-gh|deploy-vercel|deploy-netlify|validate|clean|help)
            COMMAND="$1"
            shift
            ;;
        --clean-deps)
            CLEAN_DEPS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            set -x
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Default command
if [ -z "$COMMAND" ]; then
    COMMAND="help"
fi

# Main execution
main() {
    log_info "Starting DomusAI documentation deployment..."
    log_info "Command: $COMMAND"
    
    case $COMMAND in
        build)
            check_dependencies
            if [ "$SKIP_INSTALL" = false ]; then
                install_dependencies
            fi
            build_docs
            validate_build
            ;;
        deploy-gh)
            check_dependencies
            if [ "$SKIP_INSTALL" = false ]; then
                install_dependencies
            fi
            if [ "$SKIP_BUILD" = false ]; then
                build_docs
            fi
            validate_build
            deploy_to_github_pages
            if [ "$CLEAN_DEPS" = true ]; then
                cleanup
            fi
            ;;
        deploy-vercel)
            check_dependencies
            if [ "$SKIP_INSTALL" = false ]; then
                install_dependencies
            fi
            if [ "$SKIP_BUILD" = false ]; then
                build_docs
            fi
            validate_build
            deploy_to_vercel
            if [ "$CLEAN_DEPS" = true ]; then
                cleanup
            fi
            ;;
        deploy-netlify)
            check_dependencies
            if [ "$SKIP_INSTALL" = false ]; then
                install_dependencies
            fi
            if [ "$SKIP_BUILD" = false ]; then
                build_docs
            fi
            validate_build
            deploy_to_netlify
            if [ "$CLEAN_DEPS" = true ]; then
                cleanup
            fi
            ;;
        validate)
            if [ ! -d "$DOCS_DIR/$BUILD_DIR" ]; then
                log_error "Build directory not found. Run 'build' command first."
                exit 1
            fi
            validate_build
            ;;
        clean)
            cleanup
            ;;
        help)
            show_help
            ;;
        *)
            log_error "Unknown command: $COMMAND"
            show_help
            exit 1
            ;;
    esac
    
    log_success "Documentation deployment completed successfully!"
}

# Trap to ensure cleanup on exit
trap 'log_error "Script interrupted"; exit 1' INT TERM

# Run main function
main
