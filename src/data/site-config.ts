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
  postsPerPage: 8,
  footer: {
    author: 'Дизайн и разработка: lirik 🖤'
  }
};

export default siteConfig;
