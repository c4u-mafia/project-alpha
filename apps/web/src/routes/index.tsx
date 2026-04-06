import { createFileRoute } from "@tanstack/react-router"
import {
  Apple,
  ArrowRight,
  AtSign,
  Check,
  CircleDollarSign,
  EyeOff,
  Globe,
  MapPinned,
  MessageCircleMore,
  Moon,
  Send,
  Share2,
  ShieldCheck,
  Star,
  Timer,
} from "lucide-react"

export const Route = createFileRoute("/")({ component: LandingPage })

const appStoreBadge =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAT7xr-Aemk9aAm9XebHNRdYlsLlIGSGbgMEbGYh9poi8mSRRLepIGrOvbghYhMeHwdfP3PIjhDi5uLUT8LEhOrZwXPH52CQYeEezR0QVqWcbbtk0G5h1otR9c3TSv-b-TNaMbzoZkiqv6djhoogH2bECBHPswVScwqpwt5xrr9jyVBWDDO7CwK0HpFVKuJKAkCK2bH-AS8kJriw-VXQXSGi27tw3-MqHYghDx3pbuPekOJBgMzvgTupXy6jd964rqKR8HHZAluFPzg"
const playStoreBadge =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9PU4oTtMQM0iglr6y2EE6yS_HbHl55AJmQZNZvYAGXdaO1y5djNNJgTkoVNxPI9vsD11lZ8JepKGAU1BRs-LEUsRNFnKys94CsSBjNbvAivJC9hDwx7NMerWdzko3cAqlH8rMAvxDkkTk8z3HPLeehlYAJ-TJ2iUb0xzslJNOhcmqZA7d9BgwHzwbutCck7RJP_5sSRbu78ApPLp9hXdkwp3NPvlVbxp_ja6Ygy5m6BWpx4p7hOgytJ35f07ZKK505voWhdhjUT5D"

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] [font-family:Manrope,sans-serif] selection:bg-[#9ff0fb] selection:text-[#001f23]">
      <nav className="sticky top-0 z-50 w-full bg-white/70 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <div className="text-2xl font-extrabold tracking-tight text-teal-800 [font-family:'Plus_Jakarta_Sans',sans-serif]">
            RentDirect
          </div>
          <div className="hidden items-center space-x-8 font-semibold md:flex [font-family:'Plus_Jakarta_Sans',sans-serif]">
            <a href="#properties" className="border-b-2 border-teal-700 pb-1 text-teal-700">
              Properties
            </a>
            <a href="#how-it-works" className="text-slate-600 transition-colors hover:text-teal-600">
              How it Works
            </a>
            <a href="#pricing" className="text-slate-600 transition-colors hover:text-teal-600">
              Pricing
            </a>
            <a href="#list" className="text-slate-600 transition-colors hover:text-teal-600">
              List Property
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 text-slate-600 transition-opacity hover:opacity-80" aria-label="Toggle dark mode">
              <Moon className="size-5" />
            </button>
            <button className="rounded-full bg-[#00535b] px-5 py-2 font-semibold text-white transition hover:opacity-90 active:scale-95 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-[#f8f9fa] pb-24 pt-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div className="z-10">
            <h1 className="mb-6 text-5xl leading-[1.06] font-extrabold tracking-tight text-[#191c1d] md:text-7xl [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Find Your Next Home - <span className="text-[#00535b]">No Agent.</span>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-[#3e494a] md:text-xl">
              No Hassle. No Hidden Fees. Rent directly from verified landlords in Nigeria&apos;s most vibrant urban centers.
            </p>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-3xl bg-gradient-to-br from-[#00535b] to-[#006d77] px-10 py-4 text-lg font-bold text-white shadow-[0_8px_24px_rgba(0,83,91,0.12)] transition hover:opacity-95 active:scale-95 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                Get Started
              </button>
              <div className="flex items-center gap-3">
                <img src={appStoreBadge} alt="App Store" className="h-10 cursor-pointer" />
                <img src={playStoreBadge} alt="Google Play" className="h-10 cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {["AB6AXuAOYWroyUxfYcSmDWlEIFpVjCKzI6l_2b0Tns5i8DhAEPMhINHW_wVxNympgyipy3Z2tur43P3sQ7bfmfH7WMQYPfHqajm3AlV_8exA6ryNY-xr5TMWFo6J7ig9ewMIu0hc4YYU8Gphrt0hwIoh9B3Rpy_q0tIc0paZPlJ3SkGKwbCUvqGFhCWUAPdkeriFJPXzXm_1wL0R19rTvNWJOb_umoSLPqVqf5s4-RuH6b2Q05SCPMGlhyafrX82R3dOAcId5UdOZF0L-nBT", "AB6AXuD6tJ8qpLe7q952D2GpKtke-o92LZgfz8ZDZ-g4l7EXV0LFjFPeLVrwObx7rcx7NLBTgxlo26ixNVuRwu_iSDUS3HpRXz_GF-J7f4e5Md7xZwM0ydTtraxytGS9U5cTdC-UKmiuXn0u8sFgt89jg3Jaxcup2T-2ZUnDf9zzQpGHj-l5BUvCmB-WLoC23FOdXFqruPTEmOlhYx3rT18Azhf2mz3HnzYccp3d-gDe_1n7Cjxn0JR5Eicva2_5s_ZOx2X44TN5IRPM3s5c", "AB6AXuBE3SsbERK0WCJtCHMjQVo_KBVDfg9C-7vXYNh-96hOh8q3VX24DVrkQcbUSH2iQuZiNzy29zHUzstFciB09D-UFIBM1JkVzMMgsJNTxfocgNvLSxGxXbTB0R8fUjipdxojQc1YEMSkUr83pp5UQsSUU8Y6L920736zMzkogLVb3neyQj73DVSEIraizIy_jRGW3FV-il5LOAF3e5eIVBweOgpEs2GdShS5J0xDVAIWne6hACuPqAH-OV3-07I7VxTsViJJHDMP5lgr"].map(
                  (item) => (
                    <div key={item} className="size-12 overflow-hidden rounded-full border-4 border-[#f8f9fa] bg-slate-200">
                      <img src={`https://lh3.googleusercontent.com/aida-public/${item}`} alt="Happy customer" className="size-full object-cover" />
                    </div>
                  )
                )}
              </div>
              <p className="text-sm font-semibold text-[#3e494a]">Join 5,000+ happy tenants in Lagos and Abuja</p>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -top-20 -right-20 size-[500px] rounded-full bg-[#c6e7ff]/40 blur-[120px]" />
            <div className="relative z-10 aspect-[9/19] w-full max-w-[340px] rotate-3 overflow-hidden rounded-[3rem] border-[8px] border-slate-900 shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3kHm8s_VKl_aO9Uz1flo51oOcCyzOhKIETgcWNzv4G3q4PGYC3nRUly9KflS61toZeU6wYV1koe86CM4nBmXHkG5NMj7EBkxgxIvHlxiDSJehAfzBrzIq9rVXTTeEXmhcjbRdH8gSk-vBnmPI-A8tsOnFyEkgkvt_BygTugTWq3qQfxgHJUNLnW-QrDh2EUv12Ywe4iSIHA0H1NGeIbpjI2Xf5e4vq_nqnrCjnVvxv0Chs6OaPgTbJ656BvuEm7edQchy3gbLBtW3"
                alt="Luxury apartment"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-md">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-white">Lekki Phase 1</span>
                    <span className="rounded-full bg-[#00535b] px-2 py-1 text-xs text-white">New</span>
                  </div>
                  <div className="text-xl font-bold text-white">N4,500,000/yr</div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 -left-10 z-20 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(0,83,91,0.12)]">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#82d3de]">
                <ShieldCheck className="size-5 text-[#00535b]" />
              </div>
              <div>
                <p className="text-xs text-[#3e494a]">Landlord Verified</p>
                <p className="text-sm font-bold">Direct Contact Ready</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-[#f3f4f5] py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold tracking-[0.16em] text-[#00535b] uppercase">The Old Way</span>
            <h2 className="mt-4 text-4xl font-extrabold md:text-5xl [font-family:'Plus_Jakarta_Sans',sans-serif]">The Agent Problem</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <CircleDollarSign className="size-6 text-[#ba1a1a]" />,
                title: "Extortionate Fees",
                body: "Typical agents demand 10-20% for legal and agency fees. We think that money belongs in your pocket.",
              },
              {
                icon: <EyeOff className="size-6 text-[#ba1a1a]" />,
                title: 'The "Wild Goose" Chase',
                body: "Photos that do not match reality and inspections that waste your valuable weekend hours.",
              },
              {
                icon: <Timer className="size-6 text-[#ba1a1a]" />,
                title: "Gatekeeper Delays",
                body: "Waiting days for a callback only to find out the apartment was rented out weeks ago.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl bg-white p-8 transition hover:-translate-y-1">
                <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#ffdad6]">{item.icon}</div>
                <h3 className="mb-4 text-2xl font-bold [font-family:'Plus_Jakarta_Sans',sans-serif]">{item.title}</h3>
                <p className="leading-relaxed text-[#3e494a]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-24" id="properties">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold md:text-5xl [font-family:'Plus_Jakarta_Sans',sans-serif]">Everything a Tenant Needs</h2>
              <p className="mt-4 text-lg text-[#3e494a]">
                We&apos;ve built the tools to help you find your dream home quickly, without the middleman.
              </p>
            </div>
            <button className="group flex items-center gap-2 font-bold text-[#00535b]">
              Explore Listings <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-12">
            <article className="group relative overflow-hidden rounded-3xl md:col-span-8">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5fDa1osDY8MVrPy4jSRLL1F-kJxFDLKQJFfAAz8s7cE66_fS36leno79IKc5j308Pw_vmW7Qcho_5M9XSn_69OxsSMyl8P5yC6idPNJuzA5GH8cavtGGSI-9QXxhvpkinwXQZDe6T3kTKCzyXPV8QYplK2ezZ0s4aHQWX1LtAz-MT72Ib8YBO5dhtUKtXRC_AeYplXJL3GM9QpD1b0O-NL_AKGrf4bIq-h2XWOT5YohYrHJy8NlPp1H4by6XjXUxAizd7I8EHjU0"
                alt="Verified interior"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-10">
                <div className="inline-block max-w-sm rounded-2xl border border-white/20 bg-[#00535b]/30 p-6 backdrop-blur-md">
                  <h3 className="mb-2 text-2xl font-bold text-white [font-family:'Plus_Jakarta_Sans',sans-serif]">Verified Real Photos</h3>
                  <p className="text-white/80">Every listing is photographed by our team or verified landlords.</p>
                </div>
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-3xl bg-[#c6e7ff] p-8 md:col-span-4">
              <div>
                <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-white">
                  <MapPinned className="size-6 text-[#00658d]" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-[#001e2d] [font-family:'Plus_Jakarta_Sans',sans-serif]">Exact Locations</h3>
                <p className="text-[#004c6b]">No more vague directions. We provide precise map pins before you visit.</p>
              </div>
              <div className="mt-8 h-32 overflow-hidden rounded-xl border border-[#83cfff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgwziujfe6r-3IokODNsVhd6ZCp4SK1iJF-cQL72AkzgCj5TjbO6tzNgXYLB52mjb81SOAbC2RwzSgGMoc8WtQNsis5us5RHDHvfXGGh_iE2J53xxM_7esdbswIlleE2jMvVp6w6VcHk0fzd09snzqWyYEaGZK3Oi29bIiXrkkqCWxGGbNjAf0lcoXrdhbL-QQGFgpUehvy6S6qPhMDKqDxSQPisTiWxC9tFWXF6YVHBeWg3MmnZ4f4UFY71EBSvC7wdhQipB6B0Xy"
                  alt="Map preview"
                  className="size-full object-cover grayscale"
                />
              </div>
            </article>

            <article className="rounded-3xl bg-[#e7e8e9] p-8 md:col-span-4">
              <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-[#9ff0fb]">
                <MessageCircleMore className="size-6 text-[#00535b]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold [font-family:'Plus_Jakarta_Sans',sans-serif]">Direct Contact</h3>
              <p className="text-[#3e494a]">
                Chat directly with landlords through secure messaging. Ask questions and schedule viewings instantly.
              </p>
            </article>

            <article className="flex items-center gap-8 rounded-3xl bg-white p-8 md:col-span-8">
              <div className="hidden h-40 w-40 shrink-0 overflow-hidden rounded-2xl sm:block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTGGHFhRkRPUivkBmtr3ZkOWPayyjQ_dL_R914c3eJVvBL9pB37Ghqsgc2CB2m6s9Y4hTYdraFfZ_SDEZMNxAjxl-jNRo2ftdf1tK7Nl-6nVBzTZj9qRoLCN6Hg7IdnXlmYJi5r_e0cO8FajhZUgVUx_eiXeXnJ_UaDSNVthkg4hnH5S6NamV3F2_z-wOjIjmkoQxz3viUSekXNjo1blQ50WgmeBtn3wBAYmh1fjeX7hPj-JNq-bzG1xu8qlaguMqY94ZrHdvOE2Ac"
                  alt="Document signing"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold [font-family:'Plus_Jakarta_Sans',sans-serif]">Digital Lease Signing</h3>
                <p className="text-[#3e494a]">Close the deal with legally binding digital contracts signed in minutes.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#00535b] py-24 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#006d77] p-6">
                <div className="mb-2 text-4xl font-extrabold">98%</div>
                <p className="text-sm tracking-[0.12em] uppercase opacity-80">Occupancy Rate</p>
              </div>
              <div className="rounded-2xl bg-[#006d77] p-6">
                <div className="mb-2 text-4xl font-extrabold">0</div>
                <p className="text-sm tracking-[0.12em] uppercase opacity-80">Agency Fees</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <h4 className="mb-4 flex items-center gap-2 font-bold">
                  <CircleDollarSign className="size-5" /> Monthly Revenue
                </h4>
                <div className="flex h-24 items-end gap-2">
                  {[40, 60, 55, 80, 100].map((height) => (
                    <div key={height} className="flex-1 rounded-t-sm bg-[#9becf7]" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="mb-6 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-bold tracking-[0.1em] uppercase">
              For Landlords
            </span>
            <h2 className="mb-8 text-4xl font-extrabold md:text-5xl [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Your Property, Your Control
            </h2>
            <ul className="space-y-6">
              {[
                "List in Minutes",
                "Direct Payments",
                "Comprehensive Dashboard",
              ].map((item) => (
                <li key={item} className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#9ff0fb] text-[#00535b]">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{item}</h4>
                    <p className="opacity-80">
                      {item === "List in Minutes" && "Upload photos and details quickly with an intuitive listing flow."}
                      {item === "Direct Payments" && "Receive rent directly through secure payment channels."}
                      {item === "Comprehensive Dashboard" && "Track earnings and manage tenant requests across all units."}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-12 rounded-2xl bg-white px-10 py-4 text-lg font-bold text-[#00535b] transition hover:bg-slate-100 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Start Listing Today
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f4f5] py-24" id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold md:text-5xl [font-family:'Plus_Jakarta_Sans',sans-serif]">Simple 3-Step Flow</h2>
          </div>
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute top-1/2 right-[20%] left-[20%] hidden h-px -translate-y-1/2 bg-[#bec8ca]/40 md:block" />
            {[
              { step: "1", title: "Sign Up", body: "Create a tenant or landlord profile in minutes." },
              { step: "2", title: "Search or List", body: "Browse verified homes or publish your property." },
              { step: "3", title: "Connect & Move", body: "Chat, sign digitally, pay securely, and move in." },
            ].map((item) => (
              <article key={item.step} className="relative z-10 text-center">
                <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full border-8 border-[#f3f4f5] bg-[#00535b] text-3xl font-extrabold text-white">
                  {item.step}
                </div>
                <h3 className="mb-4 text-2xl font-bold [font-family:'Plus_Jakarta_Sans',sans-serif]">{item.title}</h3>
                <p className="text-[#3e494a]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <h2 className="mb-16 text-center text-4xl font-extrabold [font-family:'Plus_Jakarta_Sans',sans-serif]">
            What our community says
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              '"Found my apartment in Gbagada in just 2 days. No agent drama and no extra commission."',
              '"As a landlord, managing 5 properties became easy. Payments are always on time."',
              '"The verified photos are a game changer. I knew exactly what to expect before visiting."',
            ].map((quote) => (
              <article key={quote} className="rounded-2xl bg-white p-8 italic shadow-[0_8px_24px_rgba(0,83,91,0.06)]">
                <div className="mb-4 flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-lg">{quote}</p>
                <div className="flex items-center gap-3 not-italic">
                  <div className="size-10 rounded-full bg-slate-200" />
                  <span className="font-bold text-[#3e494a]">Verified User</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e7e8e9] py-24">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-white p-10 shadow-[0_8px_24px_rgba(0,83,91,0.08)] md:p-16">
            <div className="absolute top-0 left-0 h-full w-2 bg-[#00535b]" />
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-extrabold md:text-4xl [font-family:'Plus_Jakarta_Sans',sans-serif]">Join the community</h2>
              <p className="text-[#3e494a]">Your perfect home is just a few clicks away.</p>
            </div>

            <form className="space-y-6">
              <div className="mb-8 flex rounded-full bg-[#f3f4f5] p-1">
                <button type="button" className="flex-1 rounded-full bg-[#00535b] px-6 py-3 font-bold text-white">
                  I am a Tenant
                </button>
                <button type="button" className="flex-1 px-6 py-3 font-bold text-[#3e494a]">
                  I am a Landlord
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-bold">Full Name</span>
                  <input
                    type="text"
                    placeholder="e.g. Ebuka Okafor"
                    className="w-full rounded-2xl bg-[#e1e3e4] px-4 py-3 outline-none transition focus:border-b-2 focus:border-[#00535b]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold">Email Address</span>
                  <input
                    type="email"
                    placeholder="ebuka@email.com"
                    className="w-full rounded-2xl bg-[#e1e3e4] px-4 py-3 outline-none transition focus:border-b-2 focus:border-[#00535b]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold">Phone Number</span>
                  <input
                    type="tel"
                    placeholder="+234 ..."
                    className="w-full rounded-2xl bg-[#e1e3e4] px-4 py-3 outline-none transition focus:border-b-2 focus:border-[#00535b]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold">Password</span>
                  <input
                    type="password"
                    placeholder="********"
                    className="w-full rounded-2xl bg-[#e1e3e4] px-4 py-3 outline-none transition focus:border-b-2 focus:border-[#00535b]"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-br from-[#00535b] to-[#006d77] py-4 text-lg font-bold text-white"
              >
                Create Account
              </button>

              <div className="relative flex items-center py-4">
                <div className="grow border-t border-[#bec8ca]/40" />
                <span className="mx-4 text-sm text-[#3e494a]">or continue with</span>
                <div className="grow border-t border-[#bec8ca]/40" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-[#bec8ca] py-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYwYu-8rjXGFpi-DfvlKK-PWJI-wEns29AH3TewfuskfdUpo2egafOLJptyn3v1JQaDyfR8TMOOERVSuTd1qTOC6oQ8APzy9xTp1TnvVZkiMuihyp4Aq3RFtsyv0nJU4WMZqGez5mXacJxm94G6XDFI0D_dq79CdjZj60PNPHU5n6ya_zi5qK2S0_0JFWEf0fplBMr5TxqHlgi8iArgS8MRZbrZzSr5BqWp5r74hrDKKdGxgaq6zyX-79oA1hyhUTyhx8MMW73P99Y"
                    alt="Google"
                    className="size-5"
                  />
                  <span className="text-sm font-bold">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-[#bec8ca] py-3">
                  <Apple className="size-5" />
                  <span className="text-sm font-bold">Apple</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4 md:px-8">
          <div>
            <div className="mb-4 text-xl font-bold text-teal-800 [font-family:'Plus_Jakarta_Sans',sans-serif]">RentDirect</div>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Curating the urban Nigerian experience. Direct rentals, zero hassle, total transparency.
            </p>
            <div className="flex gap-4 text-slate-400">
              <Globe className="size-4 cursor-pointer transition-colors hover:text-teal-600" />
              <AtSign className="size-4 cursor-pointer transition-colors hover:text-teal-600" />
              <Share2 className="size-4 cursor-pointer transition-colors hover:text-teal-600" />
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="mb-2 text-xs font-bold tracking-[0.12em] text-teal-700 uppercase">Company</h4>
            <a href="#" className="text-slate-500 underline underline-offset-4 transition-colors hover:text-teal-600">
              About Us
            </a>
            <a href="#" className="text-slate-500 underline underline-offset-4 transition-colors hover:text-teal-600">
              Careers
            </a>
            <a href="#" className="text-slate-500 underline underline-offset-4 transition-colors hover:text-teal-600">
              Blog
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="mb-2 text-xs font-bold tracking-[0.12em] text-teal-700 uppercase">Support</h4>
            <a href="#" className="text-slate-500 underline underline-offset-4 transition-colors hover:text-teal-600">
              Contact Support
            </a>
            <a href="#" className="text-slate-500 underline underline-offset-4 transition-colors hover:text-teal-600">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 underline underline-offset-4 transition-colors hover:text-teal-600">
              Terms of Service
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="mb-2 text-xs font-bold tracking-[0.12em] text-teal-700 uppercase">Newsletter</h4>
            <p className="mb-2 text-xs text-slate-500">Get the latest property insights.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="w-full rounded-l-lg bg-white px-4 py-2 text-xs outline-none" />
              <button className="rounded-r-lg bg-[#00535b] px-3 py-2 text-white" type="button">
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-6 md:px-8">
          <p className="text-center text-xs text-slate-500 md:text-left">Copyright 2026 RentDirect. Curating the urban Nigerian experience.</p>
        </div>
      </footer>
    </div>
  )
}
