import { ArrowRight, MapPinned, MessageCircleMore } from "lucide-react"

export function Features() {
  return (
    <section className="bg-[#f8f9fa] py-24" id="properties">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl text-left">
            <h2 className="text-4xl font-extrabold md:text-5xl font-heading text-foreground">Everything a Tenant Needs</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We&apos;ve built the tools to help you find your dream home quickly, without the middleman.
            </p>
          </div>
          <button className="group flex items-center gap-2 font-bold text-primary transition-colors hover:text-primary/80">
            Explore Listings <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 min-h-[600px]">
          <article className="group relative overflow-hidden rounded-3xl md:col-span-8 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"
              alt="Verified interior"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-transparent to-transparent p-6 lg:p-10">
              <div className="inline-block max-w-sm rounded-2xl border border-white/20 bg-primary/30 p-6 backdrop-blur-md">
                <h3 className="mb-2 text-2xl font-bold text-white font-heading">Verified Real Photos</h3>
                <p className="text-white/80">Every listing is photographed by our team or verified landlords.</p>
              </div>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-3xl bg-secondary p-8 md:col-span-4 shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                <MapPinned className="size-6 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground font-heading">Exact Locations</h3>
              <p className="text-muted-foreground">No more vague directions. We provide precise map pins before you visit.</p>
            </div>
            <div className="mt-8 h-40 overflow-hidden rounded-2xl border border-primary/20 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600"
                alt="Map preview"
                className="size-full object-cover grayscale opacity-80"
              />
            </div>
          </article>

          <article className="rounded-3xl bg-slate-100 p-8 md:col-span-4 shadow-sm group hover:bg-slate-200 transition-all border border-slate-200/50">
            <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110 shadow-sm">
              <MessageCircleMore className="size-6 text-primary" />
            </div>
            <h3 className="mb-4 text-2xl font-bold font-heading text-foreground">Direct Contact</h3>
            <p className="text-muted-foreground">
              Chat directly with landlords through secure messaging. Ask questions and schedule viewings instantly.
            </p>
          </article>

          <article className="flex flex-col sm:flex-row items-center gap-8 rounded-3xl bg-white p-8 md:col-span-8 shadow-sm hover:shadow-md transition-all">
            <div className="h-40 w-full sm:w-40 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400"
                alt="Document signing"
                className="size-full object-cover"
              />
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold font-heading text-foreground">Digital Lease Signing</h3>
              <p className="text-muted-foreground">Close the deal with legally binding digital contracts signed in minutes.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
