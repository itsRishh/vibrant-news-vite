import { createFileRoute, Link, Outlet, notFound, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const ADMIN_AUTH_KEY = "vibrant-news-admin-auth";
const ADMIN_PASSWORD = (import.meta.env["VITE_ADMIN_PASSWORD"] ?? "vibrant-admin-2026").trim();

const SECTION_CARDS = [
    {
        title: "Breaking News",
        path: "/admin/breaking-news",
        description: "Manage live-breaking hero and sub-news cards.",
        status: "Open",
    },
    {
        title: "Latest News",
        path: "/admin/latest-news",
        description: "Manage homepage latest updates and slot positions.",
        status: "Open",
    },
    {
        title: "Local News",
        path: "/admin/local-news",
        description: "Prepare localized city and district stories.",
        status: "Open",
    },
    {
        title: "State News",
        path: "/admin/state-news",
        description: "Curate state-based coverage and tabbed updates.",
        status: "Soon",
    },
    {
        title: "Regional News",
        path: "/admin/regional-news",
        description: "Handle district and regional headline blocks.",
        status: "Open",
    },
    {
        title: "India News",
        path: "/admin/india-news",
        description: "Publish national coverage and featured center-and-sidebar stories.",
        status: "Open",
    },
    {
        title: "International News",
        path: "/admin/international-news",
        description: "Manage international affairs and world desk items.",
        status: "Soon",
    },
    {
        title: "Videos",
        path: "/admin/video-news",
        description: "Manage video stories and short-form clips.",
        status: "Open",
    },
] as const;

function isAdminAuthenticated() {
    if (typeof window === "undefined") {
        return false;
    }

    return window.localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

function setAdminAuthenticated(value: boolean) {
    if (typeof window === "undefined") {
        return;
    }

    if (value) {
        window.localStorage.setItem(ADMIN_AUTH_KEY, "true");
    } else {
        window.localStorage.removeItem(ADMIN_AUTH_KEY);
    }
}

export const Route = createFileRoute("/admin")({
    component: AdminDashboard,
});

function AdminDashboard() {
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const isDashboardRoute = pathname === "/admin" || pathname === "/admin/";
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setIsAuthenticated(isAdminAuthenticated());
    }, []);

    if (!isAuthenticated) {
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (password === ADMIN_PASSWORD) {
                setAdminAuthenticated(true);
                setIsAuthenticated(true);
                window.location.assign("/admin");
                return;
            }

            setError("Incorrect admin password.");
        };

        return (
            <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-background px-4 py-10 text-foreground">
                <div className="w-full rounded-lg border border-border bg-background p-6 shadow-sm">
                    <p className="text-xs font-bold tracking-widest text-primary uppercase">Restricted area</p>
                    <h1 className="mt-2 text-2xl font-black tracking-tight">Admin access</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter the admin password to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        <label className="block text-sm font-bold">
                            Password
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    if (error) setError("");
                                }}
                                className="mt-2 w-full border border-border px-3 py-2 font-normal"
                                placeholder="Enter admin password"
                            />
                        </label>

                        {error && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}

                        <button type="submit" className="w-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
                            Log in
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <>
            {isDashboardRoute && (
                <main className="mx-auto min-h-screen max-w-[1250px] bg-background px-4 py-10 text-foreground sm:px-6">
                    <div className="mb-8 border-b border-border pb-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
                                <h1 className="mt-2 text-3xl font-black tracking-tight">News Section Manager</h1>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setAdminAuthenticated(false);
                                    window.location.assign("/admin");
                                }}
                                className="border border-border px-3 py-2 text-xs font-bold uppercase"
                            >
                                Log out
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Select a section to open its admin panel and manage content.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {SECTION_CARDS.map((section) => {
                            const isAvailable = section.status === "Open";

                            return (
                                <div
                                    key={section.title}
                                    className={`flex min-h-[190px] flex-col justify-between border p-5 transition-colors ${
                                        isAvailable ? "border-border bg-background hover:border-primary" : "border-dashed border-muted-foreground/40 bg-muted/20"
                                    }`}
                                >
                                    <div>
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <h2 className="text-lg font-black tracking-tight">{section.title}</h2>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                                                    isAvailable ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {section.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{section.description}</p>
                                    </div>

                                    {isAvailable ? (
                                        <Link
                                            to={section.path as never}
                                            className="mt-5 inline-flex w-full items-center justify-center bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
                                        >
                                            Open admin panel
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="mt-5 w-full cursor-not-allowed border border-border bg-background px-4 py-3 text-sm font-bold text-muted-foreground"
                                        >
                                            Coming soon
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>
            )}
            <Outlet />
        </>
    );
}
