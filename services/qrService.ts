// Helper to convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

// Helper to convert Uint8Array to Base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Function to create a TLV (Tag-Length-Value) buffer
function toTlv(tag: number, value: string): Uint8Array {
    const tagBuffer = new Uint8Array([tag]);
    const valueBuffer = stringToUint8Array(value);
    const lengthBuffer = new Uint8Array([valueBuffer.length]);
    
    const result = new Uint8Array(tagBuffer.length + lengthBuffer.length + valueBuffer.length);
    result.set(tagBuffer, 0);
    result.set(lengthBuffer, tagBuffer.length);
    result.set(valueBuffer, tagBuffer.length + lengthBuffer.length);
    
    return result;
}

/**
 * Generates a ZATCA-compliant QR code payload in Base64.
 * This is a simplified version for e-invoicing QR codes.
 * Tag info from: https://zatca.gov.sa/ar/E-Invoicing/SystemsDevelopers/Pages/E-invoice-specifications.aspx
 */
export const generateInvoiceQrCode = (
    sellerName: string,
    vatNumber: string,
    timestamp: string, // ISO 8601 format
    invoiceTotal: string, // with VAT
    vatTotal: string
): string => {
    const tlv1 = toTlv(1, sellerName);
    const tlv2 = toTlv(2, vatNumber);
    const tlv3 = toTlv(3, timestamp);
    const tlv4 = toTlv(4, invoiceTotal);
    const tlv5 = toTlv(5, vatTotal);

    const concatenated = new Uint8Array([
        ...tlv1,
        ...tlv2,
        ...tlv3,
        ...tlv4,
        ...tlv5,
    ]);

    return uint8ArrayToBase64(concatenated);
}
