You are a senior backend architect and product analyst.

I have finished the Backend MVP of an educational E-Wallet application built with:

* Node.js
* Express.js
* PostgreSQL
* Raw SQL using `pg`
* JavaScript
* REST API
* Modular architecture

Your job is NOT to modify my backend.

Your job is to thoroughly inspect the entire backend codebase and create a complete product specification that another AI Designer can use to design the frontend.

## IMPORTANT

Do not assume features that do not exist.

Do not invent endpoints, pages, permissions, or functionality.

Everything in the frontend specification must be based on what actually exists in the backend code.

Inspect:

* Routes
* Controllers
* Services
* Repositories
* Validation
* Middleware
* Authentication
* Authorization
* Database schema
* Database relationships
* API responses
* Error handling
* Pagination
* Filtering
* Sorting
* Query parameters
* Request bodies
* Response bodies
* HTTP status codes
* User roles
* Wallet functionality
* Transactions
* Transfers
* Deposits
* Withdrawals
* Idempotency
* Any other implemented module

Also inspect the database schema carefully to understand the actual relationships and data available to the frontend.

---

# PART 1 — BACKEND INVENTORY

Create a complete inventory of the backend.

For every API endpoint, document:

* HTTP method
* Endpoint
* Authentication required?
* User role required?
* Required headers
* Path parameters
* Query parameters
* Request body
* Validation rules
* Successful response
* Possible error responses
* Important business rules
* Related database entities

Use a table where appropriate.

Example:

| Method | Endpoint        | Auth | Purpose          | Body              | Response |
| ------ | --------------- | ---- | ---------------- | ----------------- | -------- |
| POST   | /api/v1/wallets | Yes  | Create wallet    | name, currency... | wallet   |
| GET    | /api/v1/wallets | Yes  | Get user wallets | —                 | wallets  |

Do this for EVERY relevant endpoint.

---

# PART 2 — AUTHENTICATION & USER FLOWS

Determine exactly how authentication works.

Document:

* Register
* Login
* Logout
* Current user
* Email verification
* Password reset
* Cookies
* JWT
* Protected routes
* Public routes
* Role-based access
* Authentication errors
* Session expiration behavior

Then describe the frontend flow for each one.

Example:

Register:

User → Register Form → API → Success → Verification State → Dashboard

Do not invent missing steps.

---

# PART 3 — WALLET FEATURES

Analyze the wallet module.

Determine exactly what users can do with wallets.

Document:

* Create wallet
* List wallets
* Get wallet
* Update wallet
* Close wallet
* Wallet status
* Currency
* Balance
* Bank information
* Ownership rules
* Validation
* Errors

Then determine the frontend screens/components required.

For example:

* Wallet overview
* Wallet details
* Create wallet form
* Edit wallet form
* Close wallet confirmation
* Wallet status indicators

Only include screens supported by the backend.

---

# PART 4 — TRANSACTIONS

Analyze the transaction system.

Determine:

* Transaction types
* Transaction statuses
* Amount representation
* Wallet relationship
* Transaction history
* Pagination
* Filtering
* Sorting
* Transaction details
* Failed transactions
* Successful transactions

Explain what information the frontend can actually display.

Then propose:

* Transaction history screen
* Transaction details
* Filters
* Search
* Pagination
* Empty states
* Loading states
* Error states

Only if supported by the backend.

---

# PART 5 — TRANSFERS

Analyze the transfer system deeply.

Determine:

* Sender wallet
* Receiver wallet
* Amount
* Transfer status
* Transaction relationship
* Validation
* Ownership
* Balance validation
* Concurrency protection
* Idempotency
* Possible errors

Create the complete user flow:

Create Transfer

→ Select sender wallet
→ Select receiver wallet
→ Enter amount
→ Review
→ Confirm
→ API request
→ Success / failure

If the backend does not have a specific step, clearly mark it as a FRONTEND UX decision rather than a backend requirement.

---

# PART 6 — DEPOSITS

Analyze the deposit system.

Determine exactly:

* How a deposit is created
* Required fields
* Wallet restrictions
* Amount validation
* Transaction creation
* Status
* Idempotency
* Error cases

Then define the frontend UX for deposits.

---

# PART 7 — WITHDRAWALS

Analyze withdrawals.

Determine:

* Required fields
* Wallet selection
* Amount
* Balance validation
* Status
* Idempotency
* Errors
* Transaction behavior

Then define the frontend UX.

---

# PART 8 — IDEMPOTENCY

Analyze the idempotency implementation.

Explain it from the frontend perspective.

Determine:

* Which endpoints require `Idempotency-Key`
* When the frontend should generate a new key
* When the frontend should reuse an existing key
* What happens when a request succeeds
* What happens when a request fails
* What happens when a request is already processing
* How duplicate requests are handled

Create frontend behavior for:

* Normal submission
* Network timeout
* User retry
* Double-click submission
* Refresh during a request
* Existing completed request
* Existing failed request
* Pending request

Do not invent backend behavior.

---

# PART 9 — ERROR HANDLING

Inspect the backend's actual error responses.

Create a frontend error map.

For example:

| HTTP Status | Backend Meaning           | Frontend Behavior     |
| ----------- | ------------------------- | --------------------- |
| 400         | Validation/business error | Show form error       |
| 401         | Not authenticated         | Redirect to login     |
| 403         | Forbidden                 | Show permission error |
| 404         | Resource not found        | Show not-found state  |
| 409         | Conflict/idempotency      | Handle conflict       |
| 429         | Rate limit                | Show retry message    |
| 500         | Server error              | Show generic error    |

Adjust this table according to the ACTUAL backend behavior.

---

# PART 10 — FRONTEND ROUTES

Based on the backend, propose the frontend route structure.

Separate:

### Public Routes

Examples:

* /login
* /register
* /verify-email
* /forgot-password
* /reset-password

Only include routes actually required.

### Protected Routes

Examples:

* /dashboard
* /wallets
* /wallets/:id
* /transactions
* /transfers
* /deposits
* /withdrawals
* /profile
* /settings

Again, do not invent unsupported functionality.

---

# PART 11 — DASHBOARD REQUIREMENTS

Determine what information the dashboard can display based on the actual APIs.

Identify:

* Total wallet balance
* Wallet count
* Recent transactions
* Recent transfers
* Wallet cards
* Quick actions
* Financial summaries
* Status information

For each dashboard component, identify which API provides its data.

If a desired dashboard widget requires backend functionality that does not exist, clearly label it:

"NOT CURRENTLY SUPPORTED BY BACKEND"

Do not pretend it exists.

---

# PART 12 — UI STATE REQUIREMENTS

For every major screen, define:

* Loading state
* Empty state
* Success state
* Error state
* Disabled state
* Validation state
* Confirmation state
* Pending state

Pay special attention to financial operations.

The UI should never make a user think a transfer succeeded unless the API confirms it.

---

# PART 13 — COMPONENT INVENTORY

Create a reusable frontend component inventory.

Group components into:

### Layout

* Sidebar
* Navbar
* Mobile navigation
* Page container

### Wallet

* Wallet card
* Wallet balance
* Wallet status
* Wallet selector

### Transactions

* Transaction row
* Transaction table
* Transaction status badge
* Transaction filters

### Financial Operations

* Transfer form
* Deposit form
* Withdrawal form
* Confirmation modal
* Success state
* Failure state
* Pending state

### Shared

* Button
* Input
* Select
* Modal
* Toast
* Alert
* Skeleton
* Empty state
* Error state

Only create reusable components when there is actual reuse.

Avoid unnecessary abstraction.

---

# PART 14 — FRONTEND DATA FLOW

Explain how the frontend should communicate with the backend.

