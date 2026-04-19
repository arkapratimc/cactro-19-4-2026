import {
    bookings, events, getUserFromCookie, jobQueue 
} from "../utils/db.server";
// import { getUserFromCookie } from "../../utils/auth.server";

export async function action({
    request, params 
}) {
    if (request.method !== "POST") {
        return Response.json({
            error: "Method not allowed" 
        }, {
            status: 405 
        });
    }

    const user = getUserFromCookie(request);
    // Role Guard: Only CUSTOMER can book
    if (!user || user.role !== "CUSTOMER") {
        return Response.json({
            error: "Forbidden: Only customers can book tickets" 
        }, {
            status: 403 
        });
    }

    const event = events.find(e => e.id === params.id);
    if (!event) return Response.json({
        error: "Event not found" 
    }, {
        status: 404 
    });

    // Check if already booked
    const alreadyBooked = bookings.find(b => b.eventId === params.id && b.customerId === user.userId);
    if (alreadyBooked) return Response.json({
        error: "Already booked" 
    }, {
        status: 400 
    });

    const newBooking = {
        id: `bk-${bookings.length + 1}`,
        eventId: params.id,
        customerId: user.userId,
        customerEmail: user.email,
        isDefault: false
    };

    bookings.push(newBooking);

    // 🔥 ASYNC BACKGROUND TASK
    // We don't 'await' this. We push and move on.
    jobQueue.push("SEND_BOOKING_EMAIL", {
        email: user.email,
        eventTitle: event.title,
        bookingId: newBooking.id
    });

    return Response.json({
        ok: true,
        bookingId: newBooking.id 
    }, {
        status: 201 
    });
}
