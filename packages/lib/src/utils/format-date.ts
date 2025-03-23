export function formatDateForInput(d?: Date | string): string {
  const date = d ? new Date(d) : new Date();
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(value: string): Date | undefined {
  const d = Date.parse(value);
  if (!d) return undefined;
  return new Date(d);
}
