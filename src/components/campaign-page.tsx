import { startTransition, useEffect, useRef, useState } from 'react'
import ArrowRightIcon from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import BookOpenIcon from 'lucide-react/dist/esm/icons/book-open.mjs'
import BrainIcon from 'lucide-react/dist/esm/icons/brain.mjs'
import CheckIcon from 'lucide-react/dist/esm/icons/check.mjs'
import CopyIcon from 'lucide-react/dist/esm/icons/copy.mjs'
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link.mjs'
import LandmarkIcon from 'lucide-react/dist/esm/icons/landmark.mjs'
import MailIcon from 'lucide-react/dist/esm/icons/mail.mjs'
import MessageCircleIcon from 'lucide-react/dist/esm/icons/message-circle.mjs'
import RocketIcon from 'lucide-react/dist/esm/icons/rocket.mjs'
import ScaleIcon from 'lucide-react/dist/esm/icons/scale.mjs'
import ShieldAlertIcon from 'lucide-react/dist/esm/icons/shield-alert.mjs'
import UsersIcon from 'lucide-react/dist/esm/icons/users.mjs'
import { dictionaries, type Dictionary } from '#/i18n'
import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'

interface CampaignPageProps {
  t: Dictionary
}

type RawMailTarget = Dictionary['targets']['groups'][number]['people'][number]
type MailTarget = RawMailTarget & { group: string; groupIndex: number }

const issueIcons = [LandmarkIcon, ScaleIcon, ShieldAlertIcon] as const
const scenarioIcons = [
  MessageCircleIcon,
  BookOpenIcon,
  RocketIcon,
  BrainIcon,
] as const
const EMPTY_SELECTION_MESSAGE = ''

function flattenTargets(t: Dictionary) {
  return t.targets.groups.flatMap((group, groupIndex) =>
    group.people.map((person) => ({ ...person, group: group.title, groupIndex }))
  )
}

