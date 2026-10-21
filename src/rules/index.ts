import noBase64DataUrl from './no-base64-data-url'
import noComments from './no-comments'
import noDeprecated from './no-deprecated'
import noDiscouragedRole from './no-discouraged-role'
import noDoctype from './no-doctype'
import noDuplicateIds from './no-duplicate-ids'
import noElements from './no-elements'
import noEmptyContainer from './no-empty-container'
import noEmptyDesc from './no-empty-desc'
import noEmptyGroups from './no-empty-groups'
import noEmptyText from './no-empty-text'
import noEmptyTitle from './no-empty-title'
import noEventHandlers from './no-event-handlers'
import noInlineStyles from './no-inline-styles'
import noInvalidReferenceTargets from './no-invalid-reference-targets'
import noInvalidRole from './no-invalid-role'
import noScriptTags from './no-script-tags'
import noUnknownAttributes from './no-unknown-attributes'
import noUnknownElements from './no-unknown-elements'
import noUnresolvedReferences from './no-unresolved-references'
import noUnsafeHref from './no-unsafe-href'
import preferCurrentColor from './prefer-current-color'
import requireAccessibleName from './require-accessible-name'
import requireViewbox from './require-viewbox'

// @keep-sorted
export const rules = {
  'no-base64-data-url': noBase64DataUrl,
  'no-comments': noComments,
  'no-deprecated': noDeprecated,
  'no-discouraged-role': noDiscouragedRole,
  'no-doctype': noDoctype,
  'no-duplicate-ids': noDuplicateIds,
  'no-elements': noElements,
  'no-empty-container': noEmptyContainer,
  'no-empty-desc': noEmptyDesc,
  'no-empty-groups': noEmptyGroups,
  'no-empty-text': noEmptyText,
  'no-empty-title': noEmptyTitle,
  'no-event-handlers': noEventHandlers,
  'no-inline-styles': noInlineStyles,
  'no-invalid-reference-targets': noInvalidReferenceTargets,
  'no-invalid-role': noInvalidRole,
  'no-script-tags': noScriptTags,
  'no-unknown-attributes': noUnknownAttributes,
  'no-unknown-elements': noUnknownElements,
  'no-unresolved-references': noUnresolvedReferences,
  'no-unsafe-href': noUnsafeHref,
  'prefer-current-color': preferCurrentColor,
  'require-accessible-name': requireAccessibleName,
  'require-viewbox': requireViewbox,
}
