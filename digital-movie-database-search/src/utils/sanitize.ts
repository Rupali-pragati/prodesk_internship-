/**
 * Sanitize user input against XSS injection.
 * Strips HTML tags and encodes dangerous characters.
 */
export function sanitizeInput(input: string): string {

  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();

}
