# FlavorAI Backend

This is the backend for the "FlavorAI" application, a personal recipe discovery platform. It helps users discover and manage recipes.

## Getting Started

Follow these steps to get the backend and its database running on your local machine using Docker.

### Prerequisites

-   [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### 1. Clone the repository and set up environment variables

First, clone the backend repository:

```bash
git clone https://github.com/mykhailokurochkin/flavorai-backend.git
cd flavorai-backend
```

Then, create a `.env` file in the root of the project with the following content:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=flavoraidb
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}?schema=public"
JWT_SECRET="your_strong_jwt_secret_key" # IMPORTANT: Change this to a unique, complex string!
PORT=4000
```

### 2. Build and Run with Docker Compose

In your terminal, from the project's root directory, run:

```bash
docker-compose up --build
```

This command will:
-   Build the backend application's Docker image.
-   Start the PostgreSQL database container.
-   Start the backend application container.

The backend will be accessible at `http://localhost:4000`.

### 3. Run Prisma Migrations

After the containers are running (especially the first time), apply the database migrations. Open a **new terminal** in the project root and execute:

```bash
docker-compose exec backend npx prisma migrate dev --name init
```

This sets up your database schema.

### 4. Frontend Application

To run the frontend, please visit its repository:

[FlavorAI Frontend Repository](https://github.com/mykhailokurochkin/flavorai-frontend)

The frontend runs on port `3000` and connects to this backend on `http://localhost:4000`.