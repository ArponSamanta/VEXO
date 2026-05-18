import mongoose from 'mongoose';
import connectDB from './config/db';
import User from './models/User';
import Product from './models/Product';
import Coupon from './models/Coupon';

const products = [
  {
    name: 'VEXO Nova Pro Headphones',
    description: 'Experience unparalleled audio with the VEXO Nova Pro. Featuring adaptive noise cancellation, spatial audio, and 40-hour battery life. The titanium drivers deliver crystal-clear highs and thundering bass. Premium memory foam ear cushions ensure all-day comfort.',
    shortDescription: 'Premium wireless headphones with adaptive noise cancellation and spatial audio.',
    price: 12999,
    comparePrice: 17999,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600'],
    category: 'Headphones',
    brand: 'VEXO',
    stock: 50,
    sku: 'VXO-NP-001',
    rating: 4.8,
    numReviews: 234,
    featured: true,
    tags: ['wireless', 'noise-cancellation', 'premium', 'bluetooth'],
    specifications: { 'Driver Size': '50mm', 'Battery Life': '40 hours', 'Connectivity': 'Bluetooth 5.3', 'Weight': '280g', 'Noise Cancellation': 'Adaptive ANC' },
  },
  {
    name: 'VEXO Pulse Gaming Headset',
    description: 'Dominate your game with VEXO Pulse. Ultra-low latency wireless, surround sound, and a detachable boom mic with AI noise suppression. RGB lighting syncs with your gameplay for total immersion.',
    shortDescription: 'Gaming headset with ultra-low latency and 7.1 surround sound.',
    price: 8999,
    comparePrice: 11999,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600'],
    category: 'Gaming',
    brand: 'VEXO',
    stock: 75,
    sku: 'VXO-PG-002',
    rating: 4.6,
    numReviews: 189,
    featured: true,
    tags: ['gaming', 'wireless', 'rgb', 'surround-sound'],
    specifications: { 'Driver Size': '53mm', 'Battery Life': '30 hours', 'Connectivity': '2.4GHz + BT 5.2', 'Weight': '320g', 'Surround': '7.1 Virtual' },
  },
  {
    name: 'VEXO Aero Buds',
    description: 'Ultra-lightweight true wireless earbuds with hybrid ANC, transparency mode, and IPX5 water resistance. The ergonomic design stays secure during any workout. Wireless charging case included.',
    shortDescription: 'True wireless earbuds with ANC and IPX5 water resistance.',
    price: 5999,
    comparePrice: 7999,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600'],
    category: 'Earbuds',
    brand: 'VEXO',
    stock: 120,
    sku: 'VXO-AB-003',
    rating: 4.5,
    numReviews: 312,
    featured: true,
    tags: ['earbuds', 'wireless', 'anc', 'workout'],
    specifications: { 'Driver Size': '11mm', 'Battery Life': '8h + 24h case', 'Connectivity': 'Bluetooth 5.3', 'Weight': '5.4g per bud', 'Water Resistance': 'IPX5' },
  },
  {
    name: 'VEXO Studio Monitor',
    description: 'Professional-grade studio headphones with flat frequency response for mixing and mastering. Open-back design provides natural soundstage. Replaceable velour ear pads and coiled cable.',
    shortDescription: 'Professional open-back studio monitor headphones.',
    price: 15999,
    comparePrice: 19999,
    images: ['https://images.unsplash.com/photo-1545127398-14699f92334b?w=600', 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600'],
    category: 'Headphones',
    brand: 'VEXO',
    stock: 30,
    sku: 'VXO-SM-004',
    rating: 4.9,
    numReviews: 87,
    featured: true,
    tags: ['studio', 'professional', 'open-back', 'wired'],
    specifications: { 'Driver Size': '45mm', 'Impedance': '250 Ohm', 'Frequency Response': '5Hz - 35kHz', 'Weight': '260g', 'Cable': '3m coiled' },
  },
  {
    name: 'VEXO Bass Cannon Speaker',
    description: 'Portable Bluetooth speaker with earth-shaking bass. Dual passive radiators, 360° sound, and IP67 durability. Link up to 100 speakers for massive party mode. 20-hour playtime.',
    shortDescription: 'Portable speaker with massive bass and IP67 rating.',
    price: 6999,
    comparePrice: 9499,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600'],
    category: 'Speakers',
    brand: 'VEXO',
    stock: 90,
    sku: 'VXO-BC-005',
    rating: 4.4,
    numReviews: 156,
    featured: false,
    tags: ['speaker', 'portable', 'bluetooth', 'waterproof'],
    specifications: { 'Output': '40W', 'Battery Life': '20 hours', 'Connectivity': 'Bluetooth 5.3', 'Weight': '780g', 'Water Resistance': 'IP67' },
  },
  {
    name: 'VEXO Soundbar X1',
    description: 'Cinematic soundbar with wireless subwoofer. Dolby Atmos, DTS:X, and eARC support. Wall-mountable with adaptive room calibration for the perfect setup in any space.',
    shortDescription: 'Dolby Atmos soundbar with wireless subwoofer.',
    price: 24999,
    comparePrice: 29999,
    images: ['https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600'],
    category: 'Speakers',
    brand: 'VEXO',
    stock: 25,
    sku: 'VXO-SX-006',
    rating: 4.7,
    numReviews: 64,
    featured: true,
    tags: ['soundbar', 'dolby-atmos', 'home-theater'],
    specifications: { 'Channels': '5.1.2', 'Output': '500W', 'Connectivity': 'HDMI eARC, BT 5.0, WiFi', 'Subwoofer': 'Wireless 8-inch', 'Dolby Atmos': 'Yes' },
  },
  {
    name: 'VEXO Neckband Flex',
    description: 'Flexible neckband earphones with magnetic earbuds. Fast charging (10 min = 10 hours), vibration alerts for calls, and dual-device connectivity. Perfect for daily commute.',
    shortDescription: 'Neckband earphones with fast charging and magnetic tips.',
    price: 2499,
    comparePrice: 3499,
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600'],
    category: 'Earbuds',
    brand: 'VEXO',
    stock: 200,
    sku: 'VXO-NF-007',
    rating: 4.2,
    numReviews: 421,
    featured: false,
    tags: ['neckband', 'fast-charging', 'wireless'],
    specifications: { 'Driver Size': '10mm', 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '35g', 'Charging': 'USB-C Fast Charge' },
  },
  {
    name: 'VEXO DAC Amplifier',
    description: 'Hi-Fi USB DAC amplifier for audiophiles. ESS Sabre 9038 chip, PCM 768kHz/32-bit, DSD512 support. Drives headphones up to 600 Ohm. Aluminum CNC chassis.',
    shortDescription: 'Hi-Fi USB DAC amp with ESS Sabre chip.',
    price: 18999,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
    category: 'Accessories',
    brand: 'VEXO',
    stock: 15,
    sku: 'VXO-DA-008',
    rating: 4.9,
    numReviews: 42,
    featured: false,
    tags: ['dac', 'amplifier', 'hifi', 'audiophile'],
    specifications: { 'DAC Chip': 'ESS Sabre 9038Q2M', 'PCM': 'Up to 768kHz/32-bit', 'DSD': 'DSD512', 'Output Power': '2000mW @ 32Ω', 'Chassis': 'CNC Aluminum' },
  },
  {
    name: 'VEXO Turntable Classic',
    description: 'Belt-drive turntable with built-in phono preamp. Play your vinyl collection through any speaker system. Includes Audio-Technica cartridge. Walnut wood finish.',
    shortDescription: 'Belt-drive turntable with built-in preamp and walnut finish.',
    price: 21999,
    comparePrice: 26999,
    images: ['https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600'],
    category: 'Accessories',
    brand: 'VEXO',
    stock: 20,
    sku: 'VXO-TC-009',
    rating: 4.6,
    numReviews: 38,
    featured: true,
    tags: ['turntable', 'vinyl', 'analog', 'premium'],
    specifications: { 'Drive': 'Belt Drive', 'Speed': '33⅓ / 45 RPM', 'Preamp': 'Built-in switchable', 'Cartridge': 'AT-VM95E', 'Finish': 'Walnut Wood' },
  },
  {
    name: 'VEXO Cable Pro (3.5mm)',
    description: 'Premium braided audio cable with gold-plated connectors. OFC copper core for pristine signal transfer. Tangle-free design with right-angle plug option.',
    shortDescription: 'Premium braided 3.5mm audio cable with gold connectors.',
    price: 999,
    comparePrice: 1499,
    images: ['https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600'],
    category: 'Accessories',
    brand: 'VEXO',
    stock: 500,
    sku: 'VXO-CP-010',
    rating: 4.3,
    numReviews: 567,
    featured: false,
    tags: ['cable', 'audio', 'accessory'],
    specifications: { 'Length': '1.5m', 'Connector': '3.5mm Gold-plated', 'Core': 'OFC Copper', 'Jacket': 'Nylon Braided', 'Warranty': '2 Years' },
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    // Create users
    console.log('👤 Creating users...');
    await User.create([
      { name: 'Super Admin', email: 'superadmin@vexo.com', password: 'password123', role: 'superadmin' },
      { name: 'Admin User', email: 'admin@vexo.com', password: 'password123', role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'customer', addresses: [{ fullName: 'John Doe', phone: '9876543210', addressLine1: '123 Main Street', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India', isDefault: true }] },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'customer' },
    ]);

    // Create products
    console.log('📦 Creating products...');
    await Product.create(products);

    // Create coupons
    console.log('🎟️  Creating coupons...');
    await Coupon.create([
      { code: 'WELCOME10', type: 'percentage', value: 10, minPurchase: 1000, maxDiscount: 2000, usageLimit: 500, expiresAt: new Date('2027-12-31') },
      { code: 'FLAT500', type: 'fixed', value: 500, minPurchase: 3000, usageLimit: 200, expiresAt: new Date('2027-06-30') },
    ]);

    console.log('✅ Seed data created successfully!');
    console.log('   - 4 users (superadmin/admin/customer)');
    console.log('   - 10 products');
    console.log('   - 2 coupons');
    console.log('\n📧 Login credentials:');
    console.log('   Super Admin: superadmin@vexo.com / password123');
    console.log('   Admin: admin@vexo.com / password123');
    console.log('   Customer: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
