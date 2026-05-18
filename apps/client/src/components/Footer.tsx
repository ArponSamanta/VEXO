import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { FaXTwitter, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa6';

const footerLinks = {
  Shop: [
    { label: 'All Products', path: '/products' },
    { label: 'Headphones', path: '/products?category=Headphones' },
    { label: 'Earbuds', path: '/products?category=Earbuds' },
    { label: 'Speakers', path: '/products?category=Speakers' },
    { label: 'Accessories', path: '/products?category=Accessories' },
  ],
  Company: [
    { label: 'About Us', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Press', path: '#' },
    { label: 'Blog', path: '#' },
  ],
  Support: [
    { label: 'Help Center', path: '#' },
    { label: 'Shipping', path: '#' },
    { label: 'Returns', path: '#' },
    { label: 'Warranty', path: '#' },
  ],
};

const socialIcons = [
  { Icon: FaXTwitter, href: '#' },
  { Icon: FaInstagram, href: '#' },
  { Icon: FaYoutube, href: '#' },
  { Icon: FaDiscord, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-vexo-bg-secondary border-t border-vexo-border mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-vexo flex items-center justify-center">
                <span className="font-heading font-black text-sm">V</span>
              </div>
              <span className="font-heading font-bold text-xl tracking-wider">VEXO</span>
            </Link>
            <p className="text-vexo-text-secondary text-sm leading-relaxed max-w-sm mb-6">
              Next-generation audio gear engineered for those who demand excellence. Experience sound like never before.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-vexo-text-muted" size={18} />
                <input type="email" placeholder="Enter your email" className="input-field pl-10 py-2.5 text-sm" />
              </div>
              <button className="btn-primary py-2.5 px-4 text-sm">Subscribe</button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-vexo-text-secondary hover:text-vexo-blue transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-vexo-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-vexo-text-muted">© 2026 VEXO. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialIcons.map(({ Icon, href }, i) => (
              <a key={i} href={href} className="text-vexo-text-muted hover:text-vexo-blue transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
