import {
    events, getUserFromCookie 
} from "../utils/db.server";

// GET: Browse Events (Current functionality)
export async function loader() {
    return Response.json({
        events 
    });
}

// POST: Create Event (Organizer Only)
export async function action({
    request 
}) {
    if (request.method !== "POST") {
        return Response.json({
            error: "Method not allowed" 
        }, {
            status: 405 
        });
    }

    const user = getUserFromCookie(request);
    
    // Role Guard
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

    if (!title) {
        return Response.json({
            error: "Title is required" 
        }, {
            status: 400 
        });
    }
    // Calculate the next ID (e.g., evt-103)
    const lastId = events.reduce((max, e) => {
        const num = parseInt(e.id.split("-")[1]);
        return num > max ? num : max;
    }, 0);

    const newId = `evt-${lastId + 1}`;

    const newEvent = {
        id: newId,
        title,
        description: description ?? "",
        // capacity: capacity ?? 100,
        organizerId: user.userId,
        isDefault: false
        // createdAt: new Date().toISOString()
    };

    events.push(newEvent);

    return Response.json({ 
        ok: true, 
        event: newEvent 
    }, { 
        status: 201 
    });
}
