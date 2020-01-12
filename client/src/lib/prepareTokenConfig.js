export default function(token) {
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