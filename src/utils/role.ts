import { ARIA_ROLES } from '../constants'

/** The first recognized role is effective; later tokens are fallbacks. */
export function getEffectiveRole(
  value: string,
  roles: readonly string[] = ARIA_ROLES,
): string | undefined {
  return value.split(/[\t\n\f\r ]+/).find(role => roles.includes(role))
}
