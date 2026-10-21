import rule, { RULE_NAME } from '../../src/rules/no-invalid-reference-targets'
import { run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    '<svg><path fill="var(--paint, url(#wrong))"/><path id="wrong"/></svg>',
    '<svg><path fill="url(#g)/* url(#wrong) */"/><linearGradient id="g"/><path id="wrong"/></svg>',

    '<svg><constructor href="#p"/><path id="p"/></svg>',
    ...['linearGradient', 'radialGradient', 'pattern'].map(
      name =>
        `<svg><path fill="url(#paint)" stroke="url(#paint)"/><${name} id="paint"/></svg>`,
    ),
    ...['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'].map(
      name => `<svg><textPath href="#geometry"/><${name} id="geometry"/></svg>`,
    ),
    '<svg><path clip-path="url(#clip)" filter="url(#filter)" marker-end="url(#marker)"/><clipPath id="clip"/><filter id="filter"/><marker id="marker"/></svg>',
    '<svg><use href="#shape"/><g id="shape"/></svg>',
    '<svg><linearGradient href="#other"/><radialGradient id="other"/></svg>',
    '<svg><radialGradient href="#other"/><linearGradient id="other"/></svg>',
    '<svg><pattern href="#other"/><pattern id="other"/></svg>',
    '<svg><mpath xlink:href="#p"/><path id="p"/></svg>',
    '<svg><path clip-path="url(#missing)"/></svg>',
    '<svg><a href="#text"/><title id="text">Title</title></svg>',
    '<svg aria-labelledby="label"><g id="label"/></svg>',
    '<svg><textPath href="#p" xlink:href="#g"/><path id="p"/><g id="g"/></svg>',
    '<svg><path fill="url(other.svg#p)"/><path id="p"/></svg>',
    '<svg><path mask="url(#image)"/><image id="image"/></svg>',
  ],
  invalid: [
    ...[
      '<svg><path filter="url(#wrong) blur(var(--size))"/><path id="wrong"/></svg>',
      '<svg><path clip-path="url(#wrong)/*comment*/"/><path id="wrong"/></svg>',
      '<svg><path clip-path="url(#wrong)"/><path id="wrong"/></svg>',
      '<svg><path fill="url(#wrong)"/><path id="wrong"/></svg>',
      '<svg><path stroke="url(#wrong)"/><clipPath id="wrong"/></svg>',
      '<svg><path filter="url(#wrong)"/><g id="wrong"/></svg>',
      '<svg><path marker-start="url(#wrong)"/><path id="wrong"/></svg>',
      '<svg><textPath href="#wrong"/><g id="wrong"/></svg>',
      '<svg><mpath href="#wrong"/><rect id="wrong"/></svg>',
      '<svg><linearGradient href="#wrong"/><pattern id="wrong"/></svg>',
      '<svg><pattern href="#wrong"/><linearGradient id="wrong"/></svg>',
      '<svg><filter href="#wrong"/><g id="wrong"/></svg>',
      '<svg><linearGradient id="wrong" href="#wrong"/></svg>',
      '<svg><use href="#wrong"/><foreignObject><div xmlns="http://www.w3.org/1999/xhtml" id="wrong"/></foreignObject></svg>',
      '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:path clip-path="url(#wrong)"/><s:path id="wrong"/></s:svg>',
      '<svg><path clip-path="url(#wrong)"/><m:clipPath xmlns:m="urn:metadata" id="wrong"/></svg>',
    ].map(code => ({
      code,
      errors: [{ messageId: 'invalid' }],
    })),
  ],
})
