export function howLong(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 30) {
    if (days === 0) {
      return 'mniej niż dzień';
    }
    if (days === 1) {
      return '1 dzień';
    }
    return `${days} dni`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    if (months === 1) {
      return '1 miesiąc';
    }
    return `${months} miesięcy`;
  }
  const years = Math.floor(months / 12);
  if (years === 1) {
    return '1 rok';
  }
  if (years < 5) {
    return `${years} lata`;
  }
  return `${years} lat`;
}
