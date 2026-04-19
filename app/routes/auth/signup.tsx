import bcrypt from "bcrypt";
import {
    users 
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

    try {
        const {
            email, password, role 
        } = await request.json();

        // 1. Validation
        if (!email || !password || !role) {
            return Response.json({
                error: "Missing fields" 
            }, {
                status: 400 
            });
        }

        // 2. Check if user exists
        if (users.find(u => u.email === email)) {
            return Response.json({
                error: "User already exists" 
            }, {
                status: 400 
            });
        }

        // 3. Auto-increment ID Logic
        // Filter users by role to get the correct count for that specific prefix
        const roleUsers = users.filter(u => u.role === role);
        const nextNumber = roleUsers.length + 1;
        const prefix = role === "ORGANIZER" ? "mgr" : "cust";
        const newId = `${prefix}-${nextNumber}`;

        // 4. Hash Password
        const hash = await bcrypt.hash(password, 10);

        // 5. Save to Mock DB
        const newUser = {
            id: newId,
            email,
            password: hash,
            role,
            isDefault: false
        };

        users.push(newUser);

        return Response.json({
            ok: true,
            id: newId,
            message: `User created successfully as ${newId}`
        }, {
            status: 201 
        });

    } catch (e) {
        return Response.json({
            error: "Server Error" 
        }, {
            status: 500 
        });
    }
}
