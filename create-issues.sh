#!/bin/bash

# ============================================
# TrailGame - GitHub Issues Auto-Creation Script
# ============================================
# This script creates all GitHub issues for TrailGame project
# Prerequisites: GitHub CLI installed and authenticated
# Usage: ./create-issues.sh

# ============================================
# CONFIGURATION
# ============================================
REPO="georgemathenge/trail-game"  # ⬅️ CHANGE THIS to your repo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 TrailGame - GitHub Issues Creator${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}❌ GitHub CLI not found. Please install it first:${NC}"
    echo "   Visit: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}❌ Not authenticated. Running gh auth login...${NC}"
    gh auth login
fi

echo -e "${GREEN}✅ GitHub CLI ready${NC}\n"

# ============================================
# CREATE LABELS FIRST
# ============================================
echo -e "${BLUE}📋 Creating labels...${NC}"

# Priority Labels
gh label create "P0: Critical" --color "d73a4a" --description "Critical priority" --force 2>/dev/null
gh label create "P1: High" --color "ff9800" --description "High priority" --force 2>/dev/null
gh label create "P2: Medium" --color "ffeb3b" --description "Medium priority" --force 2>/dev/null
gh label create "P3: Low" --color "4caf50" --description "Low priority" --force 2>/dev/null

# Type Labels
gh label create "feature" --color "0e8a16" --description "New feature" --force 2>/dev/null
gh label create "bug" --color "d73a4a" --description "Bug report" --force 2>/dev/null
gh label create "testing" --color "1d76db" --description "Testing related" --force 2>/dev/null
gh label create "documentation" --color "0075ca" --description "Documentation" --force 2>/dev/null

# Module Labels
gh label create "database" --color "7057ff" --description "Database module" --force 2>/dev/null
gh label create "auth" --color "e99695" --description "Authentication module" --force 2>/dev/null
gh label create "backend" --color "fbca04" --description "Backend API" --force 2>/dev/null
gh label create "user-management" --color "c5def5" --description "User management" --force 2>/dev/null
gh label create "location" --color "5319e7" --description "Location management" --force 2>/dev/null
gh label create "game-management" --color "0052cc" --description "Game management" --force 2>/dev/null
gh label create "payment" --color "006b75" --description "Payment system" --force 2>/dev/null
gh label create "dashboard" --color "c2e0c6" --description "Creator dashboard" --force 2>/dev/null

# Phase Labels
gh label create "phase-1-foundation" --color "1d76db" --description "Phase 1: Foundation" --force 2>/dev/null
gh label create "phase-2-core" --color "0e8a16" --description "Phase 2: Core Features" --force 2>/dev/null
gh label create "phase-3-payment" --color "fbca04" --description "Phase 3: Payment" --force 2>/dev/null
gh label create "phase-4-execution" --color "d876e3" --description "Phase 4: Game Execution" --force 2>/dev/null

echo -e "${GREEN}✅ Labels created${NC}\n"

# ============================================
# CREATE MILESTONES
# ============================================
echo -e "${BLUE}📅 Creating milestones...${NC}"

gh api repos/$REPO/milestones -f title="Phase 1: Foundation" -f description="Weeks 1-4: Database, API, Auth" -f due_on="2026-02-28T00:00:00Z" 2>/dev/null
gh api repos/$REPO/milestones -f title="Phase 2: Core Features" -f description="Weeks 5-8: Game creation, locations" -f due_on="2026-03-31T00:00:00Z" 2>/dev/null
gh api repos/$REPO/milestones -f title="Phase 3: Payment" -f description="Weeks 9-11: Registration, payments" -f due_on="2026-04-30T00:00:00Z" 2>/dev/null
gh api repos/$REPO/milestones -f title="Phase 4: Execution" -f description="Weeks 12-14: Gameplay features" -f due_on="2026-05-31T00:00:00Z" 2>/dev/null

echo -e "${GREEN}✅ Milestones created${NC}\n"

# ============================================
# CREATE ISSUES
# ============================================
echo -e "${BLUE}📝 Creating issues...${NC}\n"

# ============================================
# ISSUE #1: Database Schema Design
# ============================================
gh issue create \
  --title "[DATABASE] Design and implement complete database schema" \
  --body "## 📋 Description
Design and implement the complete PostgreSQL database schema for TrailGame.

## 🎯 Module Reference
**Module:** 1.1.1 - Database Schema Design
**Dependencies:** None - This is the foundation
**Phase:** Phase 1

## ✅ Acceptance Criteria
- [ ] All 10 core tables created (users, games, locations, trails, registrations, payments, reviews, teams, checkpoints, check_ins)
- [ ] All foreign keys and relationships defined
- [ ] All constraints and indexes added
- [ ] Triggers for auto-updating timestamps
- [ ] Seed data for testing
- [ ] Schema documented

## 📝 Implementation Checklist
- [ ] Create schema.sql file
- [ ] Add UUID extension
- [ ] Create all tables with proper data types
- [ ] Add foreign key constraints
- [ ] Add check constraints
- [ ] Create indexes for performance
- [ ] Create triggers for updated_at
- [ ] Create views for common queries
- [ ] Add seed data (admin user, test location)
- [ ] Document schema relationships

## 🔗 Related Issues
None - This is the foundation

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,database,phase-1-foundation" \
  --milestone "Phase 1: Foundation"

echo -e "${GREEN}✅ Issue #1 created${NC}"

# ============================================
# ISSUE #2: Database Migrations Setup
# ============================================
gh issue create \
  --title "[DATABASE] Set up Prisma migrations" \
  --body "## 📋 Description
Set up Prisma ORM and migration system.

## 🎯 Module Reference
**Module:** 1.1.2 - Database Migrations Setup
**Dependencies:** #1 (Database schema design)
**Phase:** Phase 1

## ✅ Acceptance Criteria
- [ ] Prisma installed and configured
- [ ] schema.prisma matches database schema
- [ ] Initial migration created
- [ ] Migration scripts working
- [ ] Prisma Client generated

## 📝 Implementation Checklist
- [ ] Install Prisma CLI and Client
- [ ] Create prisma/schema.prisma
- [ ] Define all models
- [ ] Run prisma migrate dev
- [ ] Generate Prisma Client
- [ ] Test database connection
- [ ] Document migration workflow

## 🔗 Related Issues
- Depends on: #1

## ⏱️ Estimated Time
3 days" \
  --label "feature,P0: Critical,database,phase-1-foundation" \
  --milestone "Phase 1: Foundation"

echo -e "${GREEN}✅ Issue #2 created${NC}"

# ============================================
# ISSUE #3: API Server Setup
# ============================================
gh issue create \
  --title "[API] Set up NestJS server with basic configuration" \
  --body "## 📋 Description
Initialize NestJS application with core configuration.

## 🎯 Module Reference
**Module:** 1.2.1 - API Server Setup
**Dependencies:** None
**Phase:** Phase 1

## ✅ Acceptance Criteria
- [ ] NestJS application initialized
- [ ] Environment configuration working
- [ ] CORS configured
- [ ] Error handling middleware
- [ ] Logging setup
- [ ] API running on port 3000

## 📝 Implementation Checklist
- [ ] Run nest new trail-game-api
- [ ] Install dependencies (@nestjs/config, etc.)
- [ ] Configure .env file
- [ ] Set up global error filter
- [ ] Configure CORS
- [ ] Add request logging (Morgan/Winston)
- [ ] Add rate limiting
- [ ] Add validation pipe globally
- [ ] Test server starts successfully

## 🔗 Related Issues
None

## ⏱️ Estimated Time
3 days" \
  --label "feature,P0: Critical,backend,phase-1-foundation" \
  --milestone "Phase 1: Foundation"

echo -e "${GREEN}✅ Issue #3 created${NC}"

# ============================================
# ISSUE #4: Authentication & Authorization
# ============================================
gh issue create \
  --title "[AUTH] Implement JWT authentication system" \
  --body "## 📋 Description
Complete authentication system with JWT, registration, login, and role-based access.

## 🎯 Module Reference
**Module:** 1.2.2 - Authentication & Authorization
**Dependencies:** #2 (Database migrations), #3 (API server setup)
**Phase:** Phase 1

## ✅ Acceptance Criteria
- [ ] User registration endpoint
- [ ] Login endpoint returns JWT
- [ ] Password hashing with bcrypt
- [ ] JWT authentication guard
- [ ] Role-based authorization guard
- [ ] Token expiration working
- [ ] Protected routes working

## 📝 Implementation Checklist
- [ ] Install JWT and Passport dependencies
- [ ] Create RegisterDto and LoginDto
- [ ] Implement AuthService (register, login, validate)
- [ ] Create JwtStrategy
- [ ] Create JwtAuthGuard
- [ ] Create RolesGuard
- [ ] Create @CurrentUser decorator
- [ ] Create @Roles decorator
- [ ] Create AuthController endpoints
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test role-based access

## 🔗 Related Issues
- Depends on: #2, #3

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,auth,phase-1-foundation" \
  --milestone "Phase 1: Foundation"

echo -e "${GREEN}✅ Issue #4 created${NC}"

# ============================================
# ISSUE #5: Cloud Storage Integration
# ============================================
gh issue create \
  --title "[STORAGE] Implement file upload with AWS S3/Cloudinary" \
  --body "## 📋 Description
Set up cloud file storage for images and documents.

## 🎯 Module Reference
**Module:** 1.3.1 - Cloud Storage Integration
**Dependencies:** #3 (API server setup)
**Phase:** Phase 1

## ✅ Acceptance Criteria
- [ ] File upload endpoint working
- [ ] Images stored in cloud storage
- [ ] Secure URLs generated
- [ ] File validation (type, size)
- [ ] Image optimization

## 📝 Implementation Checklist
- [ ] Choose storage provider (S3 or Cloudinary)
- [ ] Install SDK
- [ ] Configure credentials
- [ ] Create upload endpoint
- [ ] Add file type validation
- [ ] Add file size limits
- [ ] Implement image compression
- [ ] Generate secure URLs
- [ ] Test file upload
- [ ] Test file retrieval

## 🔗 Related Issues
- Depends on: #3

## ⏱️ Estimated Time
3 days" \
  --label "feature,P1: High,backend,phase-1-foundation" \
  --milestone "Phase 1: Foundation"

echo -e "${GREEN}✅ Issue #5 created${NC}"

# ============================================
# ISSUE #6: User Profile Management
# ============================================
gh issue create \
  --title "[USER] User profile CRUD operations" \
  --body "## 📋 Description
Implement user profile management endpoints.

## 🎯 Module Reference
**Module:** 2.1.1 - User Profile Management
**Dependencies:** #4 (Authentication), #5 (File storage)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Get user profile endpoint
- [ ] Update user profile endpoint
- [ ] Avatar upload
- [ ] Email verification flow
- [ ] User preferences management

## 📝 Implementation Checklist
- [ ] Create UserService
- [ ] Create UserController
- [ ] Implement getUserProfile()
- [ ] Implement updateProfile()
- [ ] Implement uploadAvatar()
- [ ] Add email verification token generation
- [ ] Add email verification endpoint
- [ ] Implement sendVerificationEmail()
- [ ] Add user preferences schema
- [ ] Test all endpoints

## 🔗 Related Issues
- Depends on: #4, #5

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,user-management,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #6 created${NC}"

# ============================================
# ISSUE #7: User Roles & Permissions
# ============================================
gh issue create \
  --title "[USER] Implement role management system" \
  --body "## 📋 Description
Role assignment and permission checks.

## 🎯 Module Reference
**Module:** 2.1.2 - User Roles & Permissions
**Dependencies:** #4 (Authentication), #6 (User profile)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Player role default on registration
- [ ] Creator upgrade endpoint
- [ ] Admin role assignment
- [ ] Permission checks working
- [ ] Role-based UI rendering

## 📝 Implementation Checklist
- [ ] Create upgradeToCreator() endpoint
- [ ] Add creator verification process
- [ ] Implement permission checks
- [ ] Add role switching logic
- [ ] Test role transitions
- [ ] Document permissions matrix

## 🔗 Related Issues
- Depends on: #4, #6

## ⏱️ Estimated Time
3 days" \
  --label "feature,P1: High,user-management,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #7 created${NC}"

# ============================================
# ISSUE #8: Location CRUD
# ============================================
gh issue create \
  --title "[LOCATION] Location management endpoints" \
  --body "## 📋 Description
Create, read, update, delete locations (trail systems).

## 🎯 Module Reference
**Module:** 3.1.1 - Location CRUD
**Dependencies:** #4 (Authentication), #5 (File storage)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Create location endpoint
- [ ] List locations with filters
- [ ] Get location details
- [ ] Update location
- [ ] Delete location (soft delete)
- [ ] Location search working

