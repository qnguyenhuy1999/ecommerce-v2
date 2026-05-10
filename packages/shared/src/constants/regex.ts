export const REGEX = {
  email: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  postalCode: /^[A-Za-z0-9\s-]{3,10}$/,
  price: /^\d+(\.\d{1,2})?$/,
  percentage: /^(100|[1-9]?\d(\.\d{1,2})?)%?$/,
} as const

export const isEmail = (value: string): boolean => REGEX.email.test(value)
export const isPhone = (value: string): boolean => REGEX.phone.test(value)
export const isSlug = (value: string): boolean => REGEX.slug.test(value)
export const isUUID = (value: string): boolean => REGEX.uuid.test(value)
export const isHexColor = (value: string): boolean => REGEX.hexColor.test(value)
export const isUrl = (value: string): boolean => REGEX.url.test(value)
