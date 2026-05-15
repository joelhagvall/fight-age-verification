import { startTransition, useEffect, useRef, useState } from 'react'
import ArrowRightIcon from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import CopyIcon from 'lucide-react/dist/esm/icons/copy.mjs'
import MailIcon from 'lucide-react/dist/esm/icons/mail.mjs'
import { dictionaries, type Dictionary } from '#/i18n'
import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'
import { flattenTargets, mailtoHref } from './mail'

interface EmailActionSectionProps {
  t: Dictionary
}

const EMPTY_SELECTION_MESSAGE = ''
const DEFAULT_SELECTED_GROUP_COUNT = 1

export default function EmailActionSection({ t }: EmailActionSectionProps) {
  const previewCardRef = useRef<HTMLDivElement>(null)
  const targets = flattenTargets(t)
  const [selectedEmails, setSelectedEmails] = useState(() =>
    defaultSelectedEmails(targets)
  )
  const [customBody, setCustomBody] = useState(t.targets.body)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [selectionMessage, setSelectionMessage] = useState(EMPTY_SELECTION_MESSAGE)
  const [selectedGroup, setSelectedGroup] = useState('0')
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

  function setTargetChecked(email: string, checked: boolean) {
    setIsPreviewing(false)
    setSelectionMessage(EMPTY_SELECTION_MESSAGE)
    setSelectedEmails((current) => {
      if (checked) {
        return current.includes(email) ? current : [...current, email]
      }

      return current.filter((selected) => selected !== email)
    })
  }

  function handleTargetCardClick(event: React.MouseEvent, email: string) {
    if (
      event.target instanceof Element &&
      event.target.closest('[data-slot="checkbox"]')
    ) {
      return
    }

    toggleTarget(email)
  }

  function scrollToPreviewCard() {
    requestAnimationFrame(() => {
      previewCardRef.current?.scrollIntoView({
        block: 'start',
      })
    })
  }

  function showPreview() {
    if (selectedTargets.length === 0) {
      setSelectionMessage(t.targets.noSelection)
      return
    }

    setSelectionMessage(EMPTY_SELECTION_MESSAGE)
    setIsPreviewing(true)
    scrollToPreviewCard()
  }

  function hidePreview() {
    setIsPreviewing(false)
    scrollToPreviewCard()
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
                      <div
                        key={target.email}
                        onClick={(event) => {
                          handleTargetCardClick(event, target.email)
                        }}
                        className={cn(
                          'grid cursor-pointer gap-3 rounded-lg border p-4 sm:grid-cols-[auto_1fr]',
                          checked
                            ? 'border-primary bg-background'
                            : 'bg-background/70 hover:bg-background'
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(nextChecked) => {
                            setTargetChecked(target.email, nextChecked)
                          }}
                          aria-label={target.name}
                          className="mt-1 size-6"
                        />
                        <span className="grid gap-1">
                          <span className="flex min-w-0 flex-wrap items-center gap-2">
                            <span className="font-semibold">{target.name}</span>
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                              {target.group}
                            </span>
                          </span>
                          <span className="text-sm leading-6 text-muted-foreground">
                            {target.role}
                          </span>
                          <span className="flex min-w-0 items-start gap-1.5 text-xs text-muted-foreground">
                            <MailIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                            <span className="min-w-0">
                              <span className="font-medium text-foreground">
                                {t.targets.emailLabel}:{' '}
                              </span>
                              <span className="break-all">{target.email.toLowerCase()}</span>
                            </span>
                          </span>
                        </span>
                      </div>
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
                      onClick={hidePreview}
                      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
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
                      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                    >
                      <CopyIcon data-icon="inline-start" />
                      {t.targets.copyRecipients}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void copyText(customBody)
                      }}
                      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
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
                          'rounded-md px-3 py-2 text-sm font-medium',
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
                          'rounded-md px-3 py-2 text-sm font-medium',
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
  )
}

function defaultSelectedEmails(targets: ReturnType<typeof flattenTargets>) {
  return targets
    .filter((target) => target.groupIndex < DEFAULT_SELECTED_GROUP_COUNT)
    .map((target) => target.email)
}
