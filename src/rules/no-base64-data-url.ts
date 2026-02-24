import { createESLintRule, resolveOptions } from '../utils'

export const RULE_NAME = 'no-base64-data-url'
export type MessageIds = 'invalid'
export type Options = [
  {
    mode?: 'base64-only' | 'any-data-url'
    attributes?: '*' | string[]
    ignoreAttributes?: string[]
    checkUrlFunction?: boolean
    allowMimeTypes?: string[]
  },
]

const defaultOptions: Required<Options[0]> = {
  mode: 'base64-only',
  attributes: '*',
  ignoreAttributes: [],
  checkUrlFunction: true,
  allowMimeTypes: [],
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function parseDataUrl(value: string): {
  isDataUrl: boolean
  isBase64: boolean
  mimeType: string
} {
  const rawValue = value.trim()
  const lowerValue = rawValue.toLowerCase()

  if (!lowerValue.startsWith('data:')) {
    return {
      isDataUrl: false,
      isBase64: false,
      mimeType: '',
    }
  }

  const commaIndex = rawValue.indexOf(',')

  if (commaIndex === -1) {
    return {
      isDataUrl: false,
      isBase64: false,
      mimeType: '',
    }
  }

  const header = rawValue.slice(5, commaIndex)
  const parts = header.split(';').map(part => normalize(part))
  const firstPart = parts[0] ?? ''
  const mimeType = firstPart.includes('/') ? firstPart : ''

  const isBase64 = parts.includes('base64')

  return {
    isDataUrl: true,
    isBase64,
    mimeType,
  }
}

function extractUrlValues(value: string): string[] {
  const candidates: string[] = []
  const lowerValue = value.toLowerCase()
  let index = 0

  while (index < value.length) {
    const openIndex = lowerValue.indexOf('url(', index)

    if (openIndex === -1) {
      break
    }

    const contentStart = openIndex + 4
    const closeIndex = value.indexOf(')', contentStart)

    if (closeIndex === -1) {
      break
    }

    let content = value.slice(contentStart, closeIndex).trim()

    if (
      (content.startsWith('"') && content.endsWith('"'))
      || (content.startsWith("'") && content.endsWith("'"))
    ) {
      content = content.slice(1, -1).trim()
    }

    candidates.push(content)
    index = closeIndex + 1
  }

  return candidates
}

function isDisallowedDataUrl(
  value: string,
  mode: Required<Options[0]>['mode'],
  allowedMimeTypes: Set<string>,
): boolean {
  const parsed = parseDataUrl(value)

  if (!parsed.isDataUrl) {
    return false
  }

  if (parsed.mimeType && allowedMimeTypes.has(parsed.mimeType)) {
    return false
  }

  if (mode === 'any-data-url') {
    return true
  }

  return parsed.isBase64
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow base64 data URLs in SVG attributes',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            description: `whether to disallow only base64 data URLs or all data URLs`,
            enum: ['base64-only', 'any-data-url'],
          },
          attributes: {
            description: 'attributes to check',
            oneOf: [
              {
                description: 'check all attributes',
                type: 'string',
                const: '*',
              },
              {
                description: 'check only listed attributes',
                type: 'array',
                items: {
                  type: 'string',
                },
                uniqueItems: true,
              },
            ],
          },
          ignoreAttributes: {
            type: 'array',
            description: 'attribute names to ignore',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          checkUrlFunction: {
            type: 'boolean',
            description: 'whether to check data URLs wrapped by url(...)',
          },
          allowMimeTypes: {
            type: 'array',
            description: 'MIME types to allow for data URLs',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalid: `Data URL usage is not allowed in attribute '{{name}}'`,
    },
  },
  defaultOptions: [defaultOptions],
  create(context) {
    const resolvedOptions = resolveOptions(context.options, defaultOptions)
    const {
      mode,
      attributes,
      ignoreAttributes,
      checkUrlFunction,
      allowMimeTypes,
    } = {
      ...defaultOptions,
      ...resolvedOptions,
    }

    let allowedAttributes: Set<string> | null = null

    if (attributes !== '*') {
      allowedAttributes = new Set(attributes.map(name => normalize(name)))
    }
    const ignoredAttributes = new Set(
      ignoreAttributes.map(name => normalize(name)),
    )
    const allowedMimeTypes = new Set(
      allowMimeTypes.map(type => normalize(type)),
    )

    return {
      Attribute(node) {
        if (!node.value) {
          return
        }

        const name = normalize(node.key.value)

        if (ignoredAttributes.has(name)) {
          return
        }

        if (allowedAttributes && !allowedAttributes.has(name)) {
          return
        }

        const valuesToCheck = [node.value.value]

        if (checkUrlFunction) {
          valuesToCheck.push(...extractUrlValues(node.value.value))
        }

        if (
          valuesToCheck.some(value =>
            isDisallowedDataUrl(value, mode, allowedMimeTypes),
          )
        ) {
          context.report({
            node: node.value,
            messageId: 'invalid',
            data: {
              name: node.key.value,
            },
          })
        }
      },
    }
  },
})
