import bcrypt from "bcrypt";
import {
    users, createSession 
} from "../utils/db.server";

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

    const {
        email, password 
    } = await request.json();

    // 1. Find user in our mock array
    const user = users.find(u => u.email === email);

    if (!user) {
        return Response.json({
            error: "User not found" 
        }, {
            status: 401 
        });
    }

    // 2. Hybrid Password Check
    let isMatch = false;

    if (user.isDefault) {
        // Simple check for hardcoded users (e.g., "password123")
        isMatch = user.password === password;
    } else {
        // Bcrypt check for newly signed-up users
        isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
        return Response.json({
            error: "Wrong password" 
        }, {
            status: 401 
        });
    }

    // 3. Return success with the cookie header
    return Response.json(
        { 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            } 
        },
        {
            headers: {
                "Set-Cookie": createSession(user)
            }
        }
    );
}
