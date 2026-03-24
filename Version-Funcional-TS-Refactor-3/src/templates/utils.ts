import { LocaleFormatDate } from "./types";

export function formatDate(date: Date, locale: LocaleFormatDate = 'es-CO'): string {
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}