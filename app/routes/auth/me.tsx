import {
    getUserFromCookie 
} from "../utils/db.server";

export async function loader({
    request 
}) {
    const user = getUserFromCookie(request);

    if (!user) {
        return Response.json(
            {
                error: "not logged in" 
            },
            {
                status: 401 
            }
        );
    }

    // Returns { userId, email, role, iat, exp }
    return Response.json({
        loggedIn: true,
        user
    });
}
