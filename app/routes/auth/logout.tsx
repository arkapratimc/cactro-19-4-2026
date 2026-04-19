import {
    destroySession 
} from "../utils/db.server.js";

export async function action({
    request 
}) {
    // Standard React Router v7 check if you aren't using the assertMethod helper
    if (request.method !== "POST") {
        return Response.json({
            error: "Method not allowed" 
        }, {
            status: 405 
        });
    }

    return Response.json(
        {
            ok: true,
            message: "Logged out successfully" 
        },
        {
            headers: {
                "Set-Cookie": destroySession()
            }
        }
    );
}
