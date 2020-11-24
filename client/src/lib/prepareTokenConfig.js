export default function prepareTokenConfig (token) {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    if (token) {
        config.headers['x-auth-token'] = token
    }
    return config
}