import { describe, expect, it } from 'vitest'
import { mailtoHref } from './mail'
import type { MailTarget } from './types'

const targets: MailTarget[] = [
  {
    name: 'Test Recipient',
    role: 'Role',
    email: 'test@example.com',
    group: 'Test',
    groupIndex: 0,
  },
]

describe('mailtoHref', () => {
  it('preserves paragraph spacing with CRLF line breaks', () => {
    const href = mailtoHref(targets, 'Subject', 'Hello\n\nSecond paragraph')

    expect(href).toContain('body=Hello%0D%0A%0D%0ASecond%20paragraph')
  })
})
