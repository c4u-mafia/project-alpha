import { Apple } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export function JoinCommunity() {
  const googleIcon = "https://lh3.googleusercontent.com/aida-public/AB6AXuAYwYu-8rjXGFpi-DfvlKK-PWJI-wEns29AH3TewfuskfdUpo2egafOLJptyn3v1JQaDyfR8TMOOERVSuTd1qTOC6oQ8APzy9xTp1TnvVZkiMuihyp4Aq3RFtsyv0nJU4WMZqGez5mXacJxm94G6XDFI0D_dq79CdjZj60PNPHU5n6ya_zi5qK2S0_0JFWEf0fplBMr5TxqHlgi8iArgS8MRZbrZzSr5BqWp5r74hrDKKdGxgaq6zyX-79oA1hyhUTyhx8MMW73P99Y"

  return (
    <section className="bg-slate-100 py-24 pb-32">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-card p-10 shadow-[0_12px_44px_rgba(0,0,0,0.05)] border border-slate-100 md:p-16">
          <div className="absolute top-0 left-0 h-full w-2.5 bg-primary" />
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-extrabold lg:text-3xl font-heading text-foreground">Join the community</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">Your perfect home is just a few clicks away. Register to experience the future of rental markets.</p>
          </div>

          <Tabs defaultValue="tenant" className="w-full">
            <TabsList className="mb-10 w-full rounded-2xl bg-secondary p-1.5 h-14 lg:h-16 shadow-inner ring-1 ring-slate-200/50">
              <TabsTrigger 
                value="tenant" 
                className="flex-1 rounded-xl px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-extrabold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
              >
                I am a Tenant
              </TabsTrigger>
              <TabsTrigger 
                value="landlord" 
                className="flex-1 rounded-xl px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-extrabold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
              >
                I am a Landlord
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tenant" className="animate-in fade-in-50 duration-500">
              <CommunityForm role="Tenant" googleIcon={googleIcon} />
            </TabsContent>
            <TabsContent value="landlord" className="animate-in fade-in-50 duration-500">
              <CommunityForm role="Landlord" googleIcon={googleIcon} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

interface FormProps {
  role: string
  googleIcon: string
}

function CommunityForm({ role, googleIcon }: FormProps) {
  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Full Name</span>
          <input
            type="text"
            placeholder="e.g. Ebuka Okafor"
            className="w-full rounded-2xl bg-secondary border-2 border-transparent px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-primary/20 focus:bg-background focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </label>
        <label className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Email Address</span>
          <input
            type="email"
            placeholder="ebuka@email.com"
            className="w-full rounded-2xl bg-secondary border-2 border-transparent px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-primary/20 focus:bg-background focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </label>
        <label className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Phone Number</span>
          <input
            type="tel"
            placeholder="+234 ..."
            className="w-full rounded-2xl bg-secondary border-2 border-transparent px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-primary/20 focus:bg-background focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </label>
        <label className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">Password</span>
          <input
            type="password"
            placeholder="Secure Password"
            className="w-full rounded-2xl bg-secondary border-2 border-transparent px-5 py-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-primary/20 focus:bg-background focus:ring-4 focus:ring-primary/5 shadow-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-linear-to-br from-primary to-primary/80 py-5 text-lg font-extrabold text-primary-foreground shadow-xl shadow-teal-900/10 transition-all hover:scale-[1.01] hover:shadow-teal-900/20 active:scale-95 flex items-center justify-center gap-2 group font-heading"
      >
        <span>Join as {role}</span>
        <span className="text-sm opacity-50 group-hover:translate-x-1 transition-transform">→</span>
      </button>

      <div className="relative flex items-center py-6">
        <div className="grow border-t border-border" />
        <span className="mx-6 text-xs font-bold tracking-widest text-muted-foreground uppercase">or continue with</span>
        <div className="grow border-t border-border" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-border py-4 bg-background transition-all hover:border-primary/30 hover:bg-slate-50 active:scale-95 shadow-sm font-heading">
          <img src={googleIcon} alt="Google" className="size-5 transition-transform group-hover:scale-110" />
          <span className="text-sm font-extrabold text-foreground">Google Store</span>
        </button>
        <button type="button" className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-border py-4 bg-background transition-all hover:border-primary/30 hover:bg-slate-50 active:scale-95 shadow-sm font-heading">
          <Apple className="size-5 transition-transform group-hover:scale-110" />
          <span className="text-sm font-extrabold text-foreground">iOS Store</span>
        </button>
      </div>
    </form>
  )
}
