import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import appCss from "../styles/globals.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "RentDirect - Curating the Urban Nigerian Experience",
      },
      {
        name: "description",
        content:
          "Find verified rentals in Lagos and Abuja with direct landlord access and no agency fees.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootDocument,
})

import { ThemeProvider } from "../components/theme-provider"

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rentdirect-ui-theme">
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/20 selection:text-primary">
          {children}
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  )
}
