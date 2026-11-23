import { describe, expect, it } from 'vitest'
import { createExampleTwoslasher } from '../docs/.vitepress/config/examples'
import plugin from '../src'

describe('documentation examples', () => {
  it('checks an opt-in rule without unrelated recommended diagnostics', () => {
    const lint = createExampleTwoslasher(plugin, 'no-unsafe-href')

    expect(lint('<svg><a href="#local"/></svg>').nodes).toEqual([])
    expect(
      lint('<svg><a href="javascript:alert(1)"/></svg>').nodes,
    ).toMatchObject([{ id: 'svg/no-unsafe-href', filename: 'example.svg' }])
  })

  it('supports standalone SVG rules and example-specific options', () => {
    expect(
      createExampleTwoslasher(plugin, 'require-xmlns')('<svg/>').nodes,
    ).toMatchObject([{ id: 'svg/require-xmlns' }])
    expect(
      createExampleTwoslasher(plugin, 'no-elements', [{ elements: ['style'] }])(
        '<svg><style/></svg>',
      ).nodes,
    ).toMatchObject([{ id: 'svg/no-elements' }])
    expect(
      createExampleTwoslasher(plugin, 'no-base64-data-url', [
        { mode: 'any-data-url' },
      ])('<svg><image href="data:image/svg+xml,%3Csvg/%3E"/></svg>').nodes,
    ).toMatchObject([{ id: 'svg/no-base64-data-url' }])
  })
})
