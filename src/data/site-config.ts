import { type Locale } from '../utils/i18n';

export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type Footer = {
  author: string;
};

type PageMeta = {
  title: string;
  description: string;
  image?: Image;
};

export type PetProject = {
  title: string;
  description: string;
  links: Link[];
};

export type BlogLocaleContent = {
  sectionTitle: string;
  sectionAriaLabel: string;
  moreLinkLabel: string;
  listing: PageMeta;
  relatedHeading: string;
  tagsIndex: PageMeta;
  taggedPosts: {
    titleTemplate: string;
    descriptionTemplate: string;
  };
};

export type ProjectsLocaleContent = {
  listing: PageMeta;
  relatedHeading: string;
};

export type SiteLocaleConfig = {
  title: string;
  author: string;
  subtitle?: string;
  description: string;
  image?: Image;
  footer: Footer;
  ui: {
    introAriaLabel: string;
    paginationNavLabel: string;
  };
  portfolio: {
    title: string;
    ariaLabel: string;
  };
  blog: BlogLocaleContent;
  projects: ProjectsLocaleContent;
  petProjects: {
    title: string;
    ariaLabel: string;
    items: PetProject[];
  };
};

export type SiteConfig = {
  defaultLocale: Locale;
  postsPerPage: number;
  projectsPerPage: number;
  socialLinks?: Link[];
  locales: Record<Locale, SiteLocaleConfig>;
};

