export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper-2 py-24 sm:py-32">
      <div className="shell">
        <h2 id="about-title" className="sr-only">
          About
        </h2>
        <figure className="max-w-[68rem]">
          <blockquote className="display text-[clamp(2.25rem,5.4vw,5rem)] leading-[1.02] text-ink">
            Great digital marketing doesn&rsquo;t happen in silos. It happens when creative, technology and data
            work together.
          </blockquote>
        </figure>

        <div className="mt-14 grid gap-10 border-t border-ink/20 pt-10 sm:mt-20 lg:grid-cols-12">
          <p className="text-sm text-muted lg:col-span-3">About Emmanuel</p>
          <div className="grid gap-6 text-lg leading-relaxed text-ink/85 lg:col-span-9 lg:grid-cols-2 lg:gap-10">
            <p>
              I started on the web side, building and maintaining WordPress sites, then moved into enterprise
              email, where development, customer data and marketing meet. Since then I have led email development
              for healthcare programs, engineered Salesforce Marketing Cloud automation for an insurer, and built
              customer communications for one of the largest banks in the United States.
            </p>
            <p>
              I bring a development-first mindset to marketing technology. I read a brief, a data model and a
              compliance requirement with the same attention, and I know what it takes to get a sophisticated
              experience from requirements to a tested, production-ready send. I am based in Utah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
