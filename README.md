# PoultryPro

Live Demo https://poultrypro.net (jason.miller@email.com - password)

<img width="800" alt="Signup" src="https://github.com/user-attachments/assets/6328ab90-3593-4d5f-b636-4a84fcfb73e1">

<img width="800" alt="dashboard" src="https://github.com/user-attachments/assets/e963ae2f-a92e-41fa-ae18-ef5a7f3dcb35">

This project is a frontend client that allows users to manage poultry farms and their associated data. It provides features for user authentication, farm management, poultry management, and data analysis.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack and Architecture](#tech-stack-and-architecture)
- [Frontend](#frontend)
- [Backend](#backend)
- [Deployment](#deployment)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Architecture Overview](#architecture-overview)

## Installation

To set up the PoultryPro frontend client on your local machine, follow these steps:

1. Clone the frontend repository:

   ```
   HTTPS - git clone https://github.com/TaylorBeck/poultrypro-client.git
   SSH - git clone git@github.com:TaylorBeck/poultrypro-client.git
   cd poultrypro-client
   ```
2. Clone the backend repository:

    ```
    HTTPS - git clone https://github.com/TaylorBeck/poultrypro-server.git
    SSH - git clone git@github.com:TaylorBeck/poultrypro-server.git
    cd poultrypro-server
    ```

3. Install dependencies:

   ```
   npm install
   ```

4. Create a frontend `.env` file in the root directory and add the necessary environment variables:

   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_API_URL=http://localhost:3001 # or your deployed backend URL
   ```
  
5. Create a backend `.env` file in the root directory and add the necessary environment variables:

    ```
    PORT=3001
    FIREBASE_TYPE="service_account"
    FIREBASE_PROJECT_ID=""
    FIREBASE_PRIVATE_KEY=""
    FIREBASE_PRIVATE_KEY_ID=""
    FIREBASE_CLIENT_EMAIL=""
    FIREBASE_CLIENT_ID=""
    FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
    FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
    FIREBASE_CLIENT_X509_CERT_URL=""
    FIREBASE_UNIVERSE_DOMAIN="googleapis.com"
    FIREBASE_DATABASE_URL=""
    ```

6. Start the development servers on the frontend and backend:

   ```
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173` to view the application.

Note: Make sure you have Node.js (version 14 or later, ideally 20) and npm installed on your machine before starting the installation process.

## Usage

1. Sign in to the application at https://poultrypro.net (jason.miller@email.com - password)
2. Alternatively, sign up at https://poultrypro.net/sign-up (_takes roughly 5 seconds for database seeding_).
3. Navigate to /chickens or /farms to Add/Edit/Delete poultry in your farm and track their health and growth.
4. Each chicken will have a timeline of its measurements:

<img width="300" alt="measurements" src="https://github.com/user-attachments/assets/78e077f5-166a-47f9-8504-3e18f0c64284">

6. Then for guest access, use a guest token (created automatically durin): https://poultrypro.net/guest/uniqueAccessToken2

<img width="800" alt="guestAccess" src="https://github.com/user-attachments/assets/e8dbdf21-015c-4e4c-9f4c-1b685efe44e4">

7. A list of your farm business' orders can be accessed at /orders and downloaded as a CSV file.

<img width="800" alt="orders-page" src="https://github.com/user-attachments/assets/9340e87e-3d79-4cbe-976f-d2a0dceb41bc">

8. NOTE: Navigating to a path that doesn't exist will end up on the 404 page. Simply go back or sign in again to continue.

<img width="800" alt="404" src="https://github.com/user-attachments/assets/ccc8dfd2-c69a-4b97-90c3-6e3a9a2ff6ae">

## Tech Stack and Architecture

### Frontend

- React 18
- Vite for build tooling
- Material-UI (MUI) for UI components
- Redux Toolkit for state management
- React Router for navigation
- Chart.js for data visualization
- Firebase for authentication and real-time database
- Axios for API requests
- Domain hosted in Route 53

### Backend

- Node.js with Express.js framework
- Firebase Admin SDK for authentication and database interactions
- Body-parser for parsing incoming request bodies
- CORS for Cross-Origin Resource Sharing
- Helmet for setting various HTTP headers for security
- Morgan for HTTP request logging
- Dotenv for environment variable management
- Azure App Service (P0v3 plan)
- Custom autoscaling rules:
  - Scale out: +1 instance when CPU > 70% for 5 minutes
  - Scale in: -1 instance when CPU < 25% for 5 minutes
  - Min instances: 1, Max instances: 5
  - Cost-effective, and adjustable up to 30 max instances as needed

<img width="697" alt="autoscaling-rule" src="https://github.com/user-attachments/assets/0041c199-caa8-4d22-902d-f511d48e9609">

### Deployment

- Azure Static Web Apps (Standard plan with Enterprise Grade Edge)
- GitHub Actions for CI/CD

### Monitoring and Analytics

- Azure Application Insights

### Architecture Overview

<img width="1118" alt="resource-visualizer" src="https://github.com/user-attachments/assets/4a83e392-6962-47b5-84a8-cc8848c68a36">

The PoultryPro application is built on a modern, scalable architecture leveraging Azure cloud services:

1. The frontend is a React-based Single Page Application (SPA) currently hosted on Azure Static Web Apps. I also set up an App Service for the frontend as displayed in the diagram. Pros and cons are listed below.
2. Backend services are provided by Azure App Service, with custom autoscaling for performance and cost optimization.
3. Authentication is handled through Firebase, integrated with the React frontend and Express backend.
4. State management is centralized using Redux Toolkit for predictable data flow.
5. Continuous Integration and Deployment (CI/CD) is implemented using GitHub Actions, automatically deploying to Azure on code changes to the main branch.
6. Application performance and user behavior is monitored using Azure Application Insights.

This architecture ensures high performance, scalability, and maintainability while providing a smooth development and deployment workflow.

## Azure Hosting Comparison: App Service vs Static Web Apps

### Azure App Service
- Pros:
  - Highly scalable
  - Integrates well with other Azure services
  - More control over server environment
- Cons:
  - More expensive for simple applications
  - More complex to set up and manage
  - Can have cold start times

### Azure Static Web Apps
- Pros:
  - Cost-effective for static content
  - Global content distribution
  - Free SSL certificates
- Cons:
  - Less flexible for complex configurations
  - Some resource limitations
  - Primarily for static and JavaScript-based apps
