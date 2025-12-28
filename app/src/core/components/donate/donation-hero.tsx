export function DonationHero() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-primary/10 to-background">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance">
          Preserve Heritage. Support Communities.
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty">
          Join a global movement to restore the world's most significant cultural treasures. Your contribution directly
          supports restoration efforts and empowers local communities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Explore Projects
          </button>
          <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
