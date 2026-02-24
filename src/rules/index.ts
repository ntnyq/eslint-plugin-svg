import noBase64DataUrl from './no-base64-data-url'
import noComments from './no-comments'
import noDeprecated from './no-deprecated'
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
import noInvalidRole from './no-invalid-role'
import noScriptTags from './no-script-tags'
import requireViewbox from './require-viewbox'

// @keep-sorted
export const rules = {
  'no-base64-data-url': noBase64DataUrl,
  'no-comments': noComments,
  'no-deprecated': noDeprecated,
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
  'no-invalid-role': noInvalidRole,
  'no-script-tags': noScriptTags,
  'require-viewbox': requireViewbox,
}
