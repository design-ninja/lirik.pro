export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type Hero = {
  title?: string;
  text?: string;
  image?: Image;
  actions?: Link[];
};

export type About = {
  title?: string;
  text?: string;
};

export type Projects = {
  title?: string;
};

export type CTA = {
  title?: string;
  action?: string;
};

export type Service = {
  number: string;
  title: string;
  text: string;
};

export type Testimonial = {
  text: string;
  author: string;
};

export type Testimonials = {
  title: string;
  reviews: Testimonial[];
};

export type Footer = {
  author: string;
};

export type SiteConfig = {
  logo?: Image;
  title: string;
  author: string;
  subtitle?: string;
  description: string;
  image?: Image;
  headerNavLinks?: Link[];
  footerNavLinks?: Link[];
  socialLinks?: Link[];
  hero?: Hero;
  footer?: Footer;
  postsPerPage?: number;
  projectsPerPage?: number;
  about?: About;
  projects?: Projects;
  cta?: CTA;
  services?: Service[];
  testimonials?: Testimonials;
  intro?: { text: string };
};

const siteConfig: SiteConfig = {
  title: 'Кирилл Исаченко',
  author: 'Кирилл Исаченко',
  subtitle: 'Дизайнер и проектировщик web и мобильных интерфейсов',
  description:
    'UI/UX дизайнер с 10+ годами опыта в разработке web и мобильных сервисов. Проектирую интерфейсы, создаю дизайн‑системы, прототипы и реализую UI на React. Играю на гитаре и пою в инди-рок группе Limebridge. Разрабатываю плагины для Chrome и VSCode.',
  image: {
    src: '/og-preview.jpg',
    alt: 'Дизайнер Кирилл Исаченко'
  },
  headerNavLinks: [
    {
      text: 'Экспертиза',
      href: '/#expertize'
    },
    {
      text: 'Проекты',
      href: '/#projects'
    },
    {
      text: 'Обо мне',
      href: '/#about'
    },
    { text: 'Блог', href: '/blog' },
    {
      text: 'Контакты',
      href: '/#contacts'
    }
  ],
  socialLinks: [
    {
      text: 'Telegram',
      href: 'https://t.me/lirikpro/'
    },
    {
      text: 'WhatsApp',
      href: 'https://wa.me/79620726666/'
    },
    {
      text: 'X',
      href: 'https://x.com/lirik1986/'
    },
    {
      text: 'Behance',
      href: 'https://behance.net/design-ninja/'
    },
    {
      text: 'GitHub',
      href: 'https://github.com/design-ninja/'
    }
  ],
  services: [
    { number: '01', title: 'Проектирование интерфейсов', text: 'User flows, CJM, инфоархитектура, сценарии, UX‑копирайтинг.' },
    { number: '02', title: 'Дизайн‑системы и UI‑киты', text: 'Токены, компоненты, библиотеки в Figma и для React.' },
    { number: '03', title: 'Прототипирование', text: 'Интерактивные прототипы в Figma для валидации гипотез.' },
    { number: '04', title: 'Реализация UI', text: 'Сопровождение внедрения, React‑компоненты, дизайн‑токены.' },
    { number: '05', title: 'Дизайн‑аудит', text: 'UX‑ревью по эвристикам, рекомендации с приоритетами.' },
    { number: '06', title: 'Консалтинг и менторинг', text: 'Сессии, воркшопы, рост команды и процессов.' }
  ],
  projects: {
    title: 'Проекты'
  },
  // testimonials kept for potential future use, hidden on homepage
  footer: {
    author: 'Дизайн и разработка: lirik 🖤'
  },
  postsPerPage: 8,
  projectsPerPage: 8
};

export default siteConfig;
