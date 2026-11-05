# Campus Lost-and-Found System: Complete Project Software Engineering & Agile Process Report

---

## Project Overview

| Parameter | Details |
| :--- | :--- |
| **Project Title** | Campus Lost-and-Found System |
| **Domain** | Full-Stack Web Development (FSD) / Campus Utility System |
| **Tech Stack** | MongoDB, Express.js, React.js, Node.js (MERN), Cloudinary, JWT, OTP Auth |
| **Process Model (Module 1)** | **Prototype** |
| **Agile Method (Module 2)** | **Scrum** |

---

# MODULE 1: PROTOTYPE PROCESS MODEL

The **Prototype Process Model** was selected to rapidly develop an interactive working model of the Campus Lost-and-Found system, gather prompt user feedback from students and campus administration, and iteratively refine requirements and system capabilities.

```
+-----------------------------------------------------------------------------------+
|                           PROTOTYPE MODEL LIFECYCLE                               |
|                                                                                   |
|  [1. Requirement Gathering]  -->  [2. Quick Design]  -->  [3. Prototype Building] |
|                                                                 |                 |
|                                                                 v                 |
|  [6. Final System Deployment] <-- [5. Refinement]    <--  [4. User Evaluation]    |
+-----------------------------------------------------------------------------------+
```

---

### Phase 1: Requirements Gathering & Problem Identification
- **Problem Statement**: Students frequently lose personal belongings (student IDs, laptops, keys, wallets, notebooks) on campus without a centralized, timely mechanism to locate or reclaim them. Notice boards and social media groups are unorganized, unverified, and lack privacy and searchability.
- **Primary Objectives**:
  - Centralized portal to post both lost and found items.
  - Secure identity verification via **OTP verification** to prevent spoofing and fake accounts.
  - Image verification and secure storage with Cloudinary.
  - Automated intelligent matching between lost and found entries using keyword similarity.
  - Administrative verification gate to eliminate spam and fraudulent claims.
  - Unique campus utility tools: **Campus Hotspot Radar**, **Printable QR Finder Tags**, and **Anti-Fraud Ownership Proof Quiz**.

---

### Phase 2: Quick Design & Architecture
- **Initial Conceptual Design**:
  - High-level 3-tier architecture: Presentation Layer (React), Application Logic (Node/Express), Data Persistence (MongoDB).
- **Core Entities Identified**:
  - `User`: Handles student/admin identity (`name`, `email`, `password`, `role`).
  - `Otp`: Handles short-lived 6-digit authentication codes with automatic 10-minute TTL expiration (`server/models/Otp.js`).
  - `Item`: Represents lost/found post with zone categorization and anti-fraud claims (`server/models/Item.js`).
- **Quick Wireframes**:
  - Home feed with feature spotlight cards.
  - OTP verification screen with auto-focus inputs and countdown timers.
  - Campus Radar zone distribution cards.
  - Printable QR Finder Tag preview.

---

### Phase 3: Building the Prototype (Working Mockup)
- **Frontend Prototype (`src/` & `client/src/`)**:
  - Implemented responsive React components (`Navbar.jsx`, `ItemCard.jsx`).
  - Created key interface views: `Home.jsx`, `LostItems.jsx`, `FoundItems.jsx`, `ReportItem.jsx`, `CampusRadar.jsx`, `QRTagGenerator.jsx`, and `Login.jsx`/`Register.jsx`.
- **Backend Mock/API Scaffolding (`server/`)**:
  - Configured Express REST API server running on port 9001.
  - Created MongoDB Mongoose schemas for `User`, `Otp`, and `Item`.
  - Added CRUD endpoints to post and retrieve items and verify OTPs.

---

### Phase 4: User & Stakeholder Evaluation
The working prototype was tested with student representatives and faculty coordinators. Key feedback received:
1. **Account Authenticity Friction**: Password-only registration lacked verification; students requested OTP email verification to guarantee genuine campus users.
2. **Zone Uncertainty**: Students misplace items across specific hotspots (Library vs Cafeteria vs Tech Block); a spatial radar was requested.
3. **False Ownership Claims**: Valuables (like MacBooks and AirPods) needed proof of ownership before hand-over.
4. **Preventive Measures**: Students asked for a way to tag their items *before* they get lost.

---

### Phase 5: Prototype Refinement & Iteration
Based on evaluation feedback, the following engineering refinements were made:
1. **OTP Verification Engine (`server/models/Otp.js` & `server/routes/auth.js`)**:
   - Implemented 6-digit OTP verification for both Registration and Passwordless Login.
   - Built an interactive OTP screen with 60-second resend countdown, evaluation auto-fill, and token generation.
2. **Campus Hotspot Radar (`src/pages/CampusRadar.jsx`)**:
   - Zone-by-zone incident tracking (Library, Tech Block, Cafeteria, Sports Complex, etc.) with live lost vs. found recovery rates.
3. **Smart Printable QR "Finder Tags" (`src/pages/QRTagGenerator.jsx`)**:
   - One-click printable badges with embedded dynamic QR codes that link directly to pre-filled found item reports.
4. **Anti-Fraud Ownership Quiz & Claim Review (`src/pages/ItemDetails.jsx`)**:
   - Finders can attach a secret question (e.g. "What sticker is on the laptop lid?"). Claimants submit private proof which posters/admins can approve or reject.
5. **Intelligent Match Engine (`server/utils/matchItems.js`)**:
   - Automated matching algorithm using **Jaccard Similarity Coefficient**:
     $$\text{Similarity}(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

---

### Phase 6: Final Product Engineering
- Connected all refined routes, verified full-stack build compilation, and packaged deployment.

---
---

# MODULE 2: AGILE METHOD (SCRUM)

To execute the project in an iterative, adaptable, and customer-focused manner, **Scrum** framework was applied across 4 sprints (2-week cadence per sprint).

---

### 1. Scrum Roles & Responsibilities

| Scrum Role | Assigned Responsibilities |
| :--- | :--- |
| **Product Owner (PO)** | Defines user stories, maintains and prioritizes the Product Backlog, accepts/rejects completed sprint deliverables. |
| **Scrum Master (SM)** | Facilitates daily standups, sprint planning, retrospectives; clears blockers; ensures Scrum practices are upheld. |
| **Development Team** | Full-Stack developers responsible for frontend (React), backend APIs (Express/Node), database (MongoDB), and integration. |

---

### 2. Product Backlog & Story Estimation

| Story ID | Epic | User Story | Story Points | Priority |
| :--- | :--- | :--- | :---: | :---: |
| **US-01** | Security & Auth | *As a student*, I want to register and login using OTP verification to secure my campus account. | 5 | High |
| **US-02** | Item Management | *As a student*, I want to report lost or found items with campus zone and photo upload. | 5 | High |
| **US-03** | Media Pipeline | *As a user*, I want to upload pictures of the item to Cloudinary for instant visual recognition. | 5 | Medium |
| **US-04** | Hotspot Radar | *As a student*, I want to explore an interactive Campus Radar to see lost/found stats per campus zone. | 5 | Medium |
| **US-05** | Smart Matching | *As a student*, I want the system to automatically suggest potential matches using similarity scores. | 8 | High |
| **US-06** | QR Finder Tag | *As a student*, I want to generate a printable QR badge for my valuables so finders can reach me quickly. | 3 | Medium |
| **US-07** | Anti-Fraud Claims | *As an item finder*, I want claimants to answer security questions and submit proof before releasing items. | 5 | High |
| **US-08** | Admin Moderation | *As an admin*, I want to review unverified posts and verify or delete them to maintain data integrity. | 5 | High |

---

### 3. Sprint Breakdown & Execution

#### Sprint 1: Security, Schemas & OTP Authentication
- **Sprint Goal**: Set up MongoDB models, JWT token issuance, and OTP verification flow.
- **Sprint Backlog**: US-01 (`User.js`, `Otp.js`, `auth.js`, `Login.jsx`, `Register.jsx`, `AuthContext.jsx`).
- **Key Deliverables**:
  - 6-digit OTP generation with automatic MongoDB TTL expiration.
  - React OTP verification screen with live timer and resend capability.
  - Dual login modes: OTP login and password login.
- **Sprint Review**: Demonstrated registration and login verified through OTP.

---

#### Sprint 2: Core Reporting, Media Pipeline & Anti-Fraud Claims
- **Sprint Goal**: Item reporting with Cloudinary uploads and anti-fraud claim submission.
- **Sprint Backlog**: US-02, US-03, US-07 (`Item.js`, `items.js`, `upload.js`, `ReportItem.jsx`, `ItemDetails.jsx`).
- **Key Deliverables**:
  - Categorized reporting supporting campus zone selection and optional secret question.
  - Ownership claim submission modal and owner approval/rejection panel.
  - Cloudinary image upload pipeline.
- **Sprint Review**: Verified photo uploads and claim submission workflow.

---

#### Sprint 3: Smart Auto-Matching Engine & Campus Hotspot Radar
- **Sprint Goal**: Automated Jaccard matching and interactive campus zone radar.
- **Sprint Backlog**: US-04, US-05 (`matchItems.js`, `CampusRadar.jsx`, `LostItems.jsx`, `FoundItems.jsx`).
- **Key Deliverables**:
  - `matchItems.js` utility computing intersection-over-union of tokenized description words ($\ge 30\%$ threshold).
  - `CampusRadar.jsx` providing visual incident stats across Library, Tech Block, Cafeteria, etc.
- **Sprint Review**: Real-time match suggestions and campus zone breakdown demonstrated.

---

#### Sprint 4: Smart QR Finder Tags, Admin Moderation & Production Polish
- **Sprint Goal**: Printable QR code generator, admin moderation, and cross-device testing.
- **Sprint Backlog**: US-06, US-08 (`QRTagGenerator.jsx`, `admin.js`, `Admin.jsx`, styling).
- **Key Deliverables**:
  - `QRTagGenerator.jsx` with customizable badges, dynamic QR code generation, and print styling.
  - Admin dashboard for approving pending items.
  - Production build verification (`dist/index.html` compiled cleanly).
- **Sprint Review**: End-to-end user workflow validated from QR tag generation to lost item reporting, matching, and recovery.

---

# CODEBASE TRACEABILITY MATRIX

| Methodology Phase / Sprint | Codebase File(s) | Function / Purpose |
| :--- | :--- | :--- |
| **Prototype Phase 2 & Sprint 1** | `server/models/Otp.js` | Short-lived 6-digit OTP schema with TTL index |
| **Prototype Phase 2 & Sprint 1** | `server/models/User.js` | User schema with bcrypt encryption |
| **Prototype Phase 2 & Sprint 1** | `server/routes/auth.js` | OTP generation, OTP verification, and JWT login endpoints |
| **Prototype Phase 3 & Sprint 1** | `src/pages/Login.jsx` | Dual-mode login interface (OTP Login + Password Login) |
| **Prototype Phase 3 & Sprint 1** | `src/pages/Register.jsx`| 2-Step OTP email verification registration interface |
| **Prototype Phase 3 & Sprint 2** | `server/models/Item.js` | Lost/Found item schema with campus zones & claims |
| **Prototype Phase 3 & Sprint 2** | `server/routes/items.js` | CRUD APIs, zone statistics, and claim review endpoints |
| **Prototype Phase 5 & Sprint 2** | `server/routes/upload.js` | Cloudinary multipart image upload handler |
| **Prototype Phase 5 & Sprint 3** | `server/utils/matchItems.js` | Jaccard similarity auto-matching engine |
| **Prototype Phase 5 & Sprint 3** | `src/pages/CampusRadar.jsx` | Interactive Campus Hotspot Radar & Zone map |
| **Prototype Phase 5 & Sprint 4** | `src/pages/QRTagGenerator.jsx` | Printable QR "Finder Tag" generator |
| **Prototype Phase 5 & Sprint 2,4** | `src/pages/ItemDetails.jsx` | Anti-fraud ownership quiz & claims review panel |
| **Prototype Phase 5 & Sprint 4** | `src/pages/Admin.jsx` | Admin moderation dashboard UI |
