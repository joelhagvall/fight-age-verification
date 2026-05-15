import type { Dictionary } from '#/i18n'
import type { MailTarget } from './types'

function normalizeMailBody(body: string) {
  return body.replace(/\r?\n/g, '\r\n')
}

export function flattenTargets(t: Dictionary) {
  return t.targets.groups.flatMap((group, groupIndex) =>
    group.people.map((person) => ({ ...person, group: group.title, groupIndex }))
  )
}

export function mailtoHref(targets: MailTarget[], subject: string, body: string) {
  const params = [
    ['bcc', targets.map((target) => target.email).join(',')],
    ['subject', subject],
    ['body', normalizeMailBody(body)],
  ] satisfies [string, string][]
  const encodedParams = params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return `mailto:?${encodedParams}`
}
