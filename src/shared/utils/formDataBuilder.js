export function buildFormData(data) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value == null) return
        if (value instanceof File) {
            formData.append(key, value)
        } else {
            formData.append(key, String(value))
        }
    })
    return formData
}