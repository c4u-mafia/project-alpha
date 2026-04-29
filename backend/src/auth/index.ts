import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5555",
	trustedOrigins: ["http://localhost:5173"],
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
    openAPI(),
  ],
});