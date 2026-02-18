export function formatDateForApi(date) {
    if (!date) return null

    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
    }

    if (typeof date === 'string') {
        return date.split('T')[0]
    }

    return new Date(date).toISOString().split('T')[0]
}

export function formatDateForInput(date) {
    if (!date) return ''
    return date.split('T')[0]
}