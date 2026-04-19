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

### Background Task 1: Booking Confirmation
- **Trigger:** Successful ticket booking via `POST /api/events/:id/book`.
- **Action:** Simulates sending a confirmation email to the customer.
- **Log Example:** `[Job Queue]: Sending booking confirmation email to customer@test.com for event "Tech Global Summit 2026"`

### Background Task 2: Event Update Notification
- **Trigger:** Event modification via `PATCH /api/events/:id`.
- **Action:** Notifies all customers who have already booked a ticket for that specific event.
- **Log Example:** `[Job Queue]: Notifying 15 attendees that event "React Router Workshop" has been rescheduled.`

## 3. Data Logic
- **Auto-Increment IDs:** Events are assigned IDs using the pattern `evt-XXX` by calculating the maximum existing ID in the system.
- **Security:** Role-based access is strictly enforced using `getUserFromCookie`. If a Customer attempts to access an Organizer route, a `403 Forbidden` response is returned.