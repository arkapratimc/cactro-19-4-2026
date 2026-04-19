import {
    events, bookings, jobQueue, getUserFromCookie 
} from "../utils/db.server";
// import { getUserFromCookie } from "../../utils/auth.server";

// GET: View specific event
export async function loader({
    params 
}) {
    const event = events.find(e => e.id === params.id);
    if (!event) return Response.json({
        error: "Event not found" 
    }, {
        status: 404 
    });
    return Response.json(event);
}

// PATCH/PUT: Update event (Organizer Only)
export async function action({
    request, params 
}) {
    if (request.method !== "PATCH" && request.method !== "PUT") {
        return Response.json({
            error: "Method not allowed" 
        }, {
            status: 405 
        });
    }

    const user = getUserFromCookie(request);
    // Role Guard: Only ORGANIZER can update
    if (!user || user.role !== "ORGANIZER") {
        return Response.json({
            error: "Forbidden: Organizers only" 
        }, {
            status: 403 
        });
    }

    const {
        title, description 
    } = await request.json();
    const eventIndex = events.findIndex(e => e.id === params.id);

    if (eventIndex === -1) return Response.json({
        error: "Not found" 
    }, {
        status: 404 
    });

    // Update the record
    events[eventIndex] = {
        ...events[eventIndex],
        title: title ?? events[eventIndex].title,
        description: description ?? events[eventIndex].description
    };

    // Prepare list of emails to notify
    const notifiedEmails = bookings
        .filter(b => b.eventId === params.id)
        .map(b => b.customerEmail);

    // 🔥 ASYNC BACKGROUND TASK 2
    // We offload the notification process to the queue
    jobQueue.push("NOTIFY_UPDATE", {
        emails: notifiedEmails,
        message: `The event "${events[eventIndex].title}" has new details. Check it out!`
    });

    return Response.json({
        ok: true,
        event: events[eventIndex],
        note: "Event updated. Notifications are being sent to attendees in the background."
    });
}