Assume:

* React
* Vite
* JavaScript
* Axios
* React Router

Explain:

* API client
* Authentication handling
* Cookies
* `withCredentials`
* API error handling
* Request loading states
* Idempotency headers
* Protected routes
* User state
* Wallet state
* Transaction state

Do not introduce unnecessary state-management libraries unless there is a clear reason.

---

# PART 15 — DESIGN REQUIREMENTS

Now convert the backend analysis into a UI/UX specification.

The application should feel like a modern financial dashboard.

Design goals:

* Clean
* Modern
* Professional
* Trustworthy
* Minimal
* Responsive
* Desktop-first but fully usable on mobile
* Clear financial information hierarchy
* Strong visual distinction between positive and negative transactions
* Clear wallet statuses
* Clear success/failure states
* Excellent forms
* Excellent loading states
* Excellent empty states
* Accessible UI

Avoid:

* Overly flashy UI
* Excessive gradients
* Excessive glassmorphism
* Unnecessary animations
* Fake financial statistics
* Fake features
* Cryptocurrency-style aesthetics
* Overcomplicated dashboards
* Too many cards
* Information overload

The application should look like a real fintech product, not a generic AI-generated dashboard.

---

# PART 16 — DESIGN SYSTEM

Create a complete design direction for the AI Designer.

Define:

* Color philosophy
* Primary color
* Secondary colors
* Background
* Surface colors
* Text hierarchy
* Success
* Warning
* Error
* Pending
* Borders
* Shadows
* Radius
* Typography
* Spacing
* Icons
* Button styles
* Input styles
* Cards
* Tables
* Modals
* Toasts
* Badges

Do not make the design excessively colorful.

Financial information should be easy to scan.

---

# PART 17 — SCREEN-BY-SCREEN SPECIFICATION

For every frontend screen, provide:

1. Screen name
2. Route
3. Purpose
4. User goal
5. Required API endpoints
6. Main components
7. Data displayed
8. User actions
9. Loading state
10. Empty state
11. Error state
12. Success state
13. Responsive behavior

Example:

## Dashboard

Route:

`/dashboard`

Purpose:

Give the user a quick overview of their wallets and recent activity.

Components:

* Wallet summary
* Wallet cards
* Recent transactions
* Quick actions

API dependencies:

* GET /wallets
* GET /transactions

etc.

---

# PART 18 — FINANCIAL OPERATION UX

Design the UX for:

* Transfer
* Deposit
* Withdrawal

Each operation should follow a clear flow:

1. Input
2. Validation
3. Review
4. Confirmation
5. Processing
6. Success / Failure

For example:

Transfer:

Select Wallet
→ Select Receiver
→ Enter Amount
→ Review Transfer
→ Confirm
→ Processing
→ Success

The UI should prevent accidental duplicate submissions.

---

# PART 19 — AI DESIGNER PROMPT

Finally, produce a SECOND standalone prompt.

This prompt will be given to another AI whose job is to design the actual frontend UI.

The second prompt must contain:

* Product overview
* Target users
* Available features
* Frontend routes
* Screens
* User flows
* Components
* Data requirements
* API dependencies
* Error states
* Loading states
* Empty states
* Financial UX rules
* Responsive requirements
* Design system
* Visual direction
* UX principles

The AI Designer must design ONLY what the backend supports.

The AI Designer must NOT invent backend functionality.

The AI Designer should produce a complete frontend design system and screen specification that a React developer can implement directly.

---

# FINAL OUTPUT

Return TWO clearly separated sections:

## SECTION A — Backend Analysis

A complete analysis of my actual backend.

## SECTION B — AI DESIGNER PROMPT

A polished, standalone prompt that I can copy and send directly to an AI Designer.

IMPORTANT:

Do not modify my backend.

Do not generate frontend code.

Do not invent features.

Your task is analysis + frontend product specification + a final AI Designer prompt.
