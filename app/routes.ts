import {
    type RouteConfig, index , route, prefix
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("moo", "routes/moo.ts"),
    ...prefix("auth", [
        route("signup", "./routes/auth/signup.tsx"),
        route("login", "./routes/auth/login.tsx"),
        route("logout", "./routes/auth/logout.tsx"),
        route("me", "./routes/auth/me.tsx")
    ]),
    ...prefix("api", [

        route("events", "./routes/api/events-list.ts"), // Browsing

        route("events/:id", "./routes/api/event-detail.ts"), // View/Update

        route("events/:id/book", "./routes/api/book-ticket.ts"), // Booking
        route("events/create", "./routes/api/event-creation.ts"),
        route("me/bookings", "./routes/api/bookings.ts")
    ])
] satisfies RouteConfig;
