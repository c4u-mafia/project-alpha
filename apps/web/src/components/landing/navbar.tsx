import { ModeToggle } from "../mode-toggle"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md transition-colors duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <div className="text-2xl font-extrabold tracking-tight text-primary font-heading">
          RentDirect
        </div>
        <div className="hidden items-center space-x-8 font-semibold md:flex font-heading">
          <a href="#properties" className="border-b-2 border-primary pb-1 text-primary">
            Properties
          </a>
          <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-primary">
            How it Works
          </a>
          <a href="#pricing" className="text-muted-foreground transition-colors hover:text-primary">
            Pricing
          </a>
          <a href="#list" className="text-muted-foreground transition-colors hover:text-primary">
            List Property
          </a>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <button className="rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95 font-heading text-sm">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}
