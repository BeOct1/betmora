# Betmora - Movie Discovery & Social Platform

Betmora is a full-stack web application designed for movie enthusiasts to discover new films, manage personal watchlists, and connect with other users. The frontend is built with React and Vite, and the backend is a Node.js and Express server, with data sourced from the TMDB API.

## Features

*   **User Authentication:** Secure user registration and login with JWT-based authentication.
*   **Movie Discovery:** Browse popular movies, search for specific titles, and view detailed information.
*   **Personal Watchlist:** Add movies to a personal watchlist to track films you want to see.
*   **Favorites:** Mark movies as favorites to create a personalized collection.
*   **Movie Reviews & Ratings:** (Future feature) Rate movies and write reviews.
*   **Social Features:** (Future feature) Follow other users and see their activity.

## Tech Stack

| Category      | Technology                                      |
|---------------|-------------------------------------------------|
| **Frontend**  | React, Vite, React Router, Axios, Bootstrap     |
| **Backend**   | Node.js, Express.js, Mongoose                   |
| **Database**  | MongoDB                                         |
| **API**       | The Movie Database (TMDb)                       |
| **Deployment**| Frontend on Vercel, Backend on Render           |

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn)
*   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BeOct1/betmora.git
    cd betmora
    ```

2.  **Setup Backend:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add the following environment variables:
        ```env
        # MongoDB Connection String
        MONGO_URI=your_mongodb_connection_string

        # JWT Secret for signing tokens
        JWT_SECRET=your_jwt_secret

        # The Movie Database API Key
        TMDB_API_KEY=your_tmdb_api_key

        # Server Port
        PORT=5001

        # Node environment
        NODE_ENV=development
        ```

3.  **Setup Frontend:**
    *   Navigate to the frontend directory from the root:
        ```bash
        cd frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env.local` file in the `frontend` directory and add the following environment variable. This tells your frontend where the backend is running in development.
        ```env
        # URL of the backend server for Vite's proxy
        VITE_API_URL=http://localhost:5001
        ```

### Running the Application

1.  **Start the Backend Server:**
    *   From the `backend` directory, run:
        ```bash
        npm run dev
        ```
    *   The server will start on the port specified in your `.env` file (e.g., `http://localhost:5001`).

2.  **Start the Frontend Development Server:**
    *   From the `frontend` directory, run:
        ```bash
        npm run dev
        ```
    *   The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Deployment

The application is configured for deployment on:

*   **Frontend:** [Vercel](https://vercel.com/), using the configuration in `frontend/.vercel.json`.
*   **Backend:** [Render](https://render.com/), using the configuration in `render.yaml`.

Pushes to the `main` branch will automatically trigger new deployments.
