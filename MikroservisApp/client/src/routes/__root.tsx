import { createRootRoute } from "@tanstack/react-router";
import RootLayout from "../RootLayout";

export const Route = createRootRoute({
    component: () => < RootLayout/>
})