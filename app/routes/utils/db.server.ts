// app/utils/db.server.ts
// import { createCookieSessionStorage } from "react-router";
import jwt from "jsonwebtoken";
/**
 * MOCK DATABASE 
 * isDefault: true denotes hardcoded records
 * Passwords are kept as readable strings for initial testing/demo
 */

export const users = [
    { 
        id: "mgr-1", 
        email: "organizer@cactro.com", 
        password: "password123", // Dummy readable password
        role: "ORGANIZER",
        isDefault: true 
    },
    { 
        id: "cust-1", 
        email: "customer@gmail.com", 
        password: "password123", 
        role: "CUSTOMER",
        isDefault: true 
    },
    { 
        id: "cust-2", 
        email: "tester@gmail.com", 
        password: "password123", 
        role: "CUSTOMER",
        isDefault: true 
    }
];

export const events = [
    { 
        id: "evt-101", 
        title: "Tech Global Summit 2026", 
        description: "The biggest tech event of the year.", 
        organizerId: "mgr-1",
        isDefault: true 
    },
    { 
        id: "evt-102", 
        title: "React Router v7 Deep Dive", 
        description: "Mastering full-stack actions and loaders.", 
        organizerId: "mgr-1",
        isDefault: true 
    }
];

export const bookings = [
    { 
        id: "bk-1", 
        eventId: "evt-101", 
        customerId: "cust-1", 
        customerEmail: "customer@gmail.com",
        isDefault: true 
    },
    { 
        id: "bk-2", 
        eventId: "evt-101", 
        customerId: "cust-2", 
        customerEmail: "tester@gmail.com",
        isDefault: true 
    }
];

// app/utils/db.server.ts (or auth.server.ts)

const SECRET = "cactro_test_secret_999";

export function createSession(user: any) {
    // We sign the ID and Role so we don't have to search the DB 
    // to know if they are an ORGANIZER or CUSTOMER later.
    const token = jwt.sign(
        { 
            userId: user.id, 
            email: user.email, 
            role: user.role 
        }, 
        SECRET, 
        {
            expiresIn: "1h" 
        }
    );

    // Standard HttpOnly cookie string
    return `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`;
}

export function getUserFromCookie(request: Request) {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    // Extract the token from the "session=..." string
    const match = cookieHeader.match(/session=([^;]+)/);
    if (!match) return null;

    const token = match[1];

    try {
        // This returns the payload: { userId, email, role }
        const decoded = jwt.verify(token, SECRET);
        return decoded;
    } catch (err) {
        // Token expired or invalid
        return null;
    }
}

// app/utils/auth.server.ts

export function destroySession() {
    // Max-Age=0 tells the browser to delete the cookie immediately
    return "session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0";
}

// app/utils/db.server.ts

/**
 * Simple In-Memory Job Queue
 * * This utility simulates a background worker (like BullMQ or RabbitMQ).
 * By using `setTimeout`, we move the execution to the next "Macro-task" in the 
 * Node.js Event Loop. This ensures the API response is sent immediately to the 
 * user, while "heavy" operations (like sending emails or batch notifications) 
 * run asynchronously without blocking the main thread.
 */
export const jobQueue = {
    push: (taskName: string, data: any, delay = 2000) => {
        console.log(`[Queue] Job added: ${taskName}`);
        
        // We use setTimeout to make it truly "async" and non-blocking
        setTimeout(() => {
            console.log(`\n--- BACKGROUND WORKER: PROCESSING ${taskName} ---`);
            if (taskName === "SEND_BOOKING_EMAIL") {
                console.log(`To: ${data.email}`);
                console.log(`Subject: Confirmation for ${data.eventTitle}`);
                console.log(`Body: Your booking ID is ${data.bookingId}`);
            }
            if (taskName === "NOTIFY_UPDATE") {
                console.log(`Broadcasting to: ${data.emails.join(", ")}`);
                console.log(`Update: ${data.message}`);
            }
            console.log(`--- WORKER: ${taskName} COMPLETED ---\n`);
        }, delay);
    }
};
