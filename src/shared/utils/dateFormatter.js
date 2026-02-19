export function formatDateForApi(date) {
    if (!date) return null
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date
    if (typeof date === 'string') return date.split('T')[0]
    return new Date(date).toISOString().split('T')[0]
}

export function formatDateForInput(date) {
    if (!date) return ''
    return date.split('T')[0]
}

export function formatDisplayDate(isoDate, options = {}) {
    if (!isoDate) return '—'

    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return '—'

    const {
        withTime = false,
        locale = 'ru-RU'
    } = options

    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(withTime && {
            hour: '2-digit',
            minute: '2-digit'
        })
    })
}

export function formatShortDate(isoDate) {
    if (!isoDate) return '—'
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return '—'

    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    })
}

export function formatRelativeDate(isoDate) {
    if (!isoDate) return '—'

    const date = new Date(isoDate)
    const now = new Date()
    const diffMs = now - date

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 7) return formatShortDate(isoDate)
    if (days >= 1) return `${days} дн. назад`
    if (hours >= 1) return `${hours} ч. назад`
    if (minutes >= 1) return `${minutes} мин. назад`
    return 'только что'
}