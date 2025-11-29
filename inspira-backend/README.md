# Inspira Backend

This is the backend for the Inspira project, built using TypeScript, Node.js, and Express. The application connects to a SQL database using Prisma ORM and provides a RESTful API for the frontend to interact with.

## Project Structure

The project is organized into the following main directories:

- **src/**: Contains the source code for the backend application.
  - **config/**: Configuration files for the application, including environment variables and CORS settings.
  - **controllers/**: Logic for handling incoming requests and responses.
  - **routes/**: Defines the API endpoints and links them to their respective controllers.
  - **services/**: Contains business logic related to different functionalities.
  - **middleware/**: Middleware functions for authentication and error handling.
  - **validators/**: Validation logic for incoming requests.
  - **types/**: TypeScript types and interfaces used throughout the application.
  - **utils/**: Utility functions that can be reused across the application.
  - **prisma/**: Contains the Prisma client and database schema.

- **prisma/**: Contains the Prisma schema and seed files for initializing the database.

- **.env.example**: Example environment variables needed for the application.

- **.gitignore**: Specifies files and directories to be ignored by Git.

- **package.json**: Lists the dependencies and scripts for the project.

- **tsconfig.json**: TypeScript compiler options and settings.

## Getting Started

### Final Steps to Run in Terminal:

1. Navigate to the project directory:
   ```
   cd inspira-backend
   ```

2. Install dependencies:
   ```
   npm install express prisma @prisma/client cors dotenv
   ```

3. Initialize Prisma:
   ```
   npx prisma init
   ```

4. Update the `prisma/schema.prisma` file with your database connection details and models.

5. Run migrations:
   ```
   npx prisma migrate dev --name init
   ```

6. Seed the database (if applicable):
   ```
   npx prisma db seed
   ```

### Frontend and Backend Communication

The frontend communicates with the backend through HTTP requests to the API endpoints defined in the Express routes. The frontend should make requests to `http://localhost:5000/api/...` for various operations such as authentication, fetching student progress, and managing assignments. Ensure that the fetch/axios calls in the frontend are updated to match the new API structure.