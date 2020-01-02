export function safelyParseInt(parseableNumber) {
  if (parseableNumber === null || parseableNumber === undefined) {
    return 0;
  }
  const parsedNumber = parseInt(parseableNumber, 10);
  if (isNaN(parsedNumber)) {
    return 0;
  }

  return parsedNumber;
}
