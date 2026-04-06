import { Send, AtSign, Globe, Share2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-4 md:px-8">
        <div className="space-y-6">
          <div className="text-2xl font-extrabold text-primary font-heading">RentDirect</div>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-xs font-medium">
            Curating the urban Nigerian experience. Direct rentals, zero hassle, total transparency.
          </p>
          <div className="flex gap-5 text-slate-400">
            <Globe className="size-5 cursor-pointer transition-all hover:text-primary hover:scale-110" />
            <AtSign className="size-5 cursor-pointer transition-all hover:text-primary hover:scale-110" />
            <Share2 className="size-5 cursor-pointer transition-all hover:text-primary hover:scale-110" />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm font-medium">
          <h4 className="mb-2 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Company</h4>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">About Us</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Careers</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Blog</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Newsroom</a>
        </div>

        <div className="flex flex-col gap-4 text-sm font-medium">
          <h4 className="mb-2 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Support</h4>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Contact Support</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Privacy Policy</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Terms of Service</a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-primary underline-offset-4 hover:underline">Help Center</a>
        </div>

        <div className="flex flex-col gap-4 text-sm font-medium">
          <h4 className="mb-2 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Quick Newsletter</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">Get the latest property insights and market trends directly to your inbox.</p>
          <div className="flex bg-card rounded-2xl p-1 shadow-sm border border-border group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input type="email" placeholder="Email" className="w-full bg-transparent px-4 py-2 text-xs outline-none font-medium" />
            <button className="rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow-md transition-all active:scale-90" type="button">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest md:text-left">
            © 2026 RentDirect. Curating the urban Nigerian experience.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-primary">
            <a href="#" className="transition-opacity hover:opacity-70">Nigeria</a>
            <div className="size-1 rounded-full bg-slate-300" />
            <a href="#" className="transition-opacity hover:opacity-70">UK</a>
            <div className="size-1 rounded-full bg-slate-300" />
            <a href="#" className="transition-opacity hover:opacity-70">USA</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
