import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[75vh] flex items-center justify-center px-6 pt-28 pb-20 text-center">
      <div className="max-w-xl">
        <p className="text-gold font-head tracking-[0.3em] uppercase text-sm mb-5">404 / Lost Signal</p>
        <h1 className="font-head text-6xl sm:text-8xl leading-none mb-6">This track does not exist.</h1>
        <p className="text-gray-400 leading-relaxed mb-10">
          The page may have moved, but the studio is still live.
        </p>
        <Link href="/" className="button-primary">Return Home</Link>
      </div>
    </section>
  );
}
