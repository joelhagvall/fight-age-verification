import BookOpenIcon from 'lucide-react/dist/esm/icons/book-open.mjs'
import BrainIcon from 'lucide-react/dist/esm/icons/brain.mjs'
import MessageCircleIcon from 'lucide-react/dist/esm/icons/message-circle.mjs'
import RocketIcon from 'lucide-react/dist/esm/icons/rocket.mjs'
import UsersIcon from 'lucide-react/dist/esm/icons/users.mjs'
import type { Dictionary } from '#/i18n'
import { Card, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'

interface ScenariosSectionProps {
  t: Dictionary
}

const scenarioIcons = [
  MessageCircleIcon,
  BookOpenIcon,
  RocketIcon,
  BrainIcon,
] as const

export default function ScenariosSection({ t }: ScenariosSectionProps) {
  return (
    <section>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance">
            {t.scenarios.title}
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {t.scenarios.lead}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {t.scenarios.items.map((item, index) => {
            const Icon = scenarioIcons[index] ?? UsersIcon

            return (
              <Card key={item.id} className="rounded-lg">
                <CardHeader>
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

