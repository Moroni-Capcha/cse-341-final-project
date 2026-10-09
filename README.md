# CSE 341 Final Project - Portfolio Builder API (Week 05 Deliverables)

An Express.js and MongoDB REST API for the **Portfolio Builder** web service, built with comprehensive CRUD operations for two collections (`users` and `projects`), robust error handling and input validation, and interactive Swagger API documentation deployed at `/api-docs`.

---

## 🔗 Project Links

- **Render Live Site**: [https://cse-341-final-project.onrender.com/api-docs](https://cse-341-final-project.onrender.com/api-docs) *(Update with your team's Render URL)*
- **GitHub Repository**: [https://github.com/<your-username>/cse-341-final-project](https://github.com/<your-username>/cse-341-final-project) *(Update with your repository URL)*
- **YouTube Video Presentation (5–8 mins)**: `[Insert YouTube Link Here]`

---

## 📋 Overview & Collections

This API powers a developer portfolio builder platform with two primary MongoDB collections:

### 1. `users` Collection
Represents portfolio authors and developers.
- `_id`: Auto-generated MongoDB `ObjectId` (24-character hexadecimal string)
- `username`: String (Required, min 3 characters, unique)
- `email`: String (Required, valid email format, unique)
- `firstName`: String (Required)
- `lastName`: String (Required)
- `bio`: String (Optional biography or profile statement)
- `role`: String (Optional, e.g. "Full Stack Developer", "UX Designer")
- `skills`: Array of Strings (Optional list of technical skills)
- `githubUrl`: String (Optional link to GitHub profile)
- `portfolioUrl`: String (Optional personal portfolio website)
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp

### 2. `projects` Collection
Represents individual portfolio showcase projects associated with a user.
- `_id`: Auto-generated MongoDB `ObjectId` (24-character hexadecimal string)
- `title`: String (Required, non-empty project title)
- `description`: String (Required, project overview and scope)
- `userId`: String (Required, valid 24-char hex ID referencing an existing `users` record)
- `technologies`: Array of Strings (Optional technologies used)
- `githubRepo`: String (Optional source code link)
- `liveUrl`: String (Optional live deployment link)
- `completed`: Boolean (Default: false)
- `featured`: Boolean (Default: false)
- `createdAt`: ISO Date timestamp
- `updatedAt`: ISO Date timestamp

---

## 🚀 API Endpoints Summary

All routes are fully documented and interactive in Swagger at `/api-docs`.

### Users Endpoints (`/users`)
| Method | Endpoint | Description | Success Code | Error Codes |
|---|---|---|---|---|
| `GET` | `/users` | Retrieve all users | `200 OK` | `500` |
| `GET` | `/users/:id` | Retrieve user by MongoDB ObjectId | `200 OK` | `400, 404, 500` |
| `POST` | `/users` | Create a new user with validation | `201 Created` | `400, 409, 500` |
| `PUT` | `/users/:id` | Update an existing user by ID | `200 OK` | `400, 404, 500` |
| `DELETE` | `/users/:id` | Delete user and cascaded projects | `200 OK` | `400, 404, 500` |

### Projects Endpoints (`/projects`)
| Method | Endpoint | Description | Success Code | Error Codes |
|---|---|---|---|---|
| `GET` | `/projects` | Retrieve all projects (filter with `?userId=`) | `200 OK` | `500` |
| `GET` | `/projects/:id` | Retrieve project by MongoDB ObjectId | `200 OK` | `400, 404, 500` |
| `POST` | `/projects` | Create a new project for a valid user | `201 Created` | `400, 404, 500` |
| `PUT` | `/projects/:id` | Update project by ID | `200 OK` | `400, 404, 500` |
| `DELETE` | `/projects/:id` | Delete project by ID | `200 OK` | `400, 404, 500` |

---

## 🛡️ Error Handling & Validation Focus

Per the Week 05 rubric requirements, error handling and validation are thoroughly enforced:

1. **ID Validation (`400 Bad Request`)**: Every route accepting an `:id` parameter verifies it is a valid 24-character hexadecimal MongoDB ObjectId. Invalid strings instantly receive:
   ```json
   {
     "status": 400,
     "message": "Invalid ID format. Must be a 24-character hexadecimal string."
   }
   ```
2. **Payload Validation (`400 Bad Request`)**: All `POST` and `PUT` bodies are verified for required attributes, data types, email formatting, and valid references before reaching database queries:
   ```json
   {
     "status": 400,
     "message": "Validation failed for User.",
     "errors": [
       "Field \"username\" is required and must be at least 3 characters.",
       "Field \"email\" is required and must be a valid email address."
     ]
   }
   ```
3. **Resource Not Found (`404 Not Found`)**: Lookups for non-existent IDs return explicit 404 error responses with descriptive messages.
4. **Duplicate Prevention (`409 Conflict`)**: Creating a user with a duplicate `username` or `email` responds with `409 Conflict`.
5. **Foreign Key Verification (`404 Not Found`)**: Creating a project checks that the referenced `userId` exists in the database.
6. **Centralized Error Handling**: Uncaught errors and server exceptions are caught by express middleware and returned as structured JSON rather than crashing the node process.

---

## 🛠️ Local Setup & Execution

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/cse-341-final-project.git
cd cse-341-final-project
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio_builder?retryWrites=true&w=majority
```

### 3. Generate Swagger Docs (if modifying routes)
```bash
npm run swagger
```

### 4. Run Locally
```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

Visit the documentation at:
- **[http://localhost:8080/api-docs](http://localhost:8080/api-docs)**

---

## 🧪 Testing the API

### Option A: Interactive Swagger UI
Open `http://localhost:8080/api-docs` or your Render deployment `/api-docs`. You can execute GET, POST, PUT, and DELETE queries directly with example payloads.

### Option B: VS Code REST Client
Use the included `rest.http` file in the root directory to trigger requests with the REST Client extension for Visual Studio Code.

---

## 🌐 Deploying to Render

1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), click **New** -> **Web Service**.
3. Connect your GitHub repository `cse-341-final-project`.
4. Configure service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `PORT`: `8080` (or allow Render default).
6. Click **Create Web Service**. Once deployed, verify your docs at:
   `https://<your-service-name>.onrender.com/api-docs`

---

## 👥 Week 05 Team Deliverables & Individual Contributions

Per the assignment instructions (*"Each Team member document two individual contributions toward the weeks deliverables"*):

### Team Member 1: `[Student Name]`
- **Contribution 1**: Designed the MongoDB database schema and implemented the full CRUD controller & route handlers for the `users` collection (`getAllUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`).
- **Contribution 2**: Implemented request input validation middleware (`middleware/validate.js`) for data formats, required fields, and 24-character hexadecimal MongoDB ObjectId checking.

### Team Member 2: `[Student Name]`
- **Contribution 3**: Implemented full CRUD controller & route handlers for the `projects` collection (`getAllProjects`, `getProjectById`, `createProject`, `updateProject`, `deleteProject`) including relational validation with `userId`.
- **Contribution 4**: Configured Swagger autogen, dynamic host resolution in `routes/swagger.js`, and verified deployment on Render with working `/api-docs`.

*(If your team has additional members, document their 2 contributions following this format).*

---

## 🎥 Video Presentation Guide (5 to 8 Minutes)

Make sure the video stays strictly between **5 and 8 minutes** (videos outside this range receive penalties per rubric).

### Recommended Outline:
1. **0:00 - 1:00 | Introduction & Overview**:
   - Introduce yourself / team members present in the call.
   - State the project domain: Portfolio Builder API.
   - Show GitHub repository structure and commit history.
2. **1:00 - 2:30 | First Collection (Users)**:
   - Open Render `/api-docs` live link.
   - Demonstrate `GET /users` (show list).
   - Demonstrate `POST /users` (create a user, show 201 response with generated ID).
   - Demonstrate `GET /users/{id}` and `PUT /users/{id}` (show update).
   - Demonstrate `DELETE /users/{id}`.
3. **2:30 - 4:00 | Second Collection (Projects)**:
   - Demonstrate `GET /projects`.
   - Demonstrate `POST /projects` using the user ID created earlier.
   - Demonstrate `GET /projects/{id}` and `PUT /projects/{id}`.
   - Demonstrate `DELETE /projects/{id}`.
4. **4:00 - 5:30 | Error Handling & Validation Demonstration**:
   - Pass an invalid ID format (e.g. `invalid123`) to show `400 Bad Request`.
   - Pass non-existent ID to show `404 Not Found`.
   - Send invalid `POST` body with missing required fields to show field validation error.
   - Show that error handling does not crash the server and returns JSON error contracts.
5. **5:30 - 6:30 | Render Live Deployment & Team Contributions**:
   - Confirm the live Render URL `https://.../api-docs` executes live requests against MongoDB Atlas.
   - Highlight the 2 individual contributions documented in the README.
