import {
    bookings, events, getUserFromCookie 
} from "../utils/db.server";

export async function loader({
    request 
}) {
    // 1. Authenticate user
    const user = getUserFromCookie(request);

    if (!user) {
        return Response.json({
            error: "Unauthorized"
        }, {
            status: 401
        });
    }

    // 2. Filter bookings belonging to this user
    const myBookings = bookings
        .filter(b => b.customerId === user.userId)
        .map(b => {
            // Enrich the booking data with the event title
            const event = events.find(e => e.id === b.eventId);
            return {
                ...b,
                eventTitle: event ? event.title : "Unknown Event"
                // eventDate: event ? event.date : null
            };
        });

    return Response.json({
        ok: true,
        bookings: myBookings
    });
}
