// Auth page layout, following startuphealer.com:
// - /login: form on the left, an "OR" divider, social sign-in on the right (`aside`)
// - /register: a single centred form
export default function AuthShell({
  title,
  subtitle,
  children,
  aside,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const heading = (
    <div className={aside ? "" : "text-center"}>
      <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">{title}</h1>
      <p className="text-gradient mt-2 text-2xl font-bold sm:text-3xl">
        {subtitle} <span aria-hidden>↓</span>
      </p>
    </div>
  );
  const card = <div className="mt-6 rounded-2xl border-2 border-cyan-200 bg-white/95 p-6 shadow-lg backdrop-blur-md sm:p-8">{children}</div>;

  if (!aside) {
    return (
      <section className="py-12 sm:py-20">
        <div className="container-x max-w-lg">
          {heading}
          {card}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20">
      <div className="container-x grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,22rem)] lg:gap-12">
        <div>
          {heading}
          {card}
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 lg:flex-col" aria-hidden>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent lg:h-24 lg:w-px lg:flex-none lg:bg-gradient-to-b" />
          <span className="rounded-full border-2 border-cyan-200 bg-white px-3 py-2 shadow-sm">OR</span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent lg:h-24 lg:w-px lg:flex-none lg:bg-gradient-to-b" />
        </div>
        <div>{aside}</div>
      </div>
    </section>
  );
}
