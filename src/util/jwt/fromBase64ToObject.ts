export default function fromBase64ToObject(str64: string) : object | undefined {
    try {
        return JSON.parse(str64);
    } catch (_) {
        console.log('Unexpected end of JSON input in Base64ToObject');
        return undefined;
    }
}