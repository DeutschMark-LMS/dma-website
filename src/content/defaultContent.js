const defaultContent = {
  navbar: {
    brandMain: 'Deutsch Mark',
    brandAccent: 'Academy',
    logoUrl: '',
    links: [
      { label: 'Our Approach', href: '#methodology' },
      { label: 'Programs', href: '#programs' },
      { label: 'Why Us', href: '#why-us' },
    ],
  },
  promoTicker: {
    enabled: true,
    leftTag: 'Limited Time',
    message: 'Ongoing Offer: Enroll now and get bonus implementation sessions this week only.',
    ctaLabel: 'Claim Offer',
    ctaHref: '#programs',
    rightTag: 'Ends Soon',
    speed: 26,
  },
  hero: {
    badgeText: 'Welcome to the future of skill acquisition',
    titleMain: 'Building Skills.',
    titleHighlight: 'Creating Wealth.',
    description:
      "In a rapidly evolving economy, those who master in-demand skills are not just surviving, they are thriving. We equip ambitious Africans with practical skills to create sustainable wealth.",
    primaryButton: { label: 'Explore Programs', href: '#programs' },
    secondaryButton: {
      enabled: false,
      label: 'Join Free Challenge',
      href: '#why-us',
    },
  },
  methodology: {
    heading: 'Our Approach: Practical Mastery',
    description:
      'While others teach theory, we focus on application. Every program we offer follows our three-pillar methodology.',
    pillars: [
      {
        title: '1. LEARN',
        desc: 'Acquire practical, market-relevant knowledge through our structured, easy-to-digest frameworks.',
        icon: 'book',
      },
      {
        title: '2. APPLY',
        desc: "Implement what you've learned immediately with real-world projects and guided assignments.",
        icon: 'target',
      },
      {
        title: '3. EARN',
        desc: 'Convert your newly acquired mastery into consistent, scalable income streams.',
        icon: 'trend',
      },
    ],
  },
  programs: {
    heading: 'Featured Programs',
    description:
      'Curriculums designed to take you from absolute beginner to profitable professional.',
    catalogButton: { label: 'View full catalog', href: '#' },
    items: [
      {
        id: 'prog-trading',
        title: 'The 5-Day Mechanical Trading Program',
        image:
          'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        badge: 'Limited Slots',
        subtitle: 'Beginner to Pro Blueprint',
        description:
          'Get the exact Mechanical Trading System that helped Andy turn 4 years of losing into $7,600+ in payouts. A beginner-friendly system that removes all guesswork.',
        features: [
          'Step-by-step consistent profit blueprint',
          'Fix the mistakes making 78% of traders quit',
          'Join 13+ students making $1,000+',
        ],
        button: { label: 'Get Started', href: '#' },
      },
      {
        id: 'prog-marketing',
        title: 'The 3X System Masterclass',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        badge: '',
        subtitle: 'Marketing & Campaigns',
        description:
          'Consistently generate at least 3X your ad spend (ROI) in just 2 hours. Learn the 4 pillars of campaigns that scale predictably every single time.',
        features: [
          '4 Pillars of 3x ROI Campaigns',
          'Emotional & Cheap Ads Framework',
          'Building a 1-of-1 Decommoditized Offer',
        ],
        button: { label: 'Get Started', href: '#' },
      },
    ],
  },
  whyUs: {
    heading: 'Why Choose Deutsch Mark?',
    description:
      'We are not just another course platform. We are an academy built for results.',
    cards: [
      {
        title: 'Practical First',
        desc: 'Every lesson focuses on real-world application.',
        icon: 'zap',
      },
      {
        title: 'Market Relevant',
        desc: "Curriculum adapts to what is actually in demand.",
        icon: 'target',
      },
      {
        title: 'Community',
        desc: 'Join a network of ambitious professionals.',
        icon: 'users',
      },
      {
        title: 'Proven Results',
        desc: 'Our students do not just learn, they earn.',
        icon: 'shield',
      },
    ],
  },
  cta: {
    heading: 'Ready to Build Your Skills & Create Wealth?',
    description:
      'Take the first step toward financial independence. Join our 3-Day Launch Your First Profitable Online Business Challenge.',
    button: { label: 'Join the 3-Day Free Challenge', href: '#' },
  },
  footer: {
    about:
      'Equipping ambitious Africans with the practical skills, cutting-edge tools, and proven strategies to create sustainable wealth in the digital age.',
    quickLinks: [
      { label: 'Home', href: '#' },
      { label: 'All Programs', href: '#programs' },
      { label: 'Student Login', href: '#' },
    ],
    legalLinks: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
    bottomLine: 'Building skills. Creating wealth.',
  },
};

export default defaultContent;
