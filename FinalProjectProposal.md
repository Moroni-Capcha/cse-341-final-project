# CSE 341 Final Project Proposal

## General Info

- **Student Name in Group:** Moroni Capcha (*Individual / Solo Developer*)
- **Proposed Application Name:** Portfolio Builder API (*Developer Showcase & Portfolio Management Web Service*)
- **GitHub Repository:** [https://github.com/Moroni-Capcha/cse-341-final-project](https://github.com/Moroni-Capcha/cse-341-final-project)
- **Render Live Swagger UI:** [https://cse-341-final-project-pidd.onrender.com/api-docs/](https://cse-341-final-project-pidd.onrender.com/api-docs/)

---

## Contents

1. [Application Info](#application-info)
   - [What will the API do?](#what-will-the-api-do)
   - [How will your API utilize a login system?](#how-will-your-api-utilize-a-login-system)
   - [What database will you use?](#what-database-will-you-use)
   - [How will the data be stored in your database?](#how-will-the-data-be-stored-in-your-database)
   - [How would a frontend be able to manage authentication state based on the data you provide?](#how-would-a-frontend-be-able-to-manage-authentication-state-based-on-the-data-you-provide)
   - [What pieces of data in your app will need to be secured? How will you demonstrate web security principles in the development of this app?](#what-pieces-of-data-in-your-app-will-need-to-be-secured-how-will-you-demonstrate-web-security-principles-in-the-development-of-this-app)
   - [What file structure and program architecture will you use for this project? Why?](#what-file-structure-and-program-architecture-will-you-use-for-this-project-why)
   - [What are potential stretch challenges that you could implement to go above and beyond?](#what-are-potential-stretch-challenges-that-you-could-implement-to-go-above-and-beyond)
2. [API Endpoint Planning](#api-endpoint-planning)
   - [Users Entity Endpoints](#1-users-entity-users)
   - [Projects Entity Endpoints](#2-projects-entity-projects)
   - [Experiences Entity Endpoints](#3-experiences-entity-experiences)
   - [Contacts Entity Endpoints](#4-contacts-entity-contacts)
   - [Authentication Endpoints](#5-authentication-endpoints-auth)
3. [Project Scheduling and Delegation](#project-scheduling-and-delegation)
   - [Semester Milestones Table](#semester-milestones-schedule)
   - [Work Breakdown and Solo Execution Plan](#how-will-you-divide-up-work-in-your-team-to-ensure-the-following-tasks-all-get-completed)
4. [Potential Risks and Risk Mitigation Techniques](#potential-risks-and-risk-mitigation-techniques)
   - [What are the risks involved with you being able to finish this project in a timely manner?](#what-are-the-risks-involved-with-you-being-able-to-finish-this-project-in-a-timely-manner)
   - [How will you mitigate or overcome these risks?](#how-will-you-mitigate-or-overcome-these-risks)

---

## Application Info

### What will the API do?

The **Portfolio Builder API** is a robust RESTful web service engineered using Node.js, Express, and MongoDB Atlas. It serves as a centralized backend data service for personal developer portfolios, interactive resume platforms, and engineering project showcases. 

The API enables developers to:
- Create, manage, and publicly display professional developer profiles, biographical summaries, technical skill stacks, and professional social links.
- Showcase coding projects with detailed metadata, including descriptions, technology stacks, GitHub repository links, live deployment URLs, completion status, and featured spotlight flags.
- Record and present career history and educational experiences (company, position, duration, key accomplishments, and tools utilized).
- Receive and manage client, employer, and recruiter inquiries through a contact form submission system.
- Perform complete CRUD (Create, Read, Update, Delete) operations across four separate collections.
- Explore and test all endpoints interactively through auto-generated Swagger/OpenAPI documentation hosted at `/api-docs`.
- Rely on automated payload validation, 24-character hexadecimal ObjectId parameter checking, and centralized error handling with structured JSON feedback.

### How will your API utilize a login system?

The API implements **OAuth 2.0** authentication (using GitHub OAuth via Passport.js and session persistence via `express-session`):
- **Public Read Access**: Portfolio visitors, employers, and recruiters can freely execute `GET` requests to inspect developer profiles, browse featured projects, view work experience timelines, and submit new contact inquiries via `POST /contacts` without authentication.
- **Protected Administrative Operations**: Mutating actions (`POST`, `PUT`, `DELETE` on `users`, `projects`, and `experiences`, as well as retrieving or deleting private messages from `contacts`) require OAuth 2.0 authentication. Requests without an active session receive an `HTTP 401 Unauthorized` status response.
- **Dedicated Auth Endpoints**: Dedicated routes manage the authentication lifecycle:
  - `GET /auth/login` — Initiates the login flow.
  - `GET /auth/github` — Redirects to GitHub for OAuth 2.0 consent.
  - `GET /auth/github/callback` — Handles callback, exchanges tokens, and establishes a secure session.
  - `GET /auth/logout` — Destroys the session and clears cookies.
  - `GET /auth/status` — Returns the current user's authentication status and profile payload.

### What database will you use?

The application uses **MongoDB Atlas**, a cloud-hosted NoSQL document database, accessed via the official native Node.js `mongodb` driver. A connection singleton pattern in `db/connect.js` establishes an efficient connection pool upon server boot and shares the database client across all Express route controllers.

### How will the data be stored in your database?

Data is organized within a database named `portfolio_builder` across **four separate collections** (exceeding the course requirement of at least 4 collections, with two collections storing 10+ fields):

#### 1. `users` Collection (12 fields — exceeds the 7-field minimum)
- `_id`: Auto-generated MongoDB `ObjectId` (24-character hexadecimal string, Primary Key)
- `username`: String (Required, unique, min 3 characters) — Developer handle
- `email`: String (Required, unique, valid email format) — Primary contact email
- `firstName`: String (Required) — Developer given name
- `lastName`: String (Required) — Developer surname
- `bio`: String (Optional) — Professional summary and biography
- `role`: String (Optional) — Professional title (e.g., "Full Stack Engineer")
- `skills`: Array of Strings (Optional) — Technical proficiencies (e.g., `["JavaScript", "Node.js", "Express", "MongoDB", "React"]`)
- `githubUrl`: String (Optional) — Link to public GitHub profile
- `portfolioUrl`: String (Optional) — Link to personal website or portfolio domain
- `createdAt`: ISO Date timestamp generated upon creation
- `updatedAt`: ISO Date timestamp updated upon modification

#### 2. `projects` Collection (11 fields — also exceeds 7 fields)
- `_id`: Auto-generated MongoDB `ObjectId` (Primary Key)
- `title`: String (Required, non-empty) — Project title
- `description`: String (Required) — Comprehensive project overview
- `userId`: String / ObjectId (Required 24-char foreign key reference to `users._id`)
- `technologies`: Array of Strings (Optional) — Tech stack (e.g., `["Node.js", "Express", "MongoDB"]`)
- `githubRepo`: String (Optional) — Link to source code repository
- `liveUrl`: String (Optional) — Link to deployed live web service or demo
- `completed`: Boolean (Default: false) — Project completion status
- `featured`: Boolean (Default: false) — Flag for landing page spotlight
- `createdAt`: ISO Date timestamp generated upon creation
- `updatedAt`: ISO Date timestamp updated upon modification

#### 3. `experiences` Collection (10 fields)
- `_id`: Auto-generated MongoDB `ObjectId` (Primary Key)
- `userId`: String / ObjectId (Required 24-char reference to `users._id`)
- `company`: String (Required) — Employer, company, or institution name
- `role`: String (Required) — Job title or educational program (e.g., "Backend Developer Intern")
- `location`: String (Optional) — Geographic location or "Remote"
- `startDate`: String / Date (Required) — Start date (YYYY-MM-DD)
- `endDate`: String / Date (Optional) — End date (null if ongoing)
- `current`: Boolean (Default: false) — Whether developer is currently in this role
- `description`: String (Required) — Summary of responsibilities and achievements
- `technologies`: Array of Strings (Optional) — Core tools and methodologies applied
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp

#### 4. `contacts` Collection (8 fields)
- `_id`: Auto-generated MongoDB `ObjectId` (Primary Key)
- `userId`: String / ObjectId (Required 24-char reference to `users._id` targeted)
- `senderName`: String (Required) — Full name of the recruiter or visitor
- `senderEmail`: String (Required, valid email format) — Inquirer reply email address
- `subject`: String (Required) — Topic of inquiry (e.g., "Job Opportunity", "Freelance Contract")
- `message`: String (Required) — Message body content
- `read`: Boolean (Default: false) — Read/unread indicator for developer review
- `createdAt`: ISO Date timestamp generated upon message submission

---

### How would a frontend be able to manage authentication state based on the data you provide?

A frontend application (e.g., React, Vue, or Vanilla JS) can synchronize authentication state using the following workflow:

1. **Session Verification (`GET /auth/status`)**: On page load, the frontend makes a request to `/auth/status`. If an active session exists, the API responds with `HTTP 200` and `{ authenticated: true, user: { id, username, email, firstName, lastName } }`. If unauthenticated, it returns `HTTP 200` with `{ authenticated: false, user: null }`.
2. **Login Trigger (`GET /auth/github`)**: The frontend renders a "Sign in with GitHub" button pointing to `/auth/github`. When clicked, the browser navigates through GitHub's OAuth consent screen and redirects back to the server callback, establishing an HTTP-only session cookie.
3. **Logout Flow (`GET /auth/logout`)**: Clicking "Log out" calls `/auth/logout`, which terminates the server session, clears credentials, and returns `{ success: true, message: "Logged out successfully" }`.
4. **HTTP 401 Interceptors**: When an unauthenticated user attempts to perform a protected action (`POST`, `PUT`, `DELETE`), the API responds with `401 Unauthorized` and `{ "status": 401, "message": "Authentication required" }`. The frontend HTTP interceptor catches this response to display a login modal or redirect the user.

---

### What pieces of data in your app will need to be secured? How will you demonstrate web security principles in the development of this app?

#### Secured Data Assets
- Modifying operations: Creating, editing, or deleting users, projects, experiences, and reviewing/deleting contacts.
- Confidential contact messages sent to developers.
- Server credentials: Database connection strings, session secrets, and OAuth client keys.

#### Web Security Principles Demonstrated
1. **Environment Variable Segregation**: All secret keys (`MONGODB_URI`, `SESSION_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`) are stored in `.env` and kept out of Git version control via `.gitignore`.
2. **Payload Validation & Sanitization**: Incoming request bodies are inspected before reaching the database. Validation schemas enforce type checks, string length minimums, and email format regex, preventing NoSQL injection and malformed inputs.
3. **ObjectId Verification**: All route parameters (`:id`) are validated against a 24-character hexadecimal regex (`/^[0-9a-fA-F]{24}$/`). Non-conforming strings are rejected immediately with `400 Bad Request`, preventing unhandled MongoDB casting crashes.
4. **Centralized Error Handling**: Express error-handling middleware intercepts runtime exceptions and unhandled promise rejections, logs them internally, and returns uniform JSON responses (`{ status, message }`) without leaking internal server stack traces or database structures.
5. **CORS Controls**: CORS middleware enforces allowed HTTP methods, origins, and headers to prevent unauthorized cross-origin abuse.

---

### What file structure and program architecture will you use for this project? Why?

The project employs a layered MVC-inspired architecture:

```
cse-341-final-project/
├── controllers/          # Request handlers & database business logic
│   ├── auth.js           # Authentication & session controllers
│   ├── contacts.js       # Contact inquiries controller
│   ├── experiences.js    # Experience timeline controller
│   ├── projects.js       # Projects showcase controller
│   └── users.js          # Users profile controller
├── db/                   # Database connection abstraction
│   └── connect.js        # MongoDB client initialization & singleton pool
├── middleware/           # Reusable Express middleware
│   ├── auth.js           # OAuth route guard (ensureAuth)
│   ├── errorHandler.js   # Centralized error handler & 404 handler
│   └── validate.js       # Schema & parameter validation middleware
├── routes/               # Modular Express routing definitions
│   ├── auth.js           # /auth endpoints
│   ├── contacts.js       # /contacts endpoints
│   ├── experiences.js    # /experiences endpoints
│   ├── index.js          # Primary router aggregator
│   ├── projects.js       # /projects endpoints
│   ├── swagger.js        # /api-docs route mounting
│   └── users.js          # /users endpoints
├── tests/                # Automated testing suite
│   └── get_routes.test.js# Automated Jest / Supertest suite for GET endpoints
├── .env                  # Environment variables (local, gitignored)
├── .env.example          # Environment variable specification template
├── .gitignore            # Git exclusion rules
├── package.json          # Node dependencies, scripts, and engine specs
├── rest.http             # Interactive VS Code REST Client testing file
├── server.js             # Application entry point & middleware pipeline
├── swagger.js            # Swagger-autogen build configuration script
└── swagger.json          # Compiled OpenAPI 2.0 API specification
```

**Why this architecture?**
1. **Modularity**: Keeps route matching, business logic, validation, and database handling cleanly decoupled in dedicated files.
2. **Maintainability**: New collections (like `experiences` and `contacts`) can be added without altering existing routes.
3. **Testability**: Independent controllers and middleware can be easily tested with Jest and Supertest without requiring a running HTTP server instance.

---

### What are potential stretch challenges that you could implement to go above and beyond?

1. **Advanced Querying & Pagination**: Support query parameters for filtering (`?userId=...`, `?featured=true`, `?tech=React`), field selection, and pagination (`?page=1&limit=10`) with sorting.
2. **Automated CI/CD Testing Pipeline**: Continuous Integration using GitHub Actions running Jest and Supertest on every push and pull request.
3. **Cascade Deletions**: Enforce referential integrity by automatically removing all associated projects, experiences, and received contacts when a user profile is deleted.
4. **API Rate Limiting**: Implement `express-rate-limit` to protect endpoints from brute-force attacks and abuse.
5. **Cloudinary Image Uploads**: Integrate Multer and Cloudinary for screenshot and project thumbnail image uploads.

---

## API Endpoint Planning

### 1. Users Entity (`/users`)
- `GET /users` — Retrieve all registered developer profiles
- `GET /users/{id}` — Retrieve a single developer profile by its 24-character hexadecimal MongoDB ObjectId
- `POST /users` — Register a new developer profile with validation (username, email, firstName, lastName)
- `PUT /users/{id}` — Update developer profile details (bio, role, skills, URLs) by ID
- `DELETE /users/{id}` — Delete developer profile and cascade associated resources by ID

### 2. Projects Entity (`/projects`)
- `GET /projects` — Retrieve all projects (supports query filtering by `?userId={id}` and `?featured=true`)
- `GET /projects/{id}` — Retrieve a single project showcase document by its MongoDB ObjectId
- `POST /projects` — Create a new project entry associated with a verified developer `userId`
- `PUT /projects/{id}` — Update project metadata, tech stack, URLs, or completion status by ID
- `DELETE /projects/{id}` — Delete a project entry by its MongoDB ObjectId

### 3. Experiences Entity (`/experiences`)
- `GET /experiences` — Retrieve all work/educational experience records (supports filtering by `?userId={id}`)
- `GET /experiences/{id}` — Retrieve a specific experience record by its MongoDB ObjectId
- `POST /experiences` — Add a new employment or academic experience entry for a developer
- `PUT /experiences/{id}` — Update experience entry details (role, company, dates, description) by ID
- `DELETE /experiences/{id}` — Delete an experience record by ID

### 4. Contacts Entity (`/contacts`)
- `GET /contacts` — Retrieve all contact messages received by developers (supports `?userId={id}`) `[Auth Protected]`
- `GET /contacts/{id}` — Retrieve a specific contact message by ID `[Auth Protected]`
- `POST /contacts` — Submit a public recruiter or client contact inquiry to a developer's portfolio `[Public]`
- `PUT /contacts/{id}` — Update contact message status (e.g., mark as read/unread) by ID `[Auth Protected]`
- `DELETE /contacts/{id}` — Delete a contact inquiry record by ID `[Auth Protected]`

### 5. Authentication Endpoints (`/auth`)
- `GET /auth/login` — Display authentication options / OAuth entry point
- `GET /auth/github` — Initiate GitHub OAuth 2.0 authorization redirect
- `GET /auth/github/callback` — GitHub OAuth 2.0 callback destination handling token exchange and session creation
- `GET /auth/logout` — Terminate active session and log out developer
- `GET /auth/status` — Return current session authentication status and active user info

---

## Project Scheduling and Delegation

### Semester Milestones Schedule

| Week | Milestone & Deliverable Tasks |
| :--- | :--- |
| **Week 04 Tasks** | • Complete and submit Final Project Proposal document.<br>• Review Week 07 final rubric requirements (4 collections, 7+ fields, validation, error handling, OAuth, unit tests, Render deployment, YouTube video).<br>• Design NoSQL database schemas for Users, Projects, Experiences, and Contacts.<br>• Plan REST API endpoints, HTTP status codes, and error response standards. |
| **Week 05 Tasks** | • Initialize Git repository on GitHub and configure `.gitignore`.<br>• Establish MongoDB Atlas cloud cluster and build singleton connection in `db/connect.js`.<br>• Implement complete CRUD routes and controllers for Users and Projects collections.<br>• Implement strict payload validation middleware and 24-char hex ObjectId verification.<br>• Build centralized error-handling middleware (`errorHandler.js`, `notFoundHandler`).<br>• Configure `swagger-autogen` and launch interactive documentation at `/api-docs`.<br>• Deploy initial service to Render (`https://cse-341-final-project-pidd.onrender.com/api-docs/`) and test with `rest.http`. |
| **Week 06 Tasks** | • Implement complete CRUD endpoints and controllers for Experiences and Contacts collections.<br>• Integrate OAuth 2.0 authentication (GitHub OAuth using Passport.js and `express-session`).<br>• Implement authentication guards (`ensureAuth`) to protect mutating endpoints (`POST`, `PUT`, `DELETE`).<br>• Update Swagger OpenAPI specification with the 4 collections and security definitions.<br>• Deploy updated codebase to Render and verify live OAuth callback flows. |
| **Week 07 Tasks** | • Implement automated unit test suite using Jest and Supertest covering all GET routes across all collections.<br>• Perform comprehensive end-to-end audit of all endpoints, validation errors, and 404/400/409 error handling.<br>• Record 5-to-8 minute video demonstration walkthrough covering all rubric requirements (all CRUD routes, MongoDB updates, validation errors, OAuth flow, and unit tests).<br>• Upload demonstration video to YouTube.<br>• Submit final GitHub repository, live Render URL, and YouTube video link on Canvas. |

---

### How will you divide up work in your team to ensure the following tasks all get completed?

*Note on Team Structure: Moroni Capcha is completing the Final Project individually as a solo developer. All development responsibilities, system architecture, database modeling, route implementations, testing, and documentation will be executed by Moroni Capcha according to the structured assignment breakdown below:*

- **HTTP GET, GET (all, single):** Moroni Capcha — Implement and test all GET endpoints across Users, Projects, Experiences, and Contacts. Handle query parameter filtering (e.g., `?userId=...`), pagination, projection, and appropriate HTTP 200 / 404 responses.
- **HTTP POST:** Moroni Capcha — Develop creation handlers for all four collections with robust schema validation, duplicate key checking (unique username and email in Users), foreign key verification (valid userId), and HTTP 201 Created responses.
- **HTTP PUT:** Moroni Capcha — Build update handlers for all four collections, validating request body attributes, ensuring target document existence, updating ISO timestamps, and returning HTTP 200 OK with the updated record or success status.
- **HTTP DELETE:** Moroni Capcha — Construct deletion handlers with 24-character hex ID validation, checking that records exist prior to removal, handling cascading cleanups, and responding with HTTP 200 OK confirmation.
- **Node.js project creation:** Moroni Capcha — Set up Express application framework, configure CORS middleware, body parsers, environment variable loaders, and modular routing pipelines in `server.js`.
- **Create git repo and share with group:** Moroni Capcha — Initialize Git repository, publish to GitHub (`https://github.com/Moroni-Capcha/cse-341-final-project`), configure `.gitignore` to safeguard sensitive files, and maintain clean semantic commit history.
- **MongoDB setup:** Moroni Capcha — Provision and configure MongoDB Atlas cloud database cluster, create database `portfolio_builder`, establish unique indexes on username and email fields, and create connection singleton in `db/connect.js`.
- **API Swagger documentation for all API routes:** Moroni Capcha — Configure `swagger-autogen` in `swagger.js` with detailed schemas, parameters, sample payloads, and response definitions; expose interactive Swagger UI at route `/api-docs` on both local server and live Render deployment.
- **Video presentation of node project, all routes functioning, mongoDB data being modified, and API documentation:** Moroni Capcha — Plan, record, and edit the 5 to 8 minute comprehensive video presentation demonstrating: live MongoDB connection, CRUD operations across all collections, error validation responses, OAuth workflow, passing unit tests, and live Swagger docs on Render. Upload video to YouTube and submit all required links.

---

## Potential Risks and Risk Mitigation Techniques

### What are the risks involved with you being able to finish this project in a timely manner?

1. **Solo Developer Workload & Scope:** As a solo developer, all responsibilities—architecture, database management, 4-collection CRUD development, input validation, OAuth authentication, unit testing, documentation, cloud deployment, and video recording—fall on a single individual without the ability to divide tasks across peers.
2. **OAuth 2.0 & Cloud Session Complexity:** Configuring OAuth 2.0 authentication, session persistence, and secure cookie handling can introduce hurdles when coordinating redirect callback URLs between `localhost:8080` and the production Render HTTPS domain.
3. **Automated Unit Testing Configuration:** Configuring Jest and Supertest to test asynchronous MongoDB operations across all GET endpoints without hanging open connections or mutating production data.
4. **Timeline & Schedule Constraints:** Balancing course deadlines and delivering a polished project while managing potential unexpected deployment or configuration bugs.

### How will you mitigate or overcome these risks?

1. **Frontloaded Agile Sprints:** Development is frontloaded: the repository structure, MongoDB Atlas connection, Users and Projects CRUD, validation, centralized error handling, and initial Swagger docs are already architected and working in Week 05. This leaves ample time in Weeks 06 and 07 dedicated specifically to OAuth, Experiences/Contacts collections, unit tests, and video preparation.
2. **Reusable Code Architecture:** The application leverages highly reusable middleware (`validate.js` for validation, `errorHandler.js` for exceptions, `auth.js` for route guards). Adding the Experiences and Contacts collections follows established, proven patterns without reinventing architecture.
3. **Environment-Aware Configuration:** Environment variables (`BASE_URL`, `CALLBACK_URL`) dynamically adjust OAuth redirect targets between local development and Render, avoiding hardcoded URL bugs.
4. **Isolated Testing Harness:** Supertest tests will utilize distinct test configurations or non-destructive read queries on MongoDB Atlas, ensuring deterministic, fast test execution that cleanly closes database connections upon completion.
5. **Continuous Local & Remote Verification:** Every endpoint is tested systematically locally using the included `rest.http` file and Swagger UI before deploying to Render, and immediately verified on Render upon pushing to GitHub to catch any cloud environment discrepancies early.