const siteConfig: SiteConfig = {
  defaultLocale: 'ru',
  postsPerPage: 8,
  projectsPerPage: 6,
  locales: {
    ru: {
      title: 'Кирилл Исаченко',
      author: 'Кирилл Исаченко',
      subtitle: 'Дизайнер и проектировщик web и мобильных интерфейсов',
      description:
        'UI/UX дизайнер с 10+ годами опыта в разработке web и мобильных сервисов. Проектирую интерфейсы, создаю дизайн‑системы, прототипы и реализую UI на React. Играю на гитаре и пою в инди-рок группе Limebridge. Разрабатываю плагины для Chrome и VSCode.',
      image: {
        src: '/og-preview.jpg',
        alt: 'Дизайнер Кирилл Исаченко'
      },
      footer: {
        author: 'Дизайн и разработка: lirik 🖤'
      },
      ui: {
        introAriaLabel: 'Обо мне',
        paginationNavLabel: 'Навигация по страницам'
      },
      portfolio: {
        title: 'Портфолио',
        ariaLabel: 'Портфолио'
      },
      blog: {
        sectionTitle: 'Блог',
        sectionAriaLabel: 'Последние записи',
        moreLinkLabel: 'Ещё в блоге...',
        listing: {
          title: 'Блог Кирилла Исаченко',
          description: 'Посты о дизайне и разработке от Кирилла Исаченко'
        },
        relatedHeading: 'Ещё в блоге',
        tagsIndex: {
          title: 'Все теги',
          description: 'Каталог тегов для навигации по блогу.'
        },
        taggedPosts: {
          titleTemplate: 'Посты с тегом «{tag}»',
          descriptionTemplate: 'Посты в блоге дизайнера Кирилла Исаченко с тегом «{tag}»'
        }
      },
      projects: {
        listing: {
          title: 'Портфолио',
          description: 'Портфолио дизайнера Кирилла Исаченко'
        },
        relatedHeading: 'Другие проекты'
      },
      petProjects: {
        title: 'Pet-проекты',
        ariaLabel: 'Pet-проекты',
        items: [
          {
            title: 'Empty Folders Remover',
            description: 'Простое расширение для Visual Studio Code, которое ищет и удаляет пустые папки в проекте',
            links: [
              {
                text: 'VS Marketplace',
                href: 'https://marketplace.visualstudio.com/items?itemName=lirik.empty-folders-remover'
              },
              {
                text: 'GitHub',
                href: 'https://github.com/design-ninja/empty-folders-remover'
              }
            ]
          },
          {
            title: '#hexPicker',
            description: 'Инструмент для выбора цвета по #hex коду с историей сохранённых цветов',
            links: [
              {
                text: 'Chrome Web Store',
                href: 'https://chromewebstore.google.com/detail/hexpicker-%E2%80%94-a-simple-hex/nbfoiiglmnkmdhhaenkekmodabpcfnhc?hl=en'
              },
              {
                text: 'GitHub',
                href: 'https://github.com/design-ninja/hex-picker'
              }
            ]
          },
          {
            title: 'OiNK — Raise a Cute Pig',
            description: 'Забавная игра для детей в стиле «тамагочи»',
            links: [
              {
                text: 'App Store',
                href: 'https://apps.apple.com/ru/app/oink-raise-a-cute-pig/id6739273380?l=en-GB'
              }
            ]
          },
          {
            title: 'Thai TM30 Helper',
            description: 'Расширение для Chrome для автозаполнения иммиграционных форм TM30 в Таиланде',
            links: [
              {
                text: 'Chrome Web Store',
                href: 'https://chromewebstore.google.com/detail/thai-tm30-helper/dodmpjhindfijnojfiikocaklabohlac'
              },
              {
                text: 'GitHub',
                href: 'https://github.com/design-ninja/thai-tm30-helper'
              }
            ]
          }
        ]
      }
    },
    en: {
      title: 'Kirill Isachenko',
      author: 'Kirill Isachenko',
      subtitle: 'Product and UI/UX designer for web and mobile interfaces',
      description:
        'UI/UX designer with 10+ years of experience building web and mobile services. I design interfaces, build design systems, prototypes, and implement UI in React. I play guitar and sing in the indie-rock band Limebridge. I also build plugins for Chrome and VSCode.',
      image: {
        src: '/og-preview.jpg',
        alt: 'Designer Kirill Isachenko'
      },
      footer: {
        author: 'Design and development: lirik 🖤'
      },
      ui: {
        introAriaLabel: 'About me',
        paginationNavLabel: 'Pagination'
      },
      portfolio: {
        title: 'Portfolio',
        ariaLabel: 'Portfolio'
      },
      blog: {
        sectionTitle: 'Blog',
        sectionAriaLabel: 'Latest posts',
        moreLinkLabel: 'More on the blog...',
        listing: {
          title: "Kirill Isachenko's blog",
          description: 'Articles about design and development by Kirill Isachenko'
        },
        relatedHeading: 'More from the blog',
        tagsIndex: {
          title: 'All tags',
          description: 'Browse the tag catalog for easier navigation.'
        },
        taggedPosts: {
          titleTemplate: 'Posts tagged "{tag}"',
          descriptionTemplate: 'Blog posts by Kirill Isachenko tagged "{tag}"'
        }
      },
      projects: {
        listing: {
          title: 'Portfolio',
          description: 'Portfolio of designer Kirill Isachenko'
        },
        relatedHeading: 'Other projects'
      },
      petProjects: {
        title: 'Side projects',
        ariaLabel: 'Side projects',
        items: [
          {
            title: 'Empty Folders Remover',
            description: 'A simple Visual Studio Code extension that finds and deletes empty folders in your project.',
            links: [
              {
                text: 'VS Marketplace',
                href: 'https://marketplace.visualstudio.com/items?itemName=lirik.empty-folders-remover'
              },
              {
                text: 'GitHub',
                href: 'https://github.com/design-ninja/empty-folders-remover'
              }
            ]
          },
          {
            title: '#hexPicker',
            description: 'A colour picker for working with #hex values and a history of saved colours.',
            links: [
              {
                text: 'Chrome Web Store',
                href: 'https://chromewebstore.google.com/detail/hexpicker-%E2%80%94-a-simple-hex/nbfoiiglmnkmdhhaenkekmodabpcfnhc?hl=en'
              },
              {
                text: 'GitHub',
                href: 'https://github.com/design-ninja/hex-picker'
              }
            ]
          },
          {
            title: 'OiNK — Raise a Cute Pig',
            description: 'A playful tamagotchi-like game for kids.',
            links: [
              {
                text: 'App Store',
                href: 'https://apps.apple.com/ru/app/oink-raise-a-cute-pig/id6739273380?l=en-GB'
              }
            ]
          },
          {
            title: 'Thai TM30 Helper',
            description: 'Chrome extension for auto-filling TM30 immigration forms in Thailand.',
            links: [
              {
                text: 'Chrome Web Store',
                href: 'https://chromewebstore.google.com/detail/thai-tm30-helper/dodmpjhindfijnojfiikocaklabohlac'
              },
              {
                text: 'GitHub',
                href: 'https://github.com/design-ninja/thai-tm30-helper'
              }
            ]
          }
        ]
      }
    }
  }
};

export function getSiteLocaleConfig(locale: Locale): SiteLocaleConfig {
  return siteConfig.locales[locale];
}

export default siteConfig;
