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
};

const siteConfig: SiteConfig = {
  title: 'lirik.pro - Дизайнер Кирилл Исаченко',
  author: 'Кирилл Исаченко',
  subtitle: 'Разработка интернет-магазинов под ключ',
  description:
    'Разработка сайтов, дизайн сайтов, интернет-магазинов, разработка лендингов, SEO-оптимизация, интеграция с 1С, настройка онлайн-платежей, настройка доставки',
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
    {
      text: 'Отзывы',
      href: '/#testimonials'
    },
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
  hero: {
    title: 'Я всё сделаю сам.',
    text: '<p>Создаю стильные, продающие интернет-магазины.</p><p>Беру всё на себя — никаких лишних вопросов и постоянных согласований.</p><p>Вы получаете готовый, современный сайт с классным дизайном в разумные сроки.</p>',
    actions: [
      {
        text: 'Написать мне',
        href: 'https://wa.me/79620726666/'
      }
    ]
  },
  about: {
    title: 'Обо мне',
    text: '<p>Привет! Меня зовут Кирилл. Я занимаюсь созданием сайтов уже 20 лет. IT-технологии всегда были моей страстью, а дизайн, кофе и музыка — моими увлечениями.</p><p>За это время я сотрудничал с известными сибирскими диджитал-агентствами и зарубежными компаниями.</p><p>Я понимаю важность цифрового присутствия, поэтому помогаю бизнесу обрести уникальное лицо в онлайн-мире.</p>'
  },
  services: [
    {
      number: '01',
      title: 'Дизайн',
      text: 'Создам интуитивно понятный и современный сайт, который отражает ваш бренд.'
    },
    {
      number: '02',
      title: 'Интеграция с 1С',
      text: 'Если у вас уже есть база товаров и заказов в 1С, я настрою её синхронизацию с магазином.'
    },
    {
      number: '03',
      title: 'Доставка',
      text: 'Подключу и настрою модуль доставки, который будет автоматически считать стоимость и срок.'
    },
    {
      number: '04',
      title: 'Онлайн-платежи',
      text: 'Подключу и настрою возможность оплачивать покупки в магазине, делать рассрочку и возврат средств.'
    },
    {
      number: '05',
      title: 'Контент',
      text: 'Обеспечу полное наполнение для вашего сайта: от текстов до графики и подготовлю качественный SEO контент.'
    },
    {
      number: '06',
      title: 'Брендинг',
      text: 'Если у вас нет лого или фирменного стиля — создам ваш бренд с нуля.'
    }
  ],
  projects: {
    title: 'Избранные проекты'
  },
  testimonials: {
    title: 'Отзывы клиентов',
    reviews: [
      {
        text: '«Хочу поделиться своим опытом сотрудничества с Кириллом. Он очень ответственный и оперативный специалист. Все работы выполняются в кратчайшие сроки, и при этом качество остается на высоте. Он действительно создает проекты под ключ, избавляя от лишних забот и хлопот. Очень рекомендую Кирилла всем, кто ищет надежного и талантливого специалиста!»',
        author: 'Антонина Мнёва, «Mneva Beauty»'
      },
      {
        text: '«На одном из проектов стояла задача разработки нового сайта для интернет-магазина. Выбрали для сотрудничества Кирилла. Работы в его портфолио цепляют и вызывают эмоции, а это как раз то, что нужно было для магазина нижнего белья. Как всегда было много хотелок со стороны клиента и хотелки не всегда оформлялись понятно и корректно, но разработка прошла достаточно гладко, что показывает опыт и профессионализм Кирилла. Дизайн получился шикарный, в нем были учтены все необходимые моменты для разработчиков. Все коммуникации были только по делу. Спасибо Кириллу за работу и дизайн!»',
        author: 'Полина Горчакова, «Lingerie Line»'
      }
    ]
  },
  footer: {
    author: 'Дизайн и разработка: lirik 🖤'
  },
  postsPerPage: 8,
  projectsPerPage: 8,
  cta: {
    title: 'Давайте обсудим вашу идею или проект',
    action: 'Написать мне'
  }
};

export default siteConfig;
