let FetchParams = {}

const Fetch = async (url, params = {}) => {
    try {
        const defaultFlatten = JSON.flatten(FetchParams)
        const flatten = JSON.flatten(params)
        const totalParams = Object.assign(defaultFlatten, flatten)
        if (params.body instanceof FormData) {
            totalParams.body = params.body
        }

        const res = await fetch(url, JSON.unflatten(totalParams))
        const raw = await res.text()

        if (!res.ok) return {
            status: false,
            result: JSON.parseable(raw) || raw
        }
        return {
            status: true,
            result: JSON.parseable(raw) || raw
        }
    } catch (error) {
        return {
            status: false,
            result: null
        }
    }
}
