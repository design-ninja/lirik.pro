export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export function getOgLocale(locale: Locale): string {
  return locale === 'ru' ? 'ru_RU' : 'en_US';
}

export function formatPaginationLabel(locale: Locale, current: number, total: number) {
  return locale === 'ru' ? `Страница ${current} из ${total}` : `Page ${current} of ${total}`;
}

export function formatPaginationAria(locale: Locale, target: number, total: number) {
  return locale === 'ru' ? `Перейти к странице ${target} из ${total}` : `Go to page ${target} of ${total}`;
}

export function formatUpdatedLabel(locale: Locale) {
  return locale === 'ru' ? 'Обновлено:' : 'Updated on';
}

export function formatPostsCounter(locale: Locale, count: number) {
  if (locale === 'ru') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return 'пост';
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return 'поста';
    }
    return 'постов';
  }
  return count === 1 ? 'post' : 'posts';
}

export function formatTagArchiveCta(locale: Locale) {
  return locale === 'ru' ? 'Открыть архив тега →' : 'View tag archive →';
}

export function formatListWithConjunction(locale: Locale, values: string[]) {
  if (values.length === 0) {
    return '';
  }
  if (values.length === 1) {
    return values[0];
  }
  const items = values.slice(0, -1);
  const lastItem = values[values.length - 1];
  const conjunction = locale === 'ru' ? ' и ' : ' and ';
  return `${items.join(', ')}${conjunction}${lastItem}`;
}
