# CSE 341 Final Project - Portfolio Builder API (Week 06 Deliverables)

A comprehensive Node.js, Express.js, and MongoDB RESTful Web Service powering the **Portfolio Builder** developer showcase platform. This release completes **Part 2** of the final project, delivering all **four collections** with complete CRUD operations, **OAuth 2.0 GitHub Authentication**, strict **Payload Validation** on all POST and PUT endpoints, and an **Automated Unit Testing Suite** covering all GET/GetAll routes.

---

## 🔗 Project Links

- **Render Live Swagger UI**: [https://cse-341-final-project-pidd.onrender.com/api-docs/](https://cse-341-final-project-pidd.onrender.com/api-docs/)
- **Render Live Web Service Root**: [https://cse-341-final-project-pidd.onrender.com/](https://cse-341-final-project-pidd.onrender.com/)
- **GitHub Repository**: [https://github.com/Moroni-Capcha/cse-341-final-project](https://github.com/Moroni-Capcha/cse-341-final-project)
- **YouTube Video Presentation (5–8 mins)**: `[Insert YouTube Link Here]`

---

## 📋 Overview of All Four Collections

The Portfolio Builder database manages developer identity, showcase works, career history, and recruiter outreach across four MongoDB collections:

### 1. `users` Collection (Developer Profiles)
- `_id`: Auto-generated MongoDB `ObjectId` (24-character hexadecimal string)
- `username`: String (Required, unique, min 3 characters)
- `email`: String (Required, unique, valid email format)
- `firstName`: String (Required)
- `lastName`: String (Required)
- `bio`: String (Optional biography or profile statement)
- `role`: String (Optional, e.g., "Full Stack Engineer")
- `skills`: Array of Strings (Optional technical skills)
- `githubUrl`: String (Optional link to GitHub profile)
- `portfolioUrl`: String (Optional personal portfolio website)
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp

### 2. `projects` Collection (Portfolio Showcase Projects)
- `_id`: Auto-generated MongoDB `ObjectId`
- `title`: String (Required, non-empty project title)
- `description`: String (Required, project overview and scope)
- `userId`: String (Required, valid 24-char hex ID referencing a `users` document)
- `technologies`: Array of Strings (Optional technologies used)
- `githubRepo`: String (Optional source code link)
- `liveUrl`: String (Optional live deployment link)
- `completed`: Boolean (Default: false)
- `featured`: Boolean (Default: false)
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp

### 3. `experiences` Collection (Work & Education Timeline)
- `_id`: Auto-generated MongoDB `ObjectId`
- `userId`: String (Required, valid 24-char hex ID referencing a `users` document)
- `company`: String (Required, employer or organization name)
- `role`: String (Required, job title or degree)
- `location`: String (Optional, e.g., "Remote", "Seattle, WA")
- `startDate`: String (Required, e.g., "2023-01-15")
- `endDate`: String / null (Optional, null if ongoing)
- `current`: Boolean (Default: false)
- `description`: String (Required, summary of duties & achievements)
- `technologies`: Array of Strings (Optional tools & frameworks)
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp

### 4. `contacts` Collection (Recruiter & Visitor Inquiries)
- `_id`: Auto-generated MongoDB `ObjectId`
- `userId`: String (Required, valid 24-char hex ID referencing recipient developer)
- `senderName`: String (Required, inquirer full name)
- `senderEmail`: String (Required, valid email format for reply)
- `subject`: String (Required, subject line of message)
- `message`: String (Required, inquiry body)
- `read`: Boolean (Default: false)
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp (when status updated)

---

## 🚀 API Endpoints Summary

All routes are fully documented with OpenAPI/Swagger interactive testing at `/api-docs`.

### Authentication Endpoints (`/`)
| Method | Endpoint | Description | Access | Success |
|---|---|---|---|---|
| `GET` | `/` | Root status (HTML login widget in browser / JSON for API) | Public | `200 OK` |
| `GET` | `/login` | Initiate GitHub OAuth 2.0 authorization redirect | Public | `302 Redirect` |
| `GET` | `/github/callback` | OAuth callback destination handling session creation | Public | `302 Redirect` |
| `GET` | `/logout` | Terminate session and clear authentication cookie | Public | `302 Redirect` |
| `GET` | `/auth/status` | Check authentication session status | Public | `200 OK` |

### 1. Users Endpoints (`/users`)
| Method | Endpoint | Description | Access | Success Code |
|---|---|---|---|---|
| `GET` | `/users` | Retrieve all users | Public | `200 OK` |
| `GET` | `/users/:id` | Retrieve single user by ObjectId | Public | `200 OK` |
| `POST` | `/users` | Register a new user with validation | Public | `201 Created` |
| `PUT` | `/users/:id` | Update an existing user by ID | **OAuth Required** | `200 OK` |
| `DELETE` | `/users/:id` | Delete user and cascade delete projects/experiences/contacts | **OAuth Required** | `200 OK` |

### 2. Projects Endpoints (`/projects`)
| Method | Endpoint | Description | Access | Success Code |
|---|---|---|---|---|
| `GET` | `/projects` | Retrieve all projects (filter with `?userId=`) | Public | `200 OK` |
| `GET` | `/projects/:id` | Retrieve project by ObjectId | Public | `200 OK` |
| `POST` | `/projects` | Create a new project for a valid user | **OAuth Required** | `201 Created` |
| `PUT` | `/projects/:id` | Update project by ID | **OAuth Required** | `200 OK` |
| `DELETE` | `/projects/:id` | Delete project by ID | **OAuth Required** | `200 OK` |

### 3. Experiences Endpoints (`/experiences`)
| Method | Endpoint | Description | Access | Success Code |
|---|---|---|---|---|
| `GET` | `/experiences` | Retrieve all experiences (filter with `?userId=`) | Public | `200 OK` |
| `GET` | `/experiences/:id` | Retrieve experience by ObjectId | Public | `200 OK` |
| `POST` | `/experiences` | Create new experience entry for user | **OAuth Required** | `201 Created` |
| `PUT` | `/experiences/:id` | Update experience details by ID | **OAuth Required** | `200 OK` |
| `DELETE` | `/experiences/:id` | Delete experience by ID | **OAuth Required** | `200 OK` |

### 4. Contacts Endpoints (`/contacts`)
| Method | Endpoint | Description | Access | Success Code |
|---|---|---|---|---|
| `GET` | `/contacts` | Retrieve developer contact inquiries (filter with `?userId=`) | **OAuth Required** | `200 OK` |
| `GET` | `/contacts/:id` | Retrieve specific contact message by ID | **OAuth Required** | `200 OK` |
| `POST` | `/contacts` | Public recruiter or visitor message submission | Public | `201 Created` |
| `PUT` | `/contacts/:id` | Update contact message (e.g., mark as read) | **OAuth Required** | `200 OK` |
| `DELETE` | `/contacts/:id` | Delete contact inquiry by ID | **OAuth Required** | `200 OK` |

---

## 🛡️ Data Validation & Error Handling

Data validation is implemented across **all four collections** in `middleware/validate.js`:

1. **Parameter ID Verification (`400 Bad Request`)**:
   All routes with an `:id` parameter check for a valid 24-character hexadecimal MongoDB ObjectId:
   ```json
   {
     "status": 400,
     "message": "Invalid ID format. Must be a 24-character hexadecimal string."
   }
   ```
2. **Payload Schema Validation on POST and PUT (`400 Bad Request`)**:
   Every mutating request body is evaluated against strict type, length, regex, and presence requirements:
   - `validateUser`: Checks `username` (>=3 chars), `email` (valid regex), `firstName`, `lastName`, and `skills` (array of strings).
   - `validateProject`: Checks `title`, `description`, `userId` (valid 24-char ObjectId), `technologies` (array), and booleans (`completed`, `featured`).
   - `validateExperience`: Checks `userId` (valid 24-char ObjectId), `company`, `role`, `startDate`, `description`, and booleans (`current`).
   - `validateContact`: Checks `userId` (valid 24-char ObjectId), `senderName`, `senderEmail` (valid email format), `subject`, and `message`.
   ```json
   {
     "status": 400,
     "message": "Validation failed for Experience.",
     "errors": [
       "Field \"company\" is required.",
       "Field \"role\" is required."
     ]
   }
   ```
3. **Foreign Key Integrity Verification (`404 Not Found`)**:
   When creating or updating projects, experiences, or contacts, the API verifies that the referenced `userId` exists in the `users` collection.
4. **Duplicate Prevention (`409 Conflict`)**:
   User creation verifies uniqueness for `username` and `email`.
5. **Centralized Error Handling (`middleware/errorHandler.js`)**:
   Runtime exceptions and unhandled promise rejections are converted to uniform JSON responses without leaking stack traces.

---

## 🔐 OAuth 2.0 Implementation & Route Protection

The API implements **GitHub OAuth 2.0** utilizing `passport`, `passport-github2`, and `express-session`:

- **Protected Routes**: All administrative operations (`POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`, `POST /experiences`, `PUT /experiences/:id`, `DELETE /experiences/:id`, `GET /contacts`, `GET /contacts/:id`, `PUT /contacts/:id`, `DELETE /contacts/:id`, `PUT /users/:id`, `DELETE /users/:id`) are gated by `middleware/authenticate.js`.
- **Unauthorized Behavior (`401 Unauthorized`)**:
  When an unauthenticated request attempts to access a protected endpoint, it receives:
  ```json
  {
    "status": 401,
    "message": "You do not have access. Please authenticate via /login first."
  }
  ```
- **Login Flow**:
  1. Navigate to `/login` (or `/auth/login`), which redirects to GitHub's OAuth authorization portal.
  2. Upon authorization, GitHub redirects to `/github/callback`.
  3. The callback establishes an HTTP session, saves `req.session.user`, and redirects to `/`.
  4. The root `/` visually displays `Logged in as [User]` with options to access Swagger UI or Log Out.
  5. Visiting `/logout` destroys the active session cookie and redirects back to `/` displaying `Logged Out`.

---

## 🧪 Automated Unit Testing (Jest & Supertest)

The project includes unit test suites in `tests/` covering all Get and GetAll routes across all collections:

- `tests/users.test.js`:
  - `GET /users` (GetAll users - 200)
  - `GET /users/:id` (GetById user - 200)
  - `GET /users/:id` (Non-existent ID - 404)
  - `GET /users/:id` (Invalid ID format - 400)
- `tests/projects.test.js`:
  - `GET /projects` (GetAll projects - 200)
  - `GET /projects/:id` (GetById project - 200)
  - `GET /projects/:id` (Non-existent ID - 404)
  - `GET /projects/:id` (Invalid ID format - 400)
- `tests/experiences.test.js`:
  - `GET /experiences` (GetAll experiences - 200)
  - `GET /experiences/:id` (GetById experience - 200)
  - `GET /experiences/:id` (Non-existent ID - 404)
  - `GET /experiences/:id` (Invalid ID format - 400)
- `tests/contacts.test.js`:
  - `GET /contacts` (GetAll contacts - 200)
  - `GET /contacts/:id` (GetById contact - 200)
  - `GET /contacts/:id` (Non-existent ID - 404)
  - `GET /contacts/:id` (Invalid ID format - 400)
- `tests/auth.test.js`:
  - `GET /auth/status` (Unauthenticated state - 200)
  - `POST /projects` (Unauthorized access rejection - 401)
  - `POST /experiences` (Unauthorized access rejection - 401)
  - `GET /contacts` (Unauthorized access rejection - 401)

### Running the Test Suite
Execute the following command in the project terminal:
```bash
npm test
```
**Result**: 5 test suites pass, 20 unit tests pass with green checkmarks.

---

## 🛠️ Local Setup & Configuration

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Moroni-Capcha/cse-341-final-project.git
cd cse-341-final-project
npm install
```

### 2. Environment Variables (`.env`)
Create a `.env` file in the project root:
```env
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio_builder?retryWrites=true&w=majority
SESSION_SECRET=your_express_session_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
CALLBACK_URL=http://localhost:8080/github/callback
```

### 3. Generate Swagger Docs
```bash
npm run swagger
```

### 4. Run Application
```bash
# Start server
npm start

# Development mode (auto-reload)
npm run dev

# Run automated tests
npm test
```

Visit the interactive Swagger UI at **[http://localhost:8080/api-docs](http://localhost:8080/api-docs)**.

---

## 🌐 Render Deployment Configuration

1. In Render Dashboard, connect the GitHub repository: `cse-341-final-project`.
2. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Under **Environment Variables**, define:
   - `MONGODB_URI`: MongoDB Atlas connection string.
   - `SESSION_SECRET`: Random secure secret string.
   - `GITHUB_CLIENT_ID`: GitHub OAuth app Client ID.
   - `GITHUB_CLIENT_SECRET`: GitHub OAuth app Client Secret.
   - `CALLBACK_URL`: `https://cse-341-final-project-pidd.onrender.com/github/callback`
   - `PORT`: `8080` (or let Render set default).
4. Access live API docs at:
   **[https://cse-341-final-project-pidd.onrender.com/api-docs/](https://cse-341-final-project-pidd.onrender.com/api-docs/)**

---

## 👥 Week 06 Deliverables & Individual Contributions

Per the assignment criteria (*"Each Team member document two individual contributions toward the weeks deliverables"*):

### Developer: Moroni Capcha
- **Contribution 1: CRUD Implementation & Validation for Last Two Collections (`experiences` & `contacts`)**:
  Engineered the complete controllers (`controllers/experiences.js`, `controllers/contacts.js`), route handlers (`routes/experiences.js`, `routes/contacts.js`), and validation middleware (`middleware/validate.js`). Enforced referential integrity verification against `users` and cascade cleanup logic upon user profile deletion.
- **Contribution 2: OAuth 2.0 Implementation & Route Authorization**:
  Implemented GitHub OAuth 2.0 authentication architecture in `server.js` using `passport`, `passport-github2`, and `express-session`. Created `middleware/authenticate.js` to protect sensitive and mutating endpoints (`projects`, `experiences`, `contacts`, and `users`), returning structured 401 Unauthorized responses to unauthenticated clients.
- **Contribution 3: Automated Unit Testing Suite (Jest & Supertest)**:
  Authored 5 test suites (`tests/users.test.js`, `tests/projects.test.js`, `tests/experiences.test.js`, `tests/contacts.test.js`, `tests/auth.test.js`) containing 20 automated unit tests testing all Get and GetAll endpoints, 404 not found handling, 400 ID validation, and 401 OAuth protection.

---

## 🎥 Video Presentation Guide (5 to 8 Minutes)

> **Important**: The video MUST be strictly between **5 and 8 minutes** and uploaded to YouTube.

### Step-by-Step Script Aligned with Rubric:

1. **0:00 - 1:00 | Introduction & Deployment Verification (Rubric Item 1)**
   - Introduce yourself: Moroni Capcha, CSE 341 Final Project Part 2.
   - Show the published Render link in browser: `https://cse-341-final-project-pidd.onrender.com/api-docs/`.
   - Point out that all sensitive credentials (`.env`) are kept out of GitHub via `.gitignore`.
2. **1:00 - 2:30 | OAuth Demonstration (Rubric Item 4)**
   - Open root URL `https://cse-341-final-project-pidd.onrender.com/` showing `Logged Out`.
   - Click "Sign in with GitHub" to trigger `/login` -> authorize with GitHub.
   - Show redirect back to `/` displaying `Logged in as [Your Name]`.
   - Attempt a protected route while logged out (or show 401 Unauthorized in Swagger/rest.http) and then execute while authenticated.
   - Demonstrate `/logout` returning the user to `Logged Out` state.
3. **2:30 - 4:30 | CRUD Operations Across Collections (Rubric Item 2)**
   - In Swagger UI at `/api-docs/`:
     - **Users**: Show `GET /users`, `POST /users` (create user).
     - **Projects**: Show `GET /projects`, `POST /projects`, `PUT /projects/{id}`, `DELETE /projects/{id}`.
     - **Experiences**: Show `GET /experiences`, `POST /experiences`, `PUT /experiences/{id}`, `DELETE /experiences/{id}`.
     - **Contacts**: Show `POST /contacts` (public submission) and `GET /contacts` (protected list).
   - Verify that updates are reflected in the database and correct HTTP status codes (`200`, `201`) are returned.
4. **4:30 - 6:00 | Data Validation Demonstration (Rubric Item 3)**
   - Test `POST` / `PUT` with missing required fields or invalid types: show `400 Bad Request` with structured error array.
   - Test passing an invalid ID (e.g., `invalid123`): show `400 Bad Request` ("Invalid ID format").
   - Test non-existent ID: show `404 Not Found`.
5. **6:00 - 7:00 | Automated Unit Tests (Rubric Item 5)**
   - Open terminal in VS Code and run `npm test`.
   - Show all 5 test suites running with Jest and Supertest.
   - Highlight that all unit tests exist and pass for all Get and GetAll routes across all database collections.
6. **7:00 - 7:45 | Individual Contributions & Conclusion (Rubric Item 6)**
   - Summarize the individual contributions documented in the README and project deliverables.
   - Conclude presentation within the 5–8 minute window.
