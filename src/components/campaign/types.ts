import type { Dictionary } from '#/i18n'

export type RawMailTarget = Dictionary['targets']['groups'][number]['people'][number]
export type MailTarget = RawMailTarget & { group: string; groupIndex: number }

