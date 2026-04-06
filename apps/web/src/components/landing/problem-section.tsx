import { CircleDollarSign, EyeOff, Timer } from "lucide-react"

export function ProblemSection() {
  const problems = [
    {
      icon: <CircleDollarSign className="size-6 text-destructive" />,
      title: "Extortionate Fees",
      body: "Typical agents demand 10-20% for legal and agency fees. We think that money belongs in your pocket.",
    },
    {
      icon: <EyeOff className="size-6 text-destructive" />,
      title: 'The "Wild Goose" Chase',
      body: "Photos that do not match reality and inspections that waste your valuable weekend hours.",
    },
    {
      icon: <Timer className="size-6 text-destructive" />,
      title: "Gatekeeper Delays",
      body: "Waiting days for a callback only to find out the apartment was rented out weeks ago.",
    },
  ]

  return (
    <section className="bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-bold tracking-[0.16em] text-primary uppercase border-b-2 border-primary/20 pb-1">The Old Way</span>
          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl font-heading text-foreground">The Agent Problem</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {problems.map((item) => (
            <article key={item.title} className="rounded-2xl bg-card p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-border/50">
              <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-destructive/10">{item.icon}</div>
              <h3 className="mb-4 text-2xl font-bold font-heading text-foreground">{item.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