function mailtoHref(targets: MailTarget[], subject: string, body: string) {
  const params = [
    ['bcc', targets.map((target) => target.email).join(',')],
    ['subject', subject],
    ['body', body],
  ] satisfies [string, string][]
  const encodedParams = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return `mailto:?${encodedParams}`
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export default function CampaignPage({ t }: CampaignPageProps) {
  const previewCardRef = useRef<HTMLDivElement>(null)
  const targets = flattenTargets(t)
  const [selectedEmails, setSelectedEmails] = useState(() =>
    targets.map((target) => target.email)
  )
  const [customBody, setCustomBody] = useState(t.targets.body)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [selectionMessage, setSelectionMessage] = useState(EMPTY_SELECTION_MESSAGE)
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<'short' | 'long'>('short')

  const selectedEmailSet = new Set(selectedEmails)
  const selectedTargets = targets.filter((target) =>
    selectedEmailSet.has(target.email)
  )
  const targetGroups = [
    { label: t.targets.allCountries, value: 'all' },
    ...t.targets.groups.map((group, index) => ({
      label: group.title,
      value: String(index),
    })),
  ]
  const visibleTargets =
    selectedGroup === 'all'
      ? targets
      : targets.filter((target) => String(target.groupIndex) === selectedGroup)
  const usesEnglishMailCopy = selectedTargets.some((target) => target.groupIndex !== 0)
  const mailSubject = usesEnglishMailCopy
    ? dictionaries.en.targets.subject
    : t.targets.subject
  const activeTargetCopy = usesEnglishMailCopy ? dictionaries.en.targets : t.targets
  const mailBodyTemplate =
    selectedTemplate === 'short' ? activeTargetCopy.shortBody : activeTargetCopy.body
  const visibleRecipientNames = selectedTargets.slice(0, 4)
  const hiddenRecipientCount = Math.max(
    selectedTargets.length - visibleRecipientNames.length,
    0
  )

  useEffect(() => {
    startTransition(() => {
      setCustomBody(mailBodyTemplate)
    })
  }, [mailBodyTemplate])

  function selectGroup(groupValue: string) {
    setSelectedGroup(groupValue)
    setIsPreviewing(false)
    setSelectionMessage(EMPTY_SELECTION_MESSAGE)
    setSelectedEmails(
      groupValue === 'all'
        ? targets.map((target) => target.email)
        : targets
            .filter((target) => String(target.groupIndex) === groupValue)
            .map((target) => target.email)
    )
  }

  function toggleTarget(email: string) {
    setIsPreviewing(false)
    setSelectionMessage(EMPTY_SELECTION_MESSAGE)
    setSelectedEmails((current) =>
      current.includes(email)
        ? current.filter((selected) => selected !== email)
        : [...current, email]
    )
  }

  function showPreview() {
    if (selectedTargets.length === 0) {
      setSelectionMessage(t.targets.noSelection)
      return
    }

    setSelectionMessage(EMPTY_SELECTION_MESSAGE)
    setIsPreviewing(true)
    requestAnimationFrame(() => {
      previewCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setSelectionMessage(t.targets.copied)
    } catch {
      setSelectionMessage(t.targets.copyFailed)
    }
  }

  return (
    <main id="top" className="min-h-svh bg-background pt-20 text-foreground">
      <section
        id="main-content"
        className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center md:py-32"
      >
        <div className="calm-reveal flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6">
            <img
              src="/logo-eu-proposal-288.webp"
              alt={t.nav.brand}
              className="size-28 object-contain md:size-36"
              width="144"
              height="144"
              decoding="async"
              fetchPriority="high"
            />
            <h1 className="max-w-5xl text-6xl font-semibold tracking-tight text-balance md:text-8xl">
              {t.hero.title}
            </h1>
            <p className="max-w-3xl text-xl leading-8 text-muted-foreground md:text-2xl md:leading-9">
              {t.hero.lead}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => { scrollToSection('why'); }}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              {t.hero.secondary}
            </button>
            <button
              type="button"
              onClick={() => { scrollToSection('targets'); }}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              {t.hero.primary}
              <ArrowRightIcon data-icon="inline-end" />
            </button>
          </div>
        </div>
      </section>

      <section id="issue" className="mx-auto grid max-w-4xl gap-8 px-6 py-20">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-balance">
          {t.issue.title}
        </h2>
        <p className="mx-auto max-w-3xl text-center text-lg leading-8 text-muted-foreground">
          {t.issue.lead}
        </p>
        <div className="grid gap-0 border-y">
          {t.issue.items.map((item, index) => {
            const Icon = issueIcons[index] ?? ShieldAlertIcon

            return (
              <div
                className="calm-reveal-stagger grid gap-3 border-b py-6 last:border-b-0 sm:grid-cols-[auto_1fr] sm:gap-5"
                key={item.label}
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="grid gap-1">
                  <h3 className="m-0 text-lg font-semibold">{item.label}</h3>
                  <p className="m-0 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.sources.map((source) => (
                      <a
                        key={source.href}
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      >
                        {source.label}
                        <ExternalLinkIcon
                          className="size-3 opacity-60"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section id="why" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <h2 className="text-4xl font-semibold tracking-tight text-balance">
            {t.questions.title}
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {t.questions.lead}
          </p>
        </div>
        <div className="grid gap-0 border-y">
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

      <section id="targets">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance">
              {t.targets.title}
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              {t.targets.lead}
            </p>
          </div>

          <div className="grid items-stretch gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="h-136 overflow-hidden lg:h-192">
              <CardHeader>
                <CardTitle>{t.targets.recipientsTitle}</CardTitle>
                <CardDescription aria-live="polite" className="tabular-nums">
                  {selectedEmails.length} / {targets.length} {t.targets.selectedCount}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
                <label className="grid gap-2 text-sm font-medium">
                  <span>{t.targets.countryLabel}</span>
                  <Select
                    value={selectedGroup}
                    items={targetGroups}
                    onValueChange={(value) => {
                      if (value) {
                        selectGroup(value)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPositioner>
                      <SelectPopup>
                        {targetGroups.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectPopup>
                    </SelectPositioner>
                  </Select>
                </label>
                <div className="min-h-0 overflow-y-auto pr-1">
                  <div className="grid gap-3">
                    {visibleTargets.map((target) => {
                      const checked = selectedEmailSet.has(target.email)
                      return (
                        <label
                          key={target.email}
                          className={cn(
                            'grid cursor-pointer gap-3 rounded-lg border p-4 transition sm:grid-cols-[auto_1fr]',
                            checked
                              ? 'border-primary bg-background'
                              : 'bg-background/70 hover:bg-background'
                          )}
                        >
                          <input
                            type="checkbox"
                            name="mail-targets"
                            value={target.email}
                            checked={checked}
                            onChange={() => { toggleTarget(target.email); }}
                            className="mt-1 size-4"
                          />
                          <span className="grid gap-1">
                            <span className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="font-semibold">{target.name}</span>
                              <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                {target.group}
                              </span>
                              {checked ? <CheckIcon aria-hidden="true" /> : null}
                            </span>
                            <span className="text-sm leading-6 text-muted-foreground">
                              {target.role}
                            </span>
                            <span className="break-all text-xs text-muted-foreground">
                              {target.email}
                            </span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              ref={previewCardRef}
              className={cn(
                'min-h-216 scroll-mt-28 lg:h-248',
                isPreviewing ? 'ring-primary' : undefined
              )}
            >
              <CardHeader>
                <CardTitle>{t.targets.previewTitle}</CardTitle>
                <CardDescription>{t.targets.previewLead}</CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
                {isPreviewing ? (
                  <>
                    <div className="grid gap-4 rounded-lg border bg-background p-4 text-sm shadow-sm">
                      <div className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t.targets.toLabel}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {visibleRecipientNames.map((target) => (
                            <span
                              key={target.email}
                              className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
                            >
                              {target.name}
                            </span>
                          ))}
                          {hiddenRecipientCount > 0 ? (
                            <span className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                              +{hiddenRecipientCount} {t.targets.moreRecipients}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="grid gap-1 border-t pt-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {t.targets.subjectLabel}
                        </span>
                        <p className="m-0 text-sm leading-6 text-foreground">
                          {mailSubject}
                        </p>
                      </div>
                    </div>
                    <div className="grid min-h-112 flex-1 grid-rows-[auto_1fr] overflow-hidden rounded-lg border bg-background lg:min-h-0">
                      <div className="border-b px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t.targets.messageLabel}
                      </div>
                      <pre className="overflow-auto p-4 whitespace-pre-wrap font-sans text-sm leading-6 text-muted-foreground">
                        {customBody}
                      </pre>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => { setIsPreviewing(false); }}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'lg' })
                        )}
                      >
                        {t.targets.back}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void copyText(
                            selectedTargets.map((target) => target.email).join(', ')
                          )
                        }}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'lg' })
                        )}
                      >
                        <CopyIcon data-icon="inline-start" />
                        {t.targets.copyRecipients}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void copyText(customBody)
                        }}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'lg' })
                        )}
                      >
                        <CopyIcon data-icon="inline-start" />
                        {t.targets.copyBody}
                      </button>
                      <a
                        href={mailtoHref(selectedTargets, mailSubject, customBody)}
                        className={cn(buttonVariants({ size: 'lg' }), 'flex-1')}
                      >
                        <MailIcon data-icon="inline-start" />
                        {t.targets.button}
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-2">
                      <span className="text-sm font-medium">
                        {t.targets.templateLabel}
                      </span>
                      <div className="grid grid-cols-2 rounded-lg border p-1">
                        <button
                          type="button"
                          onClick={() => { setSelectedTemplate('short'); }}
                          className={cn(
                            'rounded-md px-3 py-2 text-sm font-medium transition',
                            selectedTemplate === 'short'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {t.targets.templateShort}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedTemplate('long'); }}
                          className={cn(
                            'rounded-md px-3 py-2 text-sm font-medium transition',
                            selectedTemplate === 'long'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {t.targets.templateLong}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 py-2 text-sm font-medium">
                      <span className="rounded-full bg-primary px-5 py-2 text-primary-foreground">
                        {t.targets.customiseStep}
                      </span>
                      <span className="h-px w-10 bg-border" />
                      <span className="rounded-full border px-5 py-2 text-muted-foreground">
                        {t.targets.sendStep}
                      </span>
                    </div>
                    <label className="flex min-h-0 flex-1 flex-col gap-3">
                      <span className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                        {t.targets.customiseTitle}
                      </span>
                      <textarea
                        value={customBody}
                        onChange={(event) => { setCustomBody(event.target.value); }}
                        aria-label={t.targets.customiseTitle}
                        className="h-168 min-h-0 w-full flex-1 resize-none rounded-lg border bg-background p-5 text-base leading-7 text-foreground shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:h-auto"
                      />
                    </label>
                    <strong className="text-center text-sm text-foreground">
                      {t.targets.nameReminder}
                    </strong>
                    <button
                      type="button"
                      onClick={showPreview}
                      className={cn(buttonVariants({ size: 'lg' }), 'mx-auto w-fit')}
                    >
                      {selectedTargets.length === 0
                        ? t.targets.noSelection
                        : t.targets.continue}
                      <ArrowRightIcon data-icon="inline-end" />
                    </button>
                  </>
                )}
                <p aria-live="polite" className="m-0 text-sm text-muted-foreground">
                  {selectionMessage}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="sources" className="mx-auto grid max-w-4xl gap-6 px-6 py-28 text-sm">
        <h2 className="m-0 text-3xl font-semibold tracking-tight">
          {t.sources.title}
        </h2>
        <ul className="grid gap-4">
          {t.sources.items.map((source) => (
            <li key={source.href} className="grid gap-1 border-b pb-4 last:border-b-0">
              <p className="m-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {source.source} · {source.type}
              </p>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
