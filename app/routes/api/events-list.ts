import {
    events 
} from "../utils/db.server";

export async function loader({
    request 
}) {
    // Standard GET check
    if (request.method !== "GET") {
        return Response.json({
            error: "Method not allowed" 
        }, {
            status: 405 
        });
    }

    // Return the list of events (using our hardcoded 'isDefault' data + new ones)
    return Response.json({
        events 
    });
}
