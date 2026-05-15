import { describe, expect, it } from 'vitest'
import { dictionaries } from './index'

describe('i18n dictionaries', () => {
  it('keeps English and Swedish campaign content aligned', () => {
    expect(dictionaries.en.issue.items).toHaveLength(dictionaries.sv.issue.items.length)
    expect(dictionaries.en.definition.items).toHaveLength(
      dictionaries.sv.definition.items.length
    )
    expect(dictionaries.en.questions.items).toHaveLength(
      dictionaries.sv.questions.items.length
    )
    expect(dictionaries.en.targets.groups).toHaveLength(
      dictionaries.sv.targets.groups.length
    )
    expect(dictionaries.en.targets.groups.map((group) => group.people.length)).toEqual(
      dictionaries.sv.targets.groups.map((group) => group.people.length)
    )
    expect(dictionaries.en.sources.items).toHaveLength(dictionaries.sv.sources.items.length)
  })
})
