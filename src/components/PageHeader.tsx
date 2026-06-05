type PageHeaderProps = {
  title: string;
  description: string;
  badgeText?: string;
};

export function PageHeader({ title, description, badgeText }: PageHeaderProps) {
  return (
    <section className="border-b border-fritz-stone-200 bg-white pl-16 pr-6 py-6 md:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-fritz-stone-950">{title}</h1>

          {badgeText && (
            <span className="inline-flex items-center gap-2.5 rounded-full border border-fritz-bright-100 bg-fritz-bright-50 px-3 py-1 text-xs font-bold text-fritz-bright-700">
              
              {/* EFEITO DE BOLINHA ONLINE (PULSO) */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              
              {badgeText}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-fritz-stone-500">{description}</p>
      </div>

      <div className="text-left lg:text-right">
        <p className="text-sm font-bold text-fritz-stone-800">
          Suporte: (47) 3231-0800
        </p>
        <p className="text-xs text-fritz-stone-500">
          fritz@fritzdistribuidora.com.br
        </p>
      </div>
    </section>
  );
}