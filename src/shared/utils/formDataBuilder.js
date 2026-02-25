export function buildFormData(data) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value == null) return

        if (Array.isArray(value)) {
            if (value.length === 0) {
                formData.append(key, '[]')
            } else {
                value.forEach((item, index) => {
                    const val = item?.id ?? item
                    const numVal = Number(val)
                    formData.append(`${key}[${index}]`, Number.isNaN(numVal) ? val : numVal)
                })
            }
        }
        else if (value instanceof File) {
            formData.append(key, value)
        }
        else {
            formData.append(key, String(value))
        }
    })

    return formData
}