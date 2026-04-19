# Event Booking System - API Documentation

This document outlines the backend API structure for the Event Booking System, built with React Router v7 Resource Routes. The system supports two primary roles: **Organizers** and **Customers**.

## 1. API Endpoints

| Category | Endpoint | Method | Role Access | Description | Background Task |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/auth/signup` | `POST` | Public | Registers a new user (Customer/Organizer). | None |
| **Auth** | `/auth/login` | `POST` | Public | Authenticates user and sets session cookie. | None |
| **Auth** | `/auth/logout` | `POST` | Auth | Clears user session. | None |
| **Organizer** | `/api/events/create` | `POST` | **Organizer** | Creates a new event with auto-increment ID (`evt-xxx`). | None |
| **Organizer** | `/api/events/:id` | `PATCH` | **Organizer** | Updates event details (Title/Description). | **Task 2:** Event Update Notification |
| **Customer** | `/api/events` | `GET` | Public | Lists all available events for browsing. | None |
| **Customer** | `/api/events/:id` | `GET` | Public | Fetches detailed info for a specific event. | None |
| **Customer** | `/api/events/:id/book`| `POST` | **Customer** | Books a ticket for the specified event. | **Task 1:** Booking Confirmation Email |
| **Customer** | `/api/me/bookings` | `GET` | **Customer** | Retrieves all bookings for the logged-in user. | None |
| **System** | `/moo` | `GET` | Public | System health check / test route. | None |

## 2. Background Tasks (Asynchronous)

The system utilizes a non-blocking `jobQueue` to handle long-running processes, ensuring the API remains responsive.

# Local Development Setup

This project uses a branch-based strategy for deployment and local development. 
- **main**: Production code configured for Vercel.
- **node**: Development code configured for local execution.

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed:
* **Node.js** (v18 or higher recommended)
* **npm** or **pnpm**
* **VS Code** (with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for testing)

---

## 🚀 Getting Started

### 1. Clone and Switch Branch
First, clone the repository and switch to the `node` branch:

```bash
git clone <your-repo-url>
cd event-booking-system
git checkout node
npm install
npm run build
npm run start
```

🧪 Testing the APIs
1. Open the api.http file located in the root directory.
2. Ensure the @baseUrl variable is set to http://localhost:3000.
3. Click the "Send Request" link above any endpoint to execute it.
4. Check your terminal/console to see the Background Task logs (Emails and Notifications).