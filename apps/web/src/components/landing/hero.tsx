import { ShieldCheck } from "lucide-react"

export function Hero() {
  const appStoreBadge = "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
  const playStoreBadge = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"

  return (
    <header className="relative flex flex-col items-center justify-center overflow-hidden bg-background h-auto lg:h-[calc(100vh-76px)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div className="z-10 text-center lg:text-left">
          <h1 className="mb-4 text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl font-heading">
            Find Your Next Home - <span className="text-primary">No Agent.</span>
          </h1>
          <p className="mb-8 mx-auto lg:mx-0 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            No Hassle. No Hidden Fees. Rent directly from verified landlords in Nigeria&apos;s most vibrant urban centers.
          </p>
          <div className="mb-8 flex flex-col items-center lg:items-start gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <button className="w-full sm:w-auto rounded-full bg-linear-to-br from-primary to-primary/80 px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 font-heading">
              Get Started
            </button>
            <div className="flex items-center gap-3">
              <a href="#" className="transition-transform hover:scale-105 active:scale-95">
                <img src={appStoreBadge} alt="Download on the App Store" className="h-[36px] md:h-[40px] w-auto drop-shadow-sm" />
              </a>
              <a href="#" className="transition-transform hover:scale-105 active:scale-95">
                <img src={playStoreBadge} alt="Get it on Google Play" className="h-[46px] md:h-[52px] w-auto -my-2" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <div className="flex -space-x-4">
              {["AB6AXuAOYWroyUxfYcSmDWlEIFpVjCKzI6l_2b0Tns5i8DhAEPMhINHW_wVxNympgyipy3Z2tur43P3sQ7bfmfH7WMQYPfHqajm3AlV_8exA6ryNY-xr5TMWFo6J7ig9ewMIu0hc4YYU8Gphrt0hwIoh9B3Rpy_q0tIc0paZPlJ3SkGKwbCUvqGFhCWUAPdkeriFJPXzXm_1wL0R19rTvNWJOb_umoSLPqVqf5s4-RuH6b2Q05SCPMGlhyafrX82R3dOAcId5UdOZF0L-nBT", "AB6AXuD6tJ8qpLe7q952D2GpKtke-o92LZgfz8ZDZ-g4l7EXV0LFjFPeLVrwObx7rcx7NLBTgxlo26ixNVuRwu_iSDUS3HpRXz_GF-J7f4e5Md7xZwM0ydTtraxytGS9U5cTdC-UKmiuXn0u8sFgt89jg3Jaxcup2T-2ZUnDf9zzQpGHj-l5BUvCmB-WLoC23FOdXFqruPTEmOlhYx3rT18Azhf2mz3HnzYccp3d-gDe_1n7Cjxn0JR5Eicva2_5s_ZOx2X44TN5IRPM3s5c", "AB6AXuBE3SsbERK0WCJtCHMjQVo_KBVDfg9C-7vXYNh-96hOh8q3VX24DVrkQcbUSH2iQuZiNzy29zHUzstFciB09D-UFIBM1JkVzMMgsJNTxfocgNvLSxGxXbTB0R8fUjipdxojQc1YEMSkUr83pp5UQsSUU8Y6L920736zMzkogLVb3neyQj73DVSEIraizIy_jRGW3FV-il5LOAF3e5eIVBweOgpEs2GdShS5J0xDVAIWne6hACuPqAH-OV3-07I7VxTsViJJHDMP5lgr"].map(
                (item) => (
                  <div key={item} className="size-8 md:size-10 overflow-hidden rounded-full border-4 border-background bg-secondary shadow-sm">
                    <img src={`https://lh3.googleusercontent.com/aida-public/${item}`} alt="User" className="size-full object-cover" />
                  </div>
                )
              )}
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              Join <span className="text-primary font-bold">5,000+</span> tenants across Nigeria
            </p>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
          <div className="absolute -top-10 lg:-top-20 -right-10 lg:-right-20 size-[300px] lg:size-[450px] rounded-full bg-primary/10 blur-[80px] lg:blur-[100px]" />
          <div className="relative z-10 aspect-9/19 w-full max-w-[240px] lg:max-w-[280px] rotate-2 overflow-hidden rounded-[2.2rem] lg:rounded-[2.5rem] border-[5px] lg:border-[6px] border-slate-900 bg-slate-100 p-1 shadow-2xl transition-transform hover:rotate-1">
             <div className="h-full w-full overflow-hidden rounded-[1.9rem] lg:rounded-[2.2rem]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3kHm8s_VKl_aO9Uz1flo51oOcCyzOhKIETgcWNzv4G3q4PGYC3nRUly9KflS61toZeU6wYV1koe86CM4nBmXHkG5NMj7EBkxgxIvHlxiDSJehAfzBrzIq9rVXTTeEXmhcjbRdH8gSk-vBnmPI-A8tsOnFyEkgkvt_BygTugTWq3qQfxgHJUNLnW-QrDh2EUv12Ywe4iSIHA0H1NGeIbpjI2Xf5e4vq_nqnrCjnVvxv0Chs6OaPgTbJ656BvuEm7edQchy3gbLBtW3"
                  alt="Premium Property Application Mockup"
                  className="h-full w-full object-cover"
                />
             </div>
            <div className="absolute inset-x-3 bottom-4 lg:bottom-5 z-20">
              <div className="rounded-xl border border-white/40 bg-white/30 p-2.5 lg:p-3 backdrop-blur-xl shadow-lg ring-1 ring-black/5">
                <div className="mb-0.5 lg:mb-1 flex items-center justify-between">
                  <span className="text-[10px] lg:text-xs font-bold text-[#1a202c]">Lekki Phase 1</span>
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[7px] lg:text-[8px] font-bold text-primary-foreground uppercase tracking-wider">New</span>
                </div>
                <div className="text-base lg:text-lg font-extrabold text-primary">N4.5M<span className="text-[10px] font-medium text-muted-foreground">/yr</span></div>
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 -left-4 lg:-left-10 z-20 flex items-center gap-2 lg:gap-3 rounded-xl bg-background/90 p-2.5 lg:p-3 shadow-[0_12px_32px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-transform hover:scale-105">
            <div className="flex size-7 lg:size-9 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-4 lg:size-5 text-primary" />
            </div>
            <div>
              <p className="text-[7px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Verified</p>
              <p className="text-[10px] lg:text-xs font-bold text-foreground">Direct Contact</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
