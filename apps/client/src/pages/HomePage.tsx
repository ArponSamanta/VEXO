import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HiArrowRight, HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineTruck } from 'react-icons/hi';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const categories = [
  { name: 'Headphones', icon: '🎧', gradient: 'from-blue-500/20 to-purple-500/20' },
  { name: 'Earbuds', icon: '🎵', gradient: 'from-green-500/20 to-teal-500/20' },
  { name: 'Speakers', icon: '🔊', gradient: 'from-orange-500/20 to-red-500/20' },
  { name: 'Accessories', icon: '⚡', gradient: 'from-purple-500/20 to-pink-500/20' },
  { name: 'Gaming', icon: '🎮', gradient: 'from-cyan-500/20 to-blue-500/20' },
];

const features = [
  { icon: HiOutlineSparkles, title: 'Premium Quality', desc: 'Engineered with the finest materials' },
  { icon: HiOutlineLightningBolt, title: 'Fast Charging', desc: 'Power up in minutes, not hours' },
  { icon: HiOutlineShieldCheck, title: '2-Year Warranty', desc: 'Complete peace of mind' },
  { icon: HiOutlineTruck, title: 'Free Shipping', desc: 'On orders above ₹500' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { data: featuredData } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/featured').then((r) => r.data.data),
  });

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-vexo-blue/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-vexo-purple/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vexo-blue/5 rounded-full blur-[150px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="page-container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left content */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm text-vexo-blue mb-6">
              <HiOutlineSparkles size={16} />
              <span>Next-Gen Audio Technology</span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
              Redefine Your{' '}
              <span className="gradient-text">Sound</span>{' '}
              Experience
            </h1>

            <p className="text-vexo-text-secondary text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Immerse yourself in crystal-clear audio with VEXO's cutting-edge gear. 
              Engineered for audiophiles, designed for everyone.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-4 flex items-center gap-2" id="hero-cta">
                Explore Products <HiArrowRight />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary text-base px-8 py-4">
                Featured Picks
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: '50K+', label: 'Happy Customers' },
                { value: '4.8', label: 'Average Rating' },
                { value: '200+', label: 'Products' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-vexo-text-muted text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-vexo opacity-20 blur-3xl scale-110 animate-glow-pulse" />
              <motion.img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
                alt="VEXO Premium Headphones"
                className="relative z-10 w-80 h-80 md:w-[450px] md:h-[450px] object-cover rounded-3xl shadow-2xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-8 top-1/4 glass-card px-4 py-3 z-20"
              >
                <p className="text-xs text-vexo-text-muted">Best Seller</p>
                <p className="font-heading font-bold text-vexo-green">Nova Pro</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -right-4 bottom-1/4 glass-card px-4 py-3 z-20"
              >
                <p className="text-xs text-vexo-text-muted">Starting at</p>
                <p className="font-heading font-bold text-vexo-blue">₹2,499</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20">
        <div className="page-container">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-12">
            <motion.h2 variants={item} className="section-heading">Shop by Category</motion.h2>
            <motion.p variants={item} className="section-subheading">Find the perfect gear for your lifestyle</motion.p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={item}>
                <Link
                  to={`/products?category=${cat.name}`}
                  className={`glass-card-hover flex flex-col items-center gap-3 p-6 text-center bg-gradient-to-br ${cat.gradient}`}
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="font-heading font-semibold">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 bg-vexo-bg-secondary/50">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-heading">Featured Products</h2>
              <p className="section-subheading">Handpicked for you</p>
            </div>
            <Link to="/products" className="btn-ghost flex items-center gap-1 text-vexo-blue">
              View All <HiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(featuredData || []).slice(0, 8).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20">
        <div className="page-container">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <motion.div key={feat.title} variants={item} className="glass-card-hover p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-vexo/10 flex items-center justify-center mx-auto mb-4">
                  <feat.icon size={28} className="text-vexo-blue" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-vexo-text-secondary">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20">
        <div className="page-container">
          <div className="relative glass-card overflow-hidden p-12 md:p-16 text-center">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-vexo-purple/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-vexo-blue/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                Ready to <span className="gradient-text">Elevate</span> Your Sound?
              </h2>
              <p className="text-vexo-text-secondary text-lg max-w-2xl mx-auto mb-8">
                Join 50,000+ audiophiles who trust VEXO for their daily listening experience.
              </p>
              <Link to="/products" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                Shop Now <HiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
