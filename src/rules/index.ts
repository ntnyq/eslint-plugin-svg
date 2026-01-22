import noDeprecated from './no-deprecated'
import noDoctype from './no-doctype'
import noElements from './no-elements'
import noEmptyContainer from './no-empty-container'
import noEmptyDesc from './no-empty-desc'
import noEmptyGroups from './no-empty-groups'
import noEmptyText from './no-empty-text'
import noEmptyTitle from './no-empty-title'
import noInlineStyles from './no-inline-styles'
import noInvalidRole from './no-invalid-role'
import noScriptTags from './no-script-tags'

// @keep-sorted
export const rules = {
  'no-deprecated': noDeprecated,
  'no-doctype': noDoctype,
  'no-elements': noElements,
  'no-empty-container': noEmptyContainer,
  'no-empty-desc': noEmptyDesc,
  'no-empty-groups': noEmptyGroups,
  'no-empty-text': noEmptyText,
  'no-empty-title': noEmptyTitle,
  'no-inline-styles': noInlineStyles,
  'no-invalid-role': noInvalidRole,
  'no-script-tags': noScriptTags,
}
