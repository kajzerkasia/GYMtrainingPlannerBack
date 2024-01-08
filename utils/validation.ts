function isValidText(value: string, minLength: number = 1): boolean {
    return value && value.trim().length >= minLength;
}

function isValidDate(value: any): boolean {
    const date = new Date(value);
    return value && !isNaN(date.getTime());
}

function isValidImageUrl(value: string): boolean {
    return value && value.startsWith('http');
}

function isValidEmail(value: string): boolean {
    return value && value.includes('@');
}
exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;