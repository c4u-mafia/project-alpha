import { Star } from "lucide-react"

export function Testimonials() {
  const reviews = [
    {
      quote: '"Found my apartment in Gbagada in just 2 days. No agent drama and no extra commission."',
      author: "Verified User",
      rating: 5,
    },
    {
      quote: '"As a landlord, managing 5 properties became easy. Payments are always on time."',
      author: "Verified Landlord",
      rating: 5,
    },
    {
      quote: '"The verified photos are a game changer. I knew exactly what to expect before visiting."',
      author: "Lekki Tenant",
      rating: 5,
    },
  ]

  return (
    <section className="bg-background py-24 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 className="mb-20 text-center text-4xl font-extrabold lg:text-3xl font-heading text-foreground">
          What our community says
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((item, i) => (
            <article key={i} className="rounded-[2rem] bg-card p-10 lg:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-slate-50 relative group transition-all hover:shadow-xl hover:-translate-y-2">
              <div className="absolute top-8 left-8 text-[120px] font-black text-secondary -z-10 h-10 select-none opacity-50">“</div>
              <div className="mb-6 flex text-amber-500 gap-1">
                {Array.from({ length: item.rating }).map((_, idx) => (
                  <Star key={idx} className="size-4 fill-current drop-shadow-sm transition-transform group-hover:scale-125" />
                ))}
              </div>
              <p className="mb-8 text-lg lg:text-xl font-medium text-foreground relative z-10 italic leading-relaxed">{item.quote}</p>
              <div className="flex items-center gap-4 not-italic">
                <div className="size-12 rounded-full bg-linear-to-br from-secondary to-slate-200 border-2 border-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center font-bold text-slate-400">RD</div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-sm lg:text-base">{item.author}</span>
                  <span className="text-[10px] lg:text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                   Verified Account
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
