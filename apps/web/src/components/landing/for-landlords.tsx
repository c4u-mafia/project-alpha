import { Check, CircleDollarSign } from "lucide-react"

export function ForLandlords() {
  const landlordFeatures = [
    {
      title: "List in Minutes",
      description: "Upload photos and details quickly with an intuitive listing flow."
    },
    {
      title: "Direct Payments",
      description: "Receive rent directly through secure payment channels."
    },
    {
      title: "Comprehensive Dashboard",
      description: "Track earnings and manage tenant requests across all units."
    }
  ]

  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-6 shadow-lg border border-white/20 transform hover:scale-105 transition-transform">
              <div className="mb-2 text-4xl font-extrabold">98%</div>
              <p className="text-[10px] sm:text-sm tracking-[0.12em] uppercase opacity-80 font-bold">Occupancy Rate</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 shadow-lg border border-white/20 transform hover:scale-105 transition-transform">
              <div className="mb-2 text-4xl font-extrabold">0</div>
              <p className="text-[10px] sm:text-sm tracking-[0.12em] uppercase opacity-80 font-bold">Agency Fees</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-white/5 p-8 backdrop-blur-sm border border-white/10 shadow-xl">
              <h4 className="mb-4 flex items-center gap-2 font-bold text-primary-foreground">
                <CircleDollarSign className="size-5" /> Analytics Preview
              </h4>
              <div className="flex h-32 items-end gap-3 px-2">
                {[40, 60, 55, 80, 100, 70, 90].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 rounded-t-md bg-white/40 transition-all duration-1000 hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                    style={{ height: `${height}%` }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 text-center lg:text-left">
          <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-2 text-[10px] lg:text-sm font-bold tracking-[0.15em] uppercase border border-white/20">
            For Landlords
          </span>
          <h2 className="mb-8 text-4xl font-extrabold md:text-5xl lg:text-6xl font-heading">
            Your Property, <br className="hidden lg:block" />Your Control
          </h2>
          <ul className="space-y-8 text-left">
            {landlordFeatures.map((item) => (
              <li key={item.title} className="flex gap-4 group">
                <div className="flex size-10 lg:size-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Check className="size-5 lg:size-6 font-bold" />
                </div>
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold mb-1 transition-colors group-hover:text-primary-foreground/80">{item.title}</h4>
                  <p className="opacity-80 text-sm lg:text-base leading-relaxed text-primary-foreground/90 font-medium">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-12 w-full sm:w-auto rounded-full bg-white px-10 py-5 text-lg font-extrabold text-primary shadow-xl transition-all hover:scale-105 active:scale-95 font-heading">
            Start Listing Today
          </button>
        </div>
      </div>
    </section>
  )
}
