export const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

// Accepts 0803 123 4567, 08031234567 and +234 803 123 4567.
export const validPhone = (value) => /^(\+234|234|0)[789][01]\d{8}$/.test(String(value).replace(/[\s-]/g, ''))
