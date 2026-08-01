import Link from 'next/link';

export default function CustomOrderSteps() {
  return (
    <section
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-5 py-16 sm:px-8 sm:py-24"
      style={{ backgroundImage: 'url(/bring.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#2A1F14]/65" />

      <div className="relative z-10 mx-auto w-full max-w-lg text-center">

        {/* Eyebrow */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50">
          Custom Guild?
        </p>

        {/* Heading */}
        <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
          Bring Your<br />
          Idea to <span className="font-script font-normal italic text-white/80">Life</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          We design and craft custom silicone molds just for you.
        </p>

        {/* Steps */}
        <ul className="mt-8 space-y-4 text-left">
          {[
            {
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" /></>,
              text: 'Share your design, size & material',
            },
            {
              icon: <><rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4" /></>,
              text: 'We create a 3D model & share for approval',
            },
            {
              icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
              text: 'Handcrafted & delivered across India',
            },
          ].map(({ icon, text }) => (
            <li key={text} className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
              </div>
              <span className="text-sm text-white/75">{text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/custom-order"
            className="inline-flex items-center gap-3 rounded-full bg-[#FAF8F5] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#2A1F14] transition-colors hover:bg-white"
          >
            Start Your Custom Order
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
