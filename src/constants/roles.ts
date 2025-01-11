/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#1._document_structure_roles
 */
export const documentStructureRoles = {
  basic: ['feed', 'math', 'none', 'note', 'presentation', 'toolbar', 'tooltip'],
  avoid: [
    'application',
    'article',
    'cell',
    'columnheader',
    'definition',
    'directory',
    'document',
    'figure',
    'group',
    'heading',
    'img',
    'list',
    'listitem',
    'meter',
    'row',
    'rowgroup',
    'rowheader',
    'separator',
    'table',
    'term',
  ],
  completeness: [
    'associationlist',
    'associationlistitemkey',
    'associationlistitemvalue',
    'blockquote',
    'caption',
    'code',
    'deletion',
    'emphasis',
    'insertion',
    'paragraph',
    'strong',
    'subscript',
    'superscript',
    'time',
  ],
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#2._widget_roles
 */
export const widgetRoles = {
  composite: ['combobox', 'menu', 'menubar', 'tablist', 'tree', 'treegrid'],
  basic: [
    'scrollbar',
    'searchbox',
    'separator',
    'slider',
    'spinbutton',
    'switch',
    'tab',
    'tabpanel',
    'treeitem',
  ],
  completeness: [
    'button',
    'checkbox',
    'gridcell',
    'link',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'progressbar',
    'radio',
    'textbox',
  ],
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#3._landmark_roles
 */
export const landmarkRoles = {
  basic: [
    'banner',
    'complementary',
    'contentinfo',
    'form',
    'main',
    'navigation',
    'region',
    'search',
  ],
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#4._live_region_roles
 */
export const liveRegionRoles = {
  basic: ['alert', 'log', 'marquee', 'status', 'timer'],
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#5._window_roles
 */
export const windowRoles = {
  basic: ['alertdialog', 'dialog'],
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#6._abstract_roles
 */
export const abstractRoles = {
  avoid: [
    'command',
    'composite',
    'input',
    'landmark',
    'range',
    'roletype',
    'section',
    'sectionhead',
    'select',
    'structure',
    'widget',
    'window',
  ],
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
 * @see https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/
 */
export const ARIA_ROLES = Array.from(
  new Set(
    [
      abstractRoles.avoid,
      documentStructureRoles.avoid,
      documentStructureRoles.basic,
      documentStructureRoles.completeness,
      landmarkRoles.basic,
      liveRegionRoles.basic,
      widgetRoles.basic,
      widgetRoles.completeness,
      widgetRoles.composite,
      windowRoles.basic,
    ].flat(),
  ),
)