## 📝 Implementation Checklist
- [ ] Create LocationService
- [ ] Create LocationController
- [ ] Implement createLocation()
- [ ] Implement findAll() with pagination
- [ ] Implement findOne()
- [ ] Implement update()
- [ ] Implement delete() (soft delete)
- [ ] Add location search
- [ ] Add filters (city, difficulty)
- [ ] Test all endpoints

## 🔗 Related Issues
- Depends on: #4, #5

## ⏱️ Estimated Time
4 days" \
  --label "feature,P0: Critical,location,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #8 created${NC}"

# ============================================
# ISSUE #9: Trail Marker Management
# ============================================
gh issue create \
  --title "[LOCATION] Trail marker CRUD operations" \
  --body "## 📋 Description
Manage individual trail markers within locations.

## 🎯 Module Reference
**Module:** 3.1.2 - Trail Marker Management
**Dependencies:** #8 (Location CRUD)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Add trail marker to location
- [ ] List trail markers by location
- [ ] Update trail marker
- [ ] Delete trail marker
- [ ] Trail validation

## 📝 Implementation Checklist
- [ ] Create TrailService
- [ ] Create TrailController
- [ ] Implement createTrail()
- [ ] Implement findByLocation()
- [ ] Implement update()
- [ ] Implement delete()
- [ ] Validate unique trail numbers per location
- [ ] Test all endpoints

## 🔗 Related Issues
- Depends on: #8

## ⏱️ Estimated Time
4 days" \
  --label "feature,P0: Critical,location,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #9 created${NC}"

# ============================================
# ISSUE #10: Google Maps Integration
# ============================================
gh issue create \
  --title "[LOCATION] Integrate Google Maps API" \
  --body "## 📋 Description
Integrate Google Maps for location display and GPS calculations.

## 🎯 Module Reference
**Module:** 3.1.3 - Google Maps Integration
**Dependencies:** #8 (Location CRUD), #9 (Trail markers)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Display locations on map
- [ ] Display trail markers on map
- [ ] Calculate distance between points
- [ ] Geocoding working
- [ ] Reverse geocoding working

## 📝 Implementation Checklist
- [ ] Get Google Maps API key
- [ ] Install Google Maps SDK
- [ ] Create map display endpoint
- [ ] Implement distance calculation
- [ ] Implement geocoding
- [ ] Implement reverse geocoding
- [ ] Test GPS accuracy
- [ ] Document API usage

## 🔗 Related Issues
- Depends on: #8, #9

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,location,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #10 created${NC}"

# ============================================
# ISSUE #11: Game Templates
# ============================================
gh issue create \
  --title "[GAME] Create game template system" \
  --body "## 📋 Description
Define and implement 5 game templates.

## 🎯 Module Reference
**Module:** 4.1 - Game Templates
**Dependencies:** #10 (Maps integration)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Template data structures defined
- [ ] 5 templates implemented (Treasure Hunt, Scavenger Hunt, Capture Flag, Fitness Circuit, Time Trial)
- [ ] Template customization working
- [ ] Template validation

## 📝 Implementation Checklist
- [ ] Define template interface
- [ ] Create Treasure Hunt template
- [ ] Create Scavenger Hunt template
- [ ] Create Capture the Flag template
- [ ] Create Fitness Circuit template
- [ ] Create Time Trial template
- [ ] Implement template loader
- [ ] Add template validation
- [ ] Document each template

## 🔗 Related Issues
- Depends on: #10

## ⏱️ Estimated Time
4 days" \
  --label "feature,P0: Critical,game-management,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #11 created${NC}"

# ============================================
# ISSUE #12: Game Builder API
# ============================================
gh issue create \
  --title "[GAME] Game creation and management API" \
  --body "## 📋 Description
API endpoints for creating and managing games.

## 🎯 Module Reference
**Module:** 4.2.1 - Game Builder API
**Dependencies:** #11 (Game templates), #7 (User roles)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Create game endpoint
- [ ] Save as draft
- [ ] Publish game
- [ ] Update game
- [ ] Delete game
- [ ] Get game details

## 📝 Implementation Checklist
- [ ] Create GameService
- [ ] Create GameController
- [ ] Implement createGame()
- [ ] Implement publishGame()
- [ ] Implement updateGame()
- [ ] Implement deleteGame()
- [ ] Implement findOne()
- [ ] Add creator ownership check
- [ ] Test all endpoints

