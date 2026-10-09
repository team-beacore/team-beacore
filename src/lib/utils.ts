export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function whatsappUrl(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** "5524998546942" → "+55 (24) 99854-6942". Outros formatos voltam como vieram. */
export function formatPhoneBR(number: string): string {
  const digits = number.replace(/\D/g, "");
  const match = digits.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  return match ? `+55 (${match[1]}) ${match[2]}-${match[3]}` : number;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}