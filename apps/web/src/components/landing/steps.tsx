export function Steps() {
  const steps = [
    { 
      step: "1", 
      title: "Sign Up", 
      body: "Create a tenant or landlord profile in minutes." 
    },
    { 
      step: "2", 
      title: "Search or List", 
      body: "Browse verified homes or publish your property." 
    },
    { 
      step: "3", 
      title: "Connect & Move", 
      body: "Chat, sign digitally, pay securely, and move in." 
    }
  ]

  return (
    <section className="bg-slate-50 py-24" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-extrabold md:text-5xl lg:text-3xl font-heading text-foreground">Simple 3-Step Flow</h2>
        </div>
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="absolute top-1/2 right-[15%] left-[15%] hidden h-px -translate-y-1/2 bg-slate-200 md:block border-t-2 border-dashed" />
          {steps.map((item) => (
            <article key={item.step} className="relative z-10 text-center group">
              <div className="mx-auto mb-8 flex size-20 lg:size-24 items-center justify-center rounded-full border-8 border-white bg-primary text-3xl lg:text-4xl font-extrabold text-primary-foreground shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]">
                {item.step}
              </div>
              <h3 className="mb-4 text-2xl lg:text-3xl font-bold font-heading text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto text-sm lg:text-base font-medium">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