## 🔗 Related Issues
- Depends on: #11, #7

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,game-management,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #12 created${NC}"

# ============================================
# ISSUE #13: Checkpoint Management
# ============================================
gh issue create \
  --title "[GAME] Checkpoint creation and linking" \
  --body "## 📋 Description
Manage checkpoints within games.

## 🎯 Module Reference
**Module:** 4.2.2 - Checkpoint Management
**Dependencies:** #12 (Game builder), #9 (Trail markers)
**Phase:** Phase 2

## ✅ Acceptance Criteria
- [ ] Add checkpoint to game
- [ ] Link checkpoint to trail marker
- [ ] Set checkpoint type and content
- [ ] Order checkpoints
- [ ] Validate checkpoints

## 📝 Implementation Checklist
- [ ] Create CheckpointService
- [ ] Implement createCheckpoint()
- [ ] Implement updateCheckpoint()
- [ ] Implement deleteCheckpoint()
- [ ] Implement reorderCheckpoints()
- [ ] Validate checkpoint data
- [ ] Test checkpoint creation

## 🔗 Related Issues
- Depends on: #12, #9

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,game-management,phase-2-core" \
  --milestone "Phase 2: Core Features"

echo -e "${GREEN}✅ Issue #13 created${NC}"

# ============================================
# ISSUE #14: Game Registration
# ============================================
gh issue create \
  --title "[REGISTRATION] Player registration for games" \
  --body "## 📋 Description
Allow players to register for games.

## 🎯 Module Reference
**Module:** 4.4.1 - Game Registration
**Dependencies:** #12 (Game builder), #6 (User profile)
**Phase:** Phase 3

## ✅ Acceptance Criteria
- [ ] Register for game endpoint
- [ ] Solo registration working
- [ ] Team registration working
- [ ] Check game availability
- [ ] Registration confirmation

## 📝 Implementation Checklist
- [ ] Create RegistrationService
- [ ] Implement registerForGame()
- [ ] Check game capacity
- [ ] Handle team registration
- [ ] Send confirmation notification
- [ ] Test registration flow

## 🔗 Related Issues
- Depends on: #12, #6

## ⏱️ Estimated Time
5 days" \
  --label "feature,P0: Critical,game-management,phase-3-payment" \
  --milestone "Phase 3: Payment"

echo -e "${GREEN}✅ Issue #14 created${NC}"

# ============================================
# ISSUE #15: M-Pesa Payment Integration
# ============================================
gh issue create \
  --title "[PAYMENT] Integrate M-Pesa STK Push" \
  --body "## 📋 Description
Integrate M-Pesa Daraja API for payments.

## 🎯 Module Reference
**Module:** 5.1.1 - M-Pesa Integration
**Dependencies:** #14 (Game registration)
**Phase:** Phase 3

## ✅ Acceptance Criteria
- [ ] M-Pesa STK Push working
- [ ] Payment callback handled
- [ ] Payment verification
- [ ] Transaction logging
- [ ] Failed payment handling

## 📝 Implementation Checklist
- [ ] Get Daraja API credentials
- [ ] Install M-Pesa SDK
- [ ] Implement STK Push
- [ ] Implement callback endpoint
- [ ] Implement payment verification
- [ ] Create payment records
- [ ] Handle failed payments
- [ ] Test in sandbox
- [ ] Test with real M-Pesa

## 🔗 Related Issues
- Depends on: #14

## ⏱️ Estimated Time
7 days" \
  --label "feature,P0: Critical,payment,phase-3-payment" \
  --milestone "Phase 3: Payment"

echo -e "${GREEN}✅ Issue #15 created${NC}"

# ============================================
# SUMMARY
# ============================================
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ All issues created successfully!${NC}"
echo -e "${GREEN}=====================================${NC}\n"

echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   - 15 issues created"
echo -e "   - Labels configured"
echo -e "   - Milestones set up"
echo -e "   - Dependencies linked\n"

echo -e "${YELLOW}🎯 Next steps:${NC}"
echo -e "   1. Visit: https://github.com/$REPO/issues"
echo -e "   2. Review all created issues"
echo -e "   3. Start with Issue #1"
echo -e "   4. Track progress in project board\n"

echo -e "${GREEN}Happy coding! 🚀${NC}"