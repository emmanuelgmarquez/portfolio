import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-[80svh] flex-col justify-center pt-24">
      <p className="text-sm text-muted">404</p>
      <h1 className="display mt-3 text-[clamp(3rem,9vw,7rem)]">This page isn&rsquo;t here.</h1>
      <p className="mt-6 max-w-[32rem] text-lg text-muted">
        The link may be out of date. The work and contact details are on the homepage.
      </p>
      <Link href="/" className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-ink px-6 text-paper hover:bg-signal">
        Go to the homepage
      </Link>
    </main>
  );
}
