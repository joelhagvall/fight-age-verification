import type { Dictionary } from '#/i18n'

interface WhySectionProps {
  t: Dictionary
}

export default function WhySection({ t }: WhySectionProps) {
  return (
    <section id="why" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr] md:items-start">
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <h2 className="text-4xl font-semibold tracking-tight text-balance">
          {t.questions.title}
        </h2>
        <p className="text-lg leading-8 text-muted-foreground">
          {t.questions.lead}
        </p>
      </div>
      <div className="grid gap-0">
        {t.questions.items.map((item) => (
          <div key={item.question} className="grid gap-2 border-b py-6 last:border-b-0">
            <h3 className="m-0 text-lg font-semibold">{item.question}</h3>
            <p className="m-0 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
