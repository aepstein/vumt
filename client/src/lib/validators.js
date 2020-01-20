// Unlike built-in min from react-hook-form, this one works with a minimum of 0
export const mustBeAtLeast = (min) => (value) => {
    if (value === null || value === '' || value === false || !Number(value)) return true
    return Number(value) >= min
}
export function mustBeWholeNumber(value) {
    if (!value || !Number(value)) return true
    return Number.isInteger(Number(value))
}
