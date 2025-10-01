export function randomAlphabetic(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from(
    { length },
    (): string => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('')
}
