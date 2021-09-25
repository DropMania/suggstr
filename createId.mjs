export default function createId(length) {
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    let output = ''
    for (let i = 0; i < length; i++) {
        output += chars[Math.floor(Math.random() * chars.length)]
    }
    return output
}
