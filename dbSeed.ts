import { User, Product, Category, Review, Order, Payment, NewsletterSubscriber, ContactMessage, Coupon } from "./dbModels";
import bcrypt from "bcryptjs";

export async function seedDatabase(force = false) {
  try {
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();

    // Trigger seeding if force=true, or if either collection is empty
    const needsCategorySeed = categoryCount === 0;
    const needsProductSeed = productCount === 0;

    if (force || needsCategorySeed || needsProductSeed) {
      console.log(`🧹 [DB Seeding] Re-initializing catalog collections... Force: ${force}, Category Count: ${categoryCount}, Product Count: ${productCount}`);
      
      // Keep other collections safe unless force is explicitly true
      if (force) {
        await User.deleteMany({});
        await Review.deleteMany({});
        await Order.deleteMany({});
        await Payment.deleteMany({});
        await NewsletterSubscriber.deleteMany({});
        await ContactMessage.deleteMany({});
        await Coupon.deleteMany({});
      }

      // Always reset category and product when we seed to guarantee precise catalog state
      await Category.deleteMany({});
      await Product.deleteMany({});
    }

    console.log("🌸 [DB Seeding] Starting validation check of sovereign collections...");

    // 1. Seed Categories (Exactly 6)
    const currentCategoryCount = await Category.countDocuments();
    let seededCategories = [];
    if (currentCategoryCount === 0) {
      console.log("➡️ [DB Seeding] Populating categories...");
      const categories = [
        { id: 'fashion', name: 'Fashion', iconName: 'Shirt', description: 'Sovereign design wear, elite couture and fine tailored garments.' },
        { id: 'electronic', name: 'Electronic', iconName: 'Cpu', description: 'Elite smart instruments, high-performance computing, and acoustic gears.' },
        { id: 'kitchen', name: 'Kitchen', iconName: 'Utensils', description: 'Refined culinary tools, artisanal dinner sets and gourmet appliances.' },
        { id: 'home-decor', name: 'Home Decor', iconName: 'Home', description: 'Ambient space accessories, artisan candles, and sculpted space organizers.' },
        { id: 'sports', name: 'Sports', iconName: 'Trophy', description: 'Majestic performance gears, eco-friendly mats and weighted training kits.' },
        { id: 'beauty', name: 'Beauty', iconName: 'Sparkles', description: 'Premium self-care therapies, organic oils, and hydrating mists.' }
      ];
      seededCategories = await Category.insertMany(categories as any);
      console.log(`💚 Created ${seededCategories.length} core categories.`);
    } else {
      seededCategories = await Category.find({});
    }

    // 2. Seed Users (Exactly 10)
    const userCount = await User.countDocuments();
    let seededUsers: any[] = [];
    if (userCount === 0) {
      console.log("➡️ [DB Seeding] Creating 10 hashed users...");
      const commonPassword = await bcrypt.hash("customer123", 10);
      const adminPassword = await bcrypt.hash("myshop123", 10);

      const usersToSeed = [
        { firstName: "Admin", lastName: "Sovereign", fullName: "Admin Sovereign", email: "bhargavbor597@gmail.com", password: adminPassword, role: "Admin", isVerified: true, signupDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Lydia", lastName: "Croft", fullName: "Lydia Croft", email: "lydia@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Marcus", lastName: "Aurelius", fullName: "Marcus Aurelius", email: "marcus@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "John", lastName: "Doe", fullName: "John Doe", email: "john@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Jane", lastName: "Smith", fullName: "Jane Smith", email: "jane@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Alice", lastName: "Wonder", fullName: "Alice Wonder", email: "alice@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Diana", lastName: "Prince", fullName: "Diana Prince", email: "diana@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Bruce", lastName: "Wayne", fullName: "Bruce Wayne", email: "bruce@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Clark", lastName: "Kent", fullName: "Clark Kent", email: "clark@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), cart: [] },
        { firstName: "Tony", lastName: "Stark", fullName: "Tony Stark", email: "tony@gmail.com", password: commonPassword, role: "Customer", isVerified: true, signupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), cart: [] }
      ];

      seededUsers = await User.insertMany(usersToSeed as any);
      console.log(`💚 Hashed and registered ${seededUsers.length} secure users.`);
    } else {
      seededUsers = await User.find({});
    }

    // Explicitly guarantee default admin user exists and is assigned the Admin role
    const exactAdminEmail = "bhargavbor597@gmail.com";
    const existingAdmin = await User.findOne({ email: exactAdminEmail });
    if (!existingAdmin) {
      console.log(`➡️ [DB Seeding] Explicitly seeding missing default admin: ${exactAdminEmail}`);
      const adminPassword = await bcrypt.hash("myshop123", 10);
      await User.create({
        firstName: "Admin",
        lastName: "Sovereign",
        fullName: "Admin Sovereign",
        email: exactAdminEmail,
        password: adminPassword,
        role: "Admin",
        isVerified: true,
        signupDate: new Date(),
        createdAt: new Date(),
        cart: []
      });
    } else {
      if (existingAdmin.role !== "Admin") {
        console.log(`➡️ [DB Seeding] Promoting user: ${exactAdminEmail} to Admin role.`);
        await User.findOneAndUpdate({ email: exactAdminEmail }, { role: "Admin" });
      }
      // Ensure the admin's password matches myshop123
      const isMatch = await bcrypt.compare("myshop123", existingAdmin.password || "");
      if (!isMatch) {
        console.log(`➡️ [DB Seeding] Updating admin password hash to match myshop123`);
        const updatedPass = await bcrypt.hash("myshop123", 10);
        await User.findOneAndUpdate({ email: exactAdminEmail }, { password: updatedPass });
      }
    }

    // Secondary default admin: admin@example.com
    const secondaryAdminEmail = "admin@example.com";
    const existingSecondaryAdmin = await User.findOne({ email: secondaryAdminEmail });
    if (!existingSecondaryAdmin) {
      console.log(`➡️ [DB Seeding] Seeding standard admin account: ${secondaryAdminEmail}`);
      const adminPassword = await bcrypt.hash("Admin123!", 10);
      await User.create({
        firstName: "System",
        lastName: "Admin",
        fullName: "System Admin",
        email: secondaryAdminEmail,
        password: adminPassword,
        role: "Admin",
        isVerified: true,
        signupDate: new Date(),
        createdAt: new Date(),
        cart: []
      });
    }

    // 3. Seed Products (Exactly 45 distributed across categories)
    const currentProductCount = await Product.countDocuments();
    let seededProducts: any[] = [];
    if (currentProductCount === 0) {
      console.log("➡️ [DB Seeding] Injecting 45 high-fidelity catalog products...");
      const products = [
        // ====== FASHION (8 items) ======
        {
          id: 'classic-trench-coat',
          name: 'Sovereign Wool Trench Coat',
          description: 'An exceptional custom-cut double breasted trench coat woven from organic premium sheep wool. Designed for warmth, breathability, and luxurious drape.',
          price: 185.00,
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.8,
          reviewsCount: 3,
          gallery: [],
          details: ['100% organic sheep wool', 'Double-breasted tailoring layout', 'Inner silk quilted sleeve lining', 'Hand-picked leather belt loops'],
          specs: { 'Material': '100% Wool', 'Color': 'Camel Beige', 'Origin': 'Italian looms', 'Dry Clean': 'Highly Recommended' },
          stock: 25,
          isSpotlight: true,
          sku: 'RGL-FASH-001',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'linen-summer-shirt',
          name: 'Elite Tailored Linen Summer Shirt',
          description: 'A masterpiece of breathable comfort, handcrafted from premium Italian flax linen. Ideal for relaxed afternoons or sunset occasions.',
          price: 65.00,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.5,
          reviewsCount: 1,
          gallery: [],
          details: ['Pure lightweight linen weave', 'Pre-washed for sublime softness', 'Genuine mother-of-pearl buttons', 'Tailored casual fit architecture'],
          specs: { 'Fabric': '100% Flax Linen', 'Fit': 'Slim Casual', 'Buttons': 'Polished Shell', 'Made In': 'Florence' },
          stock: 40,
          isSpotlight: false,
          sku: 'RGL-FASH-002',
          status: 'Active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'embellished-silk-scarf',
          name: 'Emerald Blossom Mulberry Silk Scarf',
          description: 'Sumptuous and elegant, this floral scarf is printed with custom water-ink designs onto pure Mulberry silk. Features meticulously hand-rolled seams.',
          price: 38.00,
          image: 'https://images.unsplash.com/photo-1524383531116-c723165f9cd6?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.9,
          reviewsCount: 2,
          gallery: [],
          details: ['Pure 14mm mulberry silk', 'Hand-rolled & hand-stitched borders', 'Vibrant hypoallergenic dyes', 'Presented in flat secure premium envelope'],
          specs: { 'Sizing': '90 x 90 cm', 'Weight': '40g', 'Loom': 'Aero Silk Looms', 'Pattern': 'Crimson & Emerald' },
          stock: 30,
          isSpotlight: false,
          sku: 'RGL-FASH-003',
          status: 'Active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'leather-bomber-jacket',
          name: 'Vintage Leather Bomber Jacket',
          description: 'Crafted from soft, supple, top-grain calfskin leather that develops a breathtaking distressed patina over time. Includes ribbed cotton hems.',
          price: 295.00,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.9,
          reviewsCount: 4,
          gallery: [],
          details: ['Top-grain selected calf leather', 'Heavy-duty Japanese YKK brass zippers', 'Dual side slip pockets + interior stash', 'Ribbed elastic collar and cuffs'],
          specs: { 'Material': 'Calfskin Leather', 'Lining': 'Satin Weave', 'Weight': '1.8 kg', 'Sizing': 'Regular Bomber Fit' },
          stock: 12,
          isSpotlight: true,
          sku: 'RGL-FASH-004',
          status: 'Active',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'heavyweight-hoodie',
          name: 'Sovereign Organic Heavyweight Hoodie',
          description: 'Luxuriously dense 450 GSM organic French terry cotton hoodie. Extremely structured shoulder look with modern cropped bottom sizing.',
          price: 85.00,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.6,
          reviewsCount: 1,
          gallery: [],
          details: ['450 GSM organic French Terry', 'Double-lined hood structure', 'No drawstring minimalist layout', 'Ribbed side panels for comfort'],
          specs: { 'Fabric': 'Organic Terry Cotton', 'Density': 'Heavy 450 GSM', 'Fit': 'Slightly Cropped Boxy', 'Dye': 'Eco-Friendly Ash' },
          stock: 50,
          isSpotlight: false,
          sku: 'RGL-FASH-005',
          status: 'Active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'merino-wool-sweater',
          name: 'Merino Wool Mockneck Cable Knit Sweater',
          description: 'Knitted from premium Italian extrafine merino yarn. Chunky knit cables bring textured sophistication paired with cozy breathability.',
          price: 110.00,
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.7,
          reviewsCount: 2,
          gallery: [],
          details: ['100% Extrafine Merino Wool', 'Chunky historical Irish cable stitch', 'Soft stretch-fit neck band', 'Excellent thermal self-regulation'],
          specs: { 'Material': 'Merino Wool', 'Yarn Size': '3-Ply Chunky', 'Knit Pattern': 'Interconnected Cable', 'Fit': 'Relaxed Modern' },
          stock: 20,
          isSpotlight: false,
          sku: 'RGL-FASH-006',
          status: 'Active',
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'saffiano-leather-handbag',
          name: 'Grand Horizon Saffiano Handbag',
          description: 'Indulge in structural luxury with scratch-resistant cross-grain calfskin leather, polished gold hardware accents, and protective baseline metal feet.',
          price: 145.00,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.8,
          reviewsCount: 3,
          gallery: [],
          details: ['Scratch-resistant Saffiano calf leather', 'Reinforced top grab handles', 'Detachable shoulder strap component', 'Interior zip divider pocket'],
          specs: { 'Finish': 'Cross-Grain Saffiano', 'Metalwork': '18k Gold Plated Brass', 'Height': '22 cm', 'Width': '30 cm' },
          stock: 15,
          isSpotlight: false,
          sku: 'RGL-FASH-007',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'tweed-structured-blazer',
          name: 'Bespoke Tweed Structured Blazer',
          description: 'Woven with a historic herringbone design using pure Shetland wool. Brings sharp shoulder structuring and premium formal status.',
          price: 220.00,
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
          category: 'fashion',
          rating: 4.7,
          reviewsCount: 1,
          gallery: [],
          details: ['Shetland heritage tweed wool', 'Hand-stitched peak lapels', 'Chambered canvas inner structure', 'Dual vents for relaxed movement'],
          specs: { 'Outer': '100% Pure Wool', 'Lining': 'Viscose Blend', 'Fit': 'Tailored European', 'Pattern': 'Dark Grey Herringbone' },
          stock: 18,
          isSpotlight: true,
          sku: 'RGL-FASH-008',
          status: 'Active',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },

        // ====== ELECTRONICS (8 items) ======
        {
          id: 'studio-wireless-headphones',
          name: 'Acoustic Studio Wireless Headphones',
          description: 'Precision-tuned active noise cancelling headphones featuring high-fidelity custom drivers and comfort protein-foam cups.',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.6,
          reviewsCount: 3,
          gallery: [],
          details: ['40mm custom titanium drivers', 'Hybrid active noise cancellation (ANC)', 'Comfort memory foam headband sleeves', 'Ultra high-bandwidth Bluetooth 5.3 link'],
          specs: { 'Playtime': 'Up to 45 Hours', 'Driver': '40mm Titanium Coated', 'Charging': 'USB-C Fast Charge', 'ANC Depth': '38dB' },
          stock: 35,
          isSpotlight: true,
          sku: 'RGL-ELEC-001',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'genesis-mechanical-keyboard',
          name: 'Genesis Tactile RGB Mechanical Keyboard',
          description: 'Engineered for fluid typists, boasting hot-swappable custom switches, a solid machined aluminum frame, and gasket mount silencing plates.',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.8,
          reviewsCount: 2,
          gallery: [],
          details: ['Premium Double-shot PBT keycaps', 'Lubricated linear yellow switches', 'Machined aircraft-grade aluminum top cover', 'Triple mode: Wireless, Bluetooth, USB-C'],
          specs: { 'Form Factor': '75% Compact Layout', 'Switches': 'Yel-Pro Linear, pre-lubed', 'Stabilizers': 'Plate-mount tuned', 'RGB': '16.8 Million Colors' },
          stock: 25,
          isSpotlight: true,
          sku: 'RGL-ELEC-002',
          status: 'Active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'noise-isolation-earbuds',
          name: 'Echo-Free Active Noise Isolation Earbuds',
          description: 'Feather-light true-wireless smart earbuds designed with dual acoustic chambers for rich frequency resolution.',
          price: 69.50,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.4,
          reviewsCount: 2,
          gallery: [],
          details: ['Dual dynamic micro drivers', 'Multipoint touch-gesture sensors', 'In-ear optical wearer detection sensors', 'Water and sweat resistant (IPX4)'],
          specs: { 'Battery Use': '7 Hrs (Total 28 Hrs with case)', 'BT Version': '5.2 with LE Audio', 'Codec Support': 'AAC, mSBC, LC3', 'Case': 'Magnetic with Wireless charging' },
          stock: 45,
          isSpotlight: false,
          sku: 'RGL-ELEC-003',
          status: 'Active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'wooden-desktop-speakers',
          name: 'Acoustic Solid Walnut Desktop Speakers',
          description: 'A striking pair of active book-shelf speakers handcrafted from dark American Walnut. Infused with acoustic class-D smart amplifiers.',
          price: 175.00,
          image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.8,
          reviewsCount: 1,
          gallery: [],
          details: ['CNC hand-milled walnut enclosures', 'Premium silk dome tweeters for crisp highs', 'Composite glass fiber woofers', 'Dual analog inputs & digital Bluetooth aptX HD'],
          specs: { 'Output Power': '60W RMS (Peak 120W)', 'Freq Range': '50Hz - 22KHz', 'Cabinet': 'Walnut & MDF', 'Amp Class': 'Dual-IC Class D' },
          stock: 15,
          isSpotlight: false,
          sku: 'RGL-ELEC-004',
          status: 'Active',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'ergonomic-master-mouse',
          name: 'Vanguard Ergonomic Precision Master Mouse',
          description: 'Sublime hand comfort paired with a state-of-the-art optical tracker that tracks on glass. Ideal for high productivity.',
          price: 59.99,
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.5,
          reviewsCount: 2,
          gallery: [],
          details: ['Comfort-molded side thumb rest', 'Stepless hyper-fast scroll mechanization', '8000 DPI Darkfield precision tracker', '3 Bluetooth multi-channel pairing'],
          specs: { 'DPI': '200 to 8000 (Adjustable)', 'Battery': 'Rechargeable Li-Po 500mAh', 'Buttons': '7 Programmable keys', 'Weight': '141g' },
          stock: 50,
          isSpotlight: false,
          sku: 'RGL-ELEC-005',
          status: 'Active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'retro-charging-base',
          name: 'TimberFlow Wooden Dual Charging Base',
          description: 'Concurrently rapid-charge your mobile phone and acoustic earbuds on a sleek natural solid cherry platform.',
          price: 48.00,
          image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.3,
          reviewsCount: 1,
          gallery: [],
          details: ['100% Solid sustainably sourced cherry wood', 'Dual 15W induction copper coils', 'Anti-slip base pads for steady layout', 'Includes 30W USB-C wall charger and braided cable'],
          specs: { 'Coil Count': '2 Qi Compliant', 'Max Output': '15W Per Device', 'Base Wood': 'American Cherry', 'Led Indicator': 'Underlined Soft White' },
          stock: 30,
          isSpotlight: false,
          sku: 'RGL-ELEC-006',
          status: 'Active',
          createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'smart-wellness-band',
          name: 'Vanguard Smart Fitness Sleep Band',
          description: 'Sleek, minimalist health band tracking your rest trends, blood-oxygen markers, muscle recovery indexes, and temperature.',
          price: 39.99,
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.2,
          reviewsCount: 1,
          gallery: [],
          details: ['Scratch-proof vivid OLED band', 'Automatic high-efficiency sports identifier', 'Skin temperature & SpO2 health tracking', 'Surgical liquid-silicone hypoallergenic strap'],
          specs: { 'Battery Standby': 'Up to 10 Days', 'Waterproof': 'IP68 Swim Rated', 'Weight': '21g', 'App Support': 'Android & iOS Sync' },
          stock: 65,
          isSpotlight: false,
          sku: 'RGL-ELEC-007',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'compact-massage-gun',
          name: 'Vortex Pro Deep Tissue Percussive Gun',
          description: 'A powerful percussive recovery gun engineered for fast muscle relaxation, sports recovery, and tension clearing.',
          price: 79.00,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
          category: 'electronics',
          rating: 4.6,
          reviewsCount: 3,
          gallery: [],
          details: ['High-torque brushless percussive motor', '6 Interconnectable targeting heads', 'Pre-programmed 6-speed gear selector', 'Sovereign ultra-quiet dampening core'],
          specs: { 'Percussions': '1800 - 3200 RPM', 'Force Limit': '35 lbs', 'Battery life': '4.5 Hours', 'Attachment Count': '6 Custom Heads' },
          stock: 22,
          isSpotlight: true,
          sku: 'RGL-ELEC-008',
          status: 'Active',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },

        // ====== WATCHES (7 items) ======
        {
          id: 'mechanical-skeleton-watch',
          name: 'Chronos Hand-Wound Mechanical Skeleton Watch',
          description: 'Peer into the mesmerizing micro-architecture of time. Features a fully cut-away open skeleton design of hand-finished brass gears.',
          price: 450.00,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.9,
          reviewsCount: 2,
          gallery: [],
          details: ['Hand-wound mechanical complex movement', 'Genuine scratch-resistant sapphire crystal front & back', 'Classic full-grain crocodile leather strap', '42-hour power reserve holding limit'],
          specs: { 'Case Diameter': '41mm', 'Glass': 'Double Sapphire Crystal', 'Jewels': '24 Ruby Inlays', 'Water Resistance': '50 meters' },
          stock: 10,
          isSpotlight: true,
          sku: 'RGL-WAT-001',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'sapphire-aviator-watch',
          name: 'Sovereign Sapphire Chrono Aviator Watch',
          description: 'High contrast tactical hands meet classic aviation look-guides. Designed with self-charging quartz and luminous indicators.',
          price: 320.00,
          image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.7,
          reviewsCount: 2,
          gallery: [],
          details: ['Tachymeter bezel layout with sub-dials', 'Incredibly bright Super-LumiNova indices', 'Corrosion-proof 316L medical stainless steel', 'Sturdy quick-release NATO strap'],
          specs: { 'Caliber': 'Japanese Solar Quartz', 'Case Width': '42.5mm', 'Lume': 'SuperC3 Green', 'Weight': '92g' },
          stock: 12,
          isSpotlight: true,
          sku: 'RGL-WAT-002',
          status: 'Active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'gold-plated-dress-watch',
          name: 'Heritage 18K Gold-Plated Mechanical Dress Watch',
          description: 'A masterpiece of classic heritage. Features an ultra-flat mechanical movement housed under an elegant 18k yellow gold-plated steel case.',
          price: 580.00,
          image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.9,
          reviewsCount: 1,
          gallery: [],
          details: ['Thick 18K custom yellow gold plating', 'Elegant eggshell dial with Roman numerals', 'Blued leaf-shape indicators', 'Authentic black alligator skin bracelet'],
          specs: { 'Thickness': 'Ultra-thin 6.8mm', 'Movement': 'Swiss Manual Wind', 'Case Material': 'Gold plated 316L', 'Warranty': '5 Years' },
          stock: 8,
          isSpotlight: false,
          sku: 'RGL-WAT-003',
          status: 'Active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'titanium-field-watch',
          name: 'Voyager Tactical Titanium Field Watch',
          description: 'Featherlight and exceptionally impact-resistant, crafted from sandblasted grade 2 titanium. Built for outdoor adventurers.',
          price: 215.00,
          image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.5,
          reviewsCount: 2,
          gallery: [],
          details: ['Lightweight Grade 5 Titanium case', 'Double internal anti-reflective sapphire coat', 'Screw-down crown structure', 'Extremely sturdy water-resistant olive canvas strap'],
          specs: { 'Case Material': 'Sandblasted Titanium', 'Caliber': 'Automatic NH35 Day-Date', 'Water Resistance': '100m (Screw-down)', 'Weight': '58g only' },
          stock: 20,
          isSpotlight: false,
          sku: 'RGL-WAT-004',
          status: 'Active',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'obsidian-quartz-watch',
          name: 'Minimalist Obsidian Onyx Quartz Watch',
          description: 'A stark, design-first obsidian quartz wristwatch featuring a black velvet-texture dial face, omitting all index markers.',
          price: 145.00,
          image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.4,
          reviewsCount: 1,
          gallery: [],
          details: ['Deep obsidian-tinted sapphire dome', 'Premium black PVD ion-plated steel case', 'Buttery soft Horween leather strap', 'Japanese high-precision quartz movement'],
          specs: { 'Case Diameter': '39mm', 'Face': 'Onyx Black Minimalist', 'Strap Width': '20mm', 'Battery': 'Silver Oxide 3-Year' },
          stock: 25,
          isSpotlight: false,
          sku: 'RGL-WAT-005',
          status: 'Active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'carbon-dive-watch',
          name: 'Deep-Sea Carbon Pro Chronograph Dive Watch',
          description: 'A legendary oceanic watch built with a rotating carbon fiber bezel, helium release valve, and heavy expansion metal band.',
          price: 380.00,
          image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.8,
          reviewsCount: 3,
          gallery: [],
          details: ['120-click unidirectional rotating carbon bezel', 'Active helium escape escape valve', 'Expansion diving bracelet with safety clasp', 'Extremely high shock resistance core'],
          specs: { 'Water Limit': '300 meters / 1000 ft', 'Bezel': 'Real Carbon Fiber', 'Crown': 'Quad-O-Ring Threaded', 'Lume Color': 'Aquamarine Blue' },
          stock: 15,
          isSpotlight: false,
          sku: 'RGL-WAT-006',
          status: 'Active',
          createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'moonphase-celestial-watch',
          name: 'Stellar Blue Automatic Moonphase Watch',
          description: 'Behold the night skies on your wrist. Features a mechanical copper-etched rotating moon-disc display pointing to celestial movements.',
          price: 620.00,
          image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop',
          category: 'watches',
          rating: 4.9,
          reviewsCount: 2,
          gallery: [],
          details: ['Real active orbital moonphase subindicator', 'Stunning aventurine stellar blue dial', 'Decorated automatic micro-rotor movement', 'Curved dome watch-glass profile'],
          specs: { 'Dial': 'Aventurine Glass', 'Indicator': 'Laser Sculpted Brass Disc', 'Reserve Power': '40 Hours', 'Jewel Count': '29 Swiss Jewels' },
          stock: 5,
          isSpotlight: true,
          sku: 'RGL-WAT-007',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },

        // ====== SHOES (8 items) ======
        {
          id: 'leather-oxford-shoes',
          name: 'Bespoke Hand-Finished Leather Oxford Shoes',
          description: 'Italian whole-cut executive oxfords made of carefully selected full-grain calf skin. Elegant closed lacing system.',
          price: 245.00,
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.8,
          reviewsCount: 3,
          gallery: [],
          details: ['Goodyear-welted resoleable sole', 'Premium whole-cut pattern calf leather', 'Hand-applied antique mahogany patina', 'Luxe padded calfskin sweat-absorb interior'],
          specs: { 'Construction': 'Goodyear Welted', 'Sole': 'German Oak-Bark Leather', 'Toe Shape': 'Soft Almond', 'Country': 'Portugal' },
          stock: 14,
          isSpotlight: true,
          sku: 'RGL-SHOE-001',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'comfy-knit-sneakers',
          name: 'Pro-Run Light Nitrogen-Injected Athletic Sneakers',
          description: 'Float over concrete. Advanced nitrogen-injected cushion foam brings massive rebound return matched with active-breathable flyknit uppers.',
          price: 95.00,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.6,
          reviewsCount: 2,
          gallery: [],
          details: ['Nitrogen-boosted supreme foam', 'Slip-resistant carbon rubber treads', 'Extremely lightweight knit body', 'Ergonomic supportive TPU heel cap'],
          specs: { 'Segment': 'Performance Athletic', 'Midsole': 'Nitro-Burst EVA', 'Sizing': 'True to Size', 'Weight': '241g' },
          stock: 45,
          isSpotlight: false,
          sku: 'RGL-SHOE-002',
          status: 'Active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'hiking-trail-boots',
          name: 'Trailblazer Weatherproof Rugged Hiking Boots',
          description: 'Engineered for dense nature trails. Features a sealed breathable inner sleeve and rigid Vibram claw lugs for maximum grip.',
          price: 165.00,
          image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.7,
          reviewsCount: 2,
          gallery: [],
          details: ['Sealed waterproof internal membrane', 'Premium nubuck scratch-resistant leather', 'Genuine Vibram high-friction mega-grip outsoles', 'Reinforced impact steel-shank toe box'],
          specs: { 'Outsole': 'Vibram Peak-Lug Rubber', 'Weight': '590g per boot', 'Height': '6 Inch ankle wrap', 'Membrane': 'HydraDry Comfort' },
          stock: 18,
          isSpotlight: true,
          sku: 'RGL-SHOE-003',
          status: 'Active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'suede-casual-loafers',
          name: 'Classic Forest Suede Hand-Stitched Loafers',
          description: 'A relaxed classic slip-on. Milled from select calf suede, unlined inside to fit your foot profile with divine flexibility.',
          price: 110.00,
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.4,
          reviewsCount: 1,
          gallery: [],
          details: ['100% fine Italian calf suede', 'Buttery soft unlined construction', 'Sturdy non-marking rubber driver sole', 'Hand-stitched moccasin toe line'],
          specs: { 'Material': 'Italian Suede', 'Lining': 'None (Adaptive)', 'Sizing': 'Go half-size down', 'Sole Type': 'Split Driver Lugs' },
          stock: 30,
          isSpotlight: false,
          sku: 'RGL-SHOE-004',
          status: 'Active',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'retro-tennis-sneakers',
          name: 'Royal Court Full-Grain White Tennis Sneakers',
          description: 'A clean minimalist silhouette constructed with dense full-grain leather, orthopedic core inserts, and durable rubber cup-soles.',
          price: 85.00,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.5,
          reviewsCount: 2,
          gallery: [],
          details: ['Full-grain robust cow leather', 'Removable custom-arched cork footbeds', '360° sidewall cupsole stitching longevity', 'Minimalist embossed gold catalog lettering'],
          specs: { 'Upper': 'Calfskin Leathers', 'Outsole': 'Stitched Rubber Cup', 'Lining': 'Calfskin soft wrap', 'Laces': 'Organic flat waxed cotton' },
          stock: 35,
          isSpotlight: false,
          sku: 'RGL-SHOE-005',
          status: 'Active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'double-monk-straps',
          name: 'Heritage Chestnut Burnished Double Monk Shoes',
          description: 'A gorgeous classic buckle shoe, handcrafted with a hand-burnished deep chestnut color. Outlined with exquisite toe-cap brogueing details.',
          price: 235.00,
          image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.7,
          reviewsCount: 1,
          gallery: [],
          details: ['Goodyear-welted build framework', 'Hand-colored chestnut aniline leather finish', 'Twin solid brass adjusting buckles', 'Gently padded leather orthotic support'],
          specs: { 'Sole Material': 'Durable Leather + Rubber overlay', 'Upper Finish': 'Hand-Museum Aniline Patina', 'Strap Buckle': 'Reinforced Solid Brass', 'Origin': 'Handcrafted' },
          stock: 12,
          isSpotlight: false,
          sku: 'RGL-SHOE-006',
          status: 'Active',
          createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'fleece-shearling-slippers',
          name: 'Cozy Alpine Fleece Mukluk Slippers',
          description: 'Slip into deep winter warmth with fine wool fleeces and a supple anti-humidity rubber bottom layer ideal for cozy indoor lounging.',
          price: 55.00,
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.3,
          reviewsCount: 1,
          gallery: [],
          details: ['Insulated cozy fleece wool wrap', 'Soft dynamic footbed cushioning memory layers', 'Flexible, water-repelling durable outdoor outer sole', 'Easy adaptive slip-on high-collar structure'],
          specs: { 'Lining': '100% Shearling Fleeces', 'Outer Pattern': 'Suede Leather', 'Weight': '160g', 'Use Rating': 'Warm Cozy Comfort' },
          stock: 40,
          isSpotlight: false,
          sku: 'RGL-SHOE-007',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'all-weather-trainers',
          name: 'Element-X High-Traction Carbon Cross-Trainers',
          description: 'Unmatched athletic training shoe engineered with carbon shank stability locks and a weather-defying mesh surface.',
          price: 125.00,
          image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=600&auto=format&fit=crop',
          category: 'shoes',
          rating: 4.6,
          reviewsCount: 2,
          gallery: [],
          details: ['Aero-mesh breathable water-repelling wrap', 'Internal Carbon structural arch stabilizer', 'High durability vulcanized rubber traction soles', 'Speed-lace rapid loop system'],
          specs: { 'Stiffness Grid': 'Lateral Carbon Support', 'Midsole': 'High-Impact Shock Foam', 'Activity Use': 'Gym, Running, Agility', 'Colorway': 'Classic Stealth Black' },
          stock: 26,
          isSpotlight: false,
          sku: 'RGL-SHOE-008',
          status: 'Active',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },

        // ====== ACCESSORIES (7 items) ======
        {
          id: 'full-grain-wallet',
          name: 'Vachetta Full-Grain Leather Bi-Fold Wallet',
          description: 'A pocket essential made of robust Italian vegetable tanned leather. Holds currency banknotes and up to eight card pockets.',
          price: 65.00,
          image: 'https://images.unsplash.com/photo-1627124718515-e23e7164fab0?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.6,
          reviewsCount: 2,
          gallery: [],
          details: ['Vegetable tanned Italian beefhide Vachetta', '8 dedicated RFID protected card slots', 'Two hidden compartments for receipts', 'Hand-burnished wax borders'],
          specs: { 'Material': 'Vegetable Leather', 'Made In': 'Tuscany', 'RFID shielding': 'Yes, Certified', 'Fold Sizing': '11 x 9.5 cm' },
          stock: 50,
          isSpotlight: false,
          sku: 'RGL-ACC-001',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'gold-aviators-classic',
          name: 'Modern Aviator Polarized Classic Gold Sunglasses',
          description: 'Classically elegant, featuring wire titanium frames electroplated in real 18K gold. Features polarized TAC green lenses.',
          price: 135.00,
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.8,
          reviewsCount: 2,
          gallery: [],
          details: ['Pure lightweight robust titanium wire rims', '18K polished yellow gold electroplated finish', 'Category-3 polarized shatterproof green lenses', 'Silicone air-bag nose guards for comfort'],
          specs: { 'Lens tech': '100% UV400 Polarized TAC', 'Temple Finish': 'Acetate Tortoise', 'Weight': '16g only', 'Sizing': '58-14-142' },
          stock: 32,
          isSpotlight: true,
          sku: 'RGL-ACC-002',
          status: 'Active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'silver-chain-bracelet',
          name: 'Pure Sterling Silver Hand-Carved Chain Link Bracelet',
          description: 'A stunning solid 925 silver heavy link bracelet, styled with historic geometric carvings and quick lock security box clasps.',
          price: 110.00,
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.7,
          reviewsCount: 1,
          gallery: [],
          details: ['Genuine Certified 925 Sterling Silver', 'Vivid oxidization detailing highlights carvings', 'Heavy-weight chunky statement link structure', 'Secure dual-trigger box lock clasp'],
          specs: { 'Material': '925 Sterling Silver', 'Purity': '92.5%', 'Length': '20 cm', 'Weight': '42g' },
          stock: 25,
          isSpotlight: false,
          sku: 'RGL-ACC-003',
          status: 'Active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'solid-brass-cufflinks',
          name: 'Sovereign Vintage Solid Brass Monogram Cufflinks',
          description: 'Machined from single bars of raw brass, showcasing subtle brushed geometry. The choice for securing french double shirt cuffs.',
          price: 45.00,
          image: 'https://images.unsplash.com/photo-1593030761757-71be04d43f30?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.5,
          reviewsCount: 1,
          gallery: [],
          details: ['100% Solid machined marine-grade brass', 'Hand-polished brushed satin surface finish', 'Tarnish-resistant clear coat protective finish', 'Classic rigid swivel-post design'],
          specs: { 'Material': 'Marine Grade Brass', 'Post Type': 'Swivel Bullet Post', 'Face Dimension': '16mm Round', 'Weight': '11g' },
          stock: 60,
          isSpotlight: false,
          sku: 'RGL-ACC-004',
          status: 'Active',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'saffiano-card-holder',
          name: 'Elite Saffiano Thin Leather Cards Pocket',
          description: 'An ultra-slim, low profile cards stash crafted from scratch-proof Saffiano leather featuring direct center cash slots.',
          price: 32.00,
          image: 'https://images.unsplash.com/photo-1627124718515-e23e7164fab0?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.3,
          reviewsCount: 2,
          gallery: [],
          details: ['Original saffiano pattern calfskin leather', '4 side credit card pockets + 1 center slot', 'Hand-painted wax margins prevent fraying', 'Extremely compact front-pocket-optimized layout'],
          specs: { 'Finish': 'Cross-Hatch Saffiano', 'Pocket Count': '5 Slots', 'Draping': 'Slim 4mm only', 'Color': 'Royal Navy' },
          stock: 75,
          isSpotlight: false,
          sku: 'RGL-ACC-005',
          status: 'Active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'leather-overnighter-duffle',
          name: 'Heritage Vachetta Hand-Stitched Cabin Duffle',
          description: 'A beautiful masterpiece for travel. Sculpted of thick, protective waxed canvas and full-grain cowhide leather trim panels.',
          price: 195.00,
          image: 'https://images.unsplash.com/photo-1531046077598-f584e0c4cb45?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.9,
          reviewsCount: 2,
          gallery: [],
          details: ['Water-repelling paraffin waxed heavyweight canvas', 'Thick oil-tanned top hide leather panelings', 'Dual interior zip pockets + easy hook key ring', 'Heavy-duty solid brass rivets and zipper tracks'],
          specs: { 'Volume': '42 Liters (Carry-On Approved)', 'Weight': '1.7 kg', 'Hardware': 'Solid antiqued brass rivets', 'Base Protect': '5 metal feet base' },
          stock: 15,
          isSpotlight: true,
          sku: 'RGL-ACC-006',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'onyx-minimalist-bracelet',
          name: 'Polished Onyx & Hematite Protective Beaded Bracelet',
          description: 'Artisanal micro-beaded bracelet. Combines authentic polished matte black onyx with mirror-polished metallic hematite stones.',
          price: 48.00,
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
          category: 'accessories',
          rating: 4.6,
          reviewsCount: 1,
          gallery: [],
          details: ['Original 8mm high-grade black onyx stones', 'Faceted high-density heavy hematite spacer elements', 'Elasticated high-tensile silicone elastic wire', 'Packaged inside a linen gift satchel'],
          specs: { 'Bead Diameter': '8mm Gemstones', 'Elastic': 'Dual-layer Silicon Core', 'Circumference': '19.5 cm', 'Feel': 'Cold solid natural stones' },
          stock: 40,
          isSpotlight: false,
          sku: 'RGL-ACC-007',
          status: 'Active',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },

        // ====== HOME DECOR (7 items) ======
        {
          id: 'organic-throw-blanket',
          name: 'Organic Chunky Knit Cotton Thermal Throw Blanket',
          description: 'A gorgeous, textured cable-knit throw blanket made of organic ring-spun cotton. Delivers massive cozy warmth and breathable weight overlays.',
          price: 95.00,
          image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.7,
          reviewsCount: 3,
          gallery: [],
          details: ['100% Organic certified long-staple cotton', 'Chunky woven cable-knit thermal geometry', 'Heavy, drape-friendly cozy weight footprint', 'Oeko-Tex Standard 100 certified toxics-free'],
          specs: { 'Material': 'Organic Cotton Blend', 'Size': '130 x 170 cm', 'Weight': '1.6 kg', 'Washable': 'Machine Cold Delicate' },
          stock: 35,
          isSpotlight: false,
          sku: 'RGL-DECO-001',
          status: 'Active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'glass-rippled-vase',
          name: 'Handmade Rippled Murano Amber Glass Art Vase',
          description: 'Beautifully mouth-blown by glass artisans, this table vase showcases golden amber fluid horizontal ripples that catch morning rays.',
          price: 58.00,
          image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.5,
          reviewsCount: 1,
          gallery: [],
          details: ['100% Mouth-blown lead-free soda-lime glass', 'Each unit possesses unique abstract ripple guides', 'Dense, heavy baseline prevents tipping', 'Stunning polished glass top collar cut'],
          specs: { 'Material': 'Lead-Free Art Glass', 'Height': '28 cm', 'Color': 'Warm Amber / Topaz Accent', 'Weight': '1.1 kg' },
          stock: 22,
          isSpotlight: false,
          sku: 'RGL-DECO-002',
          status: 'Active',
          createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'walnut-desk-organizer',
          name: 'Solid American Walnut Valet Desk Organizer Tray',
          description: 'Declutter with natural luxury. Solid walnut block precision CNC machined with soft curves, leather-lined floor beds, and tablet slots.',
          price: 75.00,
          image: 'https://images.unsplash.com/photo-1594913785162-e6785e4eded9?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.8,
          reviewsCount: 2,
          gallery: [],
          details: ['Carved from unified solid American walnut piece', 'Vegetable tanned dark brown cow leather lining inserts', 'Dedicated pen slot, smartphone/tablet rack', 'Anti-slide baseline protective cork feet pads'],
          specs: { 'Base Wood': 'Premium American Walnut', 'Inlay Lining': 'Veg-Tanned Leather', 'Sizing': '32 x 20 x 2.2 cm', 'Oil Treatment': 'Natural Danish Oils' },
          stock: 28,
          isSpotlight: true,
          sku: 'RGL-DECO-003',
          status: 'Active',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'sunset-glass-lamp',
          name: 'Ambient Sunset Hand-Blown Opal Spherical Table Lamp',
          description: 'Enjoy calming bedtime rays. A beautiful hand-blown satin white glass globe resting on a solid brushed-brass weighted plinth base.',
          price: 110.00,
          image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.8,
          reviewsCount: 3,
          gallery: [],
          details: ['Matte frosted satin white glass dome diffuser', 'Machined solid brass heavy support collar', 'Circadian custom stepless rotary dimmer slider switch', 'Compatible with smart LED circadian glow bulbs'],
          specs: { 'Glass Globe': 'Frosted Opal Diffuser', 'Sizing': '22 cm Diameter', 'Base Material': 'Brushed Brass Coated', 'Cord': '1.8m Braided Linen Wire' },
          stock: 16,
          isSpotlight: true,
          sku: 'RGL-DECO-004',
          status: 'Active',
          createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'ceramic-diffuser-essential',
          name: 'Artisanal Fluted Matte Black Ceramic Aroma Diffuser',
          description: 'A striking visual ultrasonic humidifier showcasing fluted architectural textures on a heavy matte ceramic cover structure.',
          price: 49.00,
          image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.6,
          reviewsCount: 1,
          gallery: [],
          details: [' ultrasonic motor nebulizes oils without heat templates', 'Textured hand-carved fluted stoneware ceramic top', 'Warm ambient glow mood LED light guide ribbon', 'Auto-shutdown switch triggers when empty'],
          specs: { 'Water Tank': '120 ml capacity', 'Run Modes': 'Cont. (4hrs) / Intermittent (8hrs)', 'Acoustic level': 'Extremely silent <18dB', 'Material': 'Matte Stoneware Ceramic' },
          stock: 42,
          isSpotlight: false,
          sku: 'RGL-DECO-005',
          status: 'Active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'marble-bookends-sculpted',
          name: 'White Carrara Hexagonal Sculpted Marble Bookends',
          description: 'Keep books securely lined in majestic status. Cut by stone masons from certified Italian Carrara white marble blocks.',
          price: 89.00,
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.8,
          reviewsCount: 2,
          gallery: [],
          details: ['Unified pair of white Carrara marble blocks', 'Perfect geo-metric hexagonal modern carving lines', 'Naturally occurring grey-silver quartz veinings', 'Plush felted baseline pads safeguard wood varnishes'],
          specs: { 'Material': 'Certified Carrara Marble', 'Sizing': '12 x 8 x 16 cm per unit', 'Weight': '2.4 kg per pair', 'Surface finish': 'Smooth Honed Satin' },
          stock: 15,
          isSpotlight: false,
          sku: 'RGL-DECO-006',
          status: 'Active',
          createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'jute-woven-floor-mat',
          name: 'Heritage Organic Hand-Spun Thick Jute Mat',
          description: 'Instantly anchor your entryway or ambient reading reading chair corner with standard durable hand-braided natural jute fiber matrices.',
          price: 125.00,
          image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600&auto=format&fit=crop',
          category: 'home-decor',
          rating: 4.5,
          reviewsCount: 2,
          gallery: [],
          details: ['100% Natural sustainably harvested golden jute', 'Heavyweight thick braided double-sided loops', 'Biodegradable organic fibers are highly durable', 'Reversible design doubles usage longevity'],
          specs: { 'Material': 'Natural Golden Jute', 'Diameter': '120 cm Round', 'Height': '1.2 cm thick weave', 'Made In': 'Bengal Co-Operatives' },
          stock: 20,
          isSpotlight: false,
          sku: 'RGL-DECO-007',
          status: 'Active',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      ];
      seededProducts = await Product.insertMany(products as any);
      console.log(`💚 Created ${seededProducts.length} high-fidelity products.`);
    } else {
      seededProducts = await Product.find({});
    }

    // 4. Seed Reviews for outstanding dynamic rating aggregation
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log("➡️ [DB Seeding] Crafting product review metrics...");
      const reviews = [
        { productId: 'classic-trench-coat', name: 'Henna Borse', rating: 5, comment: 'Sovereign design, beautiful flow and thick warm wool! Highly recommend.', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1005) },
        { productId: 'classic-trench-coat', name: 'Lydia Croft', rating: 4, comment: 'Extremely elegant look for business. Fabric is top-tier.', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1003) },
        { productId: 'studio-wireless-headphones', name: 'Marcus Aurelius', rating: 5, comment: 'Divine levels of high-bandwidth acoustic performance. Very comfortable.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1002) },
        { productId: 'mechanical-skeleton-watch', name: 'Tony Stark', rating: 5, comment: 'Exceptional open-work brass gearing. Watch dial is absolutely spectacular!', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1001) },
        { productId: 'leather-oxford-shoes', name: 'Bruce Wayne', rating: 5, comment: 'Uncompromising handwork, premium closed laces leather drape. Flawless Goodyear stitching.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1004) }
      ];
      await Review.insertMany(reviews as any[]);
      console.log("💚 Injected high quality test reviews.");
    }

    // 5. Build dynamic Orders (At least 15) - DISABLED per user requirement to use only real checkout data
    const orderCount = await Order.countDocuments();
    if (false) {
      console.log("➡️ [DB Seeding] Injecting 15+ historical orders...");
      const sampleOrders = [
        {
          orderId: "RGL-10001",
          userId: seededUsers[1]?._id || "640a1b2c3d4e5f6a7b8c9d01",
          email: "lydia@gmail.com",
          name: "Lydia Croft",
          items: [
            { id: 'classic-trench-coat', name: 'Sovereign Wool Trench Coat', price: 185.00, quantity: 1, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 185.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10001",
          shippingAddress: "45 Sovereign Row, Chelsea, London, UK",
          status: "Delivered",
          trackingNumber: "UPS-LYD10001",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10002",
          userId: seededUsers[2]?._id || "640a1b2c3d4e5f6a7b8c9d02",
          email: "marcus@gmail.com",
          name: "Marcus Aurelius",
          items: [
            { id: 'mechanical-skeleton-watch', name: 'Chronos Hand-Wound Mechanical Skeleton Watch', price: 450.00, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 450.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10002",
          shippingAddress: "Villa di Antistio, Mount Palatine, Rome",
          status: "Processing",
          trackingNumber: "UPS-MRC10002",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10003",
          userId: seededUsers[3]?._id || "640a1b2c3d4e5f6a7b8c9d03",
          email: "john@example.com",
          name: "John Smith",
          items: [
            { id: 'studio-wireless-headphones', name: 'Harmonic Aura noise-Cancelling Headphones', price: 299.00, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 299.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10003",
          shippingAddress: "10 Downing St, London, UK",
          status: "Delivered",
          trackingNumber: "UPS-JHN10003",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10004",
          userId: "640a1b2c3d4e5f6a7b8c9d04",
          email: "emma@example.com",
          name: "Emma Brown",
          items: [
            { id: 'leather-oxford-shoes', name: 'Monarch Bespoke Leather Oxfords', price: 245.00, quantity: 1, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 245.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10004",
          shippingAddress: "24 Fifth Ave, New York, NY, USA",
          status: "Shipped",
          trackingNumber: "UPS-EMA10004",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10005",
          userId: "640a1b2c3d4e5f6a7b8c9d05",
          email: "michael@example.com",
          name: "Michael Lee",
          items: [
            { id: 'jute-woven-floor-mat', name: 'Heritage Organic Hand-Spun Thick Jute Mat', price: 125.00, quantity: 2, image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 250.00,
          paymentStatus: "Pending",
          paymentId: "pi_fake_10005",
          shippingAddress: "88 Marina Boulevard, Singapore",
          status: "Pending",
          trackingNumber: "",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10006",
          userId: "640a1b2c3d4e5f6a7b8c9d06",
          email: "sophia@example.com",
          name: "Sophia Davis",
          items: [
            { id: 'marble-bookends-sculpted', name: 'White Carrara Hexagonal Sculpted Bookends', price: 89.00, quantity: 1, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 89.00,
          paymentStatus: "Failed",
          paymentId: "pi_fake_10006",
          shippingAddress: "12 Rue de Rivoli, Paris, France",
          status: "Cancelled",
          trackingNumber: "",
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10007",
          userId: "640a1b2c3d4e5f6a7b8c9d07",
          email: "james@example.com",
          name: "James Wilson",
          items: [
            { id: 'classic-trench-coat', name: 'Sovereign Wool Trench Coat', price: 185.00, quantity: 1, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop' },
            { id: 'jute-woven-floor-mat', name: 'Heritage Organic Hand-Spun Thick Jute Mat', price: 125.00, quantity: 1, image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 310.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10007",
          shippingAddress: "55 King St, Sydney, NSW, Australia",
          status: "Delivered",
          trackingNumber: "UPS-JAM10007",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10008",
          userId: "640a1b2c3d4e5f6a7b8c9d08",
          email: "olivia@example.com",
          name: "Olivia Martinez",
          items: [
            { id: 'marble-bookends-sculpted', name: 'White Carrara Hexagonal Sculpted Bookends', price: 89.00, quantity: 2, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 178.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10008",
          shippingAddress: "101 Grand Canal, Venice, Italy",
          status: "Delivered",
          trackingNumber: "UPS-OLV10008",
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10009",
          userId: "640a1b2c3d4e5f6a7b8c9d09",
          email: "daniel@example.com",
          name: "Daniel Taylor",
          items: [
            { id: 'leather-oxford-shoes', name: 'Monarch Bespoke Leather Oxfords', price: 245.00, quantity: 1, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 245.00,
          paymentStatus: "Pending",
          paymentId: "pi_fake_10009",
          shippingAddress: "Via del Corso 22, Milan, Italy",
          status: "Processing",
          trackingNumber: "",
          createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10010",
          userId: "640a1b2c3d4e5f6a7b8c9d10",
          email: "isabella@example.com",
          name: "Isabella Anderson",
          items: [
            { id: 'studio-wireless-headphones', name: 'Harmonic Aura noise-Cancelling Headphones', price: 299.00, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 299.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10010",
          shippingAddress: "George St 404, Edinburgh, UK",
          status: "Delivered",
          trackingNumber: "UPS-ISA10010",
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10011",
          userId: "640a1b2c3d4e5f6a7b8c9d11",
          email: "william@example.com",
          name: "William Thomas",
          items: [
            { id: 'classic-trench-coat', name: 'Sovereign Wool Trench Coat', price: 185.00, quantity: 1, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 185.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10011",
          shippingAddress: "77 Princess St, Vancouver, BC, Canada",
          status: "Delivered",
          trackingNumber: "UPS-WIL10011",
          createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10012",
          userId: "640a1b2c3d4e5f6a7b8c9d12",
          email: "ava@example.com",
          name: "Ava Jackson",
          items: [
            { id: 'mechanical-skeleton-watch', name: 'Chronos Hand-Wound Mechanical Skeleton Watch', price: 450.00, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 450.00,
          paymentStatus: "Failed",
          paymentId: "pi_fake_10012",
          shippingAddress: "90 Shibuya Crossing, Tokyo, Japan",
          status: "Cancelled",
          trackingNumber: "",
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10013",
          userId: "640a1b2c3d4e5f6a7b8c9d13",
          email: "liam@example.com",
          name: "Liam Garcia",
          items: [
            { id: 'jute-woven-floor-mat', name: 'Heritage Organic Hand-Spun Thick Jute Mat', price: 125.00, quantity: 1, image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 125.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10013",
          shippingAddress: "450 Paseo de la Reforma, CDMX, Mexico",
          status: "Delivered",
          trackingNumber: "UPS-LIA10013",
          createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10014",
          userId: "640a1b2c3d4e5f6a7b8c9d14",
          email: "noah@example.com",
          name: "Noah Martinez",
          items: [
            { id: 'leather-oxford-shoes', name: 'Monarch Bespoke Leather Oxfords', price: 245.00, quantity: 1, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 245.00,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10014",
          shippingAddress: "12 Avenida de Mayo, Buenos Aires, Argentina",
          status: "Processing",
          trackingNumber: "UPS-NOH10014",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: "RGL-10015",
          userId: "640a1b2c3d4e5f6a7b8c9d15",
          email: "oliver@example.com",
          name: "Oliver Rodriguez",
          items: [
            { id: 'studio-wireless-headphones', name: 'Harmonic Aura noise-Cancelling Headphones', price: 299.00, quantity: 2, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' }
          ],
          totalAmount: 598.05,
          paymentStatus: "Paid",
          paymentId: "pi_fake_10015",
          shippingAddress: "77 Diagonal Ave, Barcelona, Spain",
          status: "Shipped",
          trackingNumber: "UPS-OLI10015",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      ];

      const insertedOrders = await Order.insertMany(sampleOrders as any[]);
      
      // Auto register equivalent payments
      for (const ord of insertedOrders) {
        await Payment.create({
          paymentId: ord.paymentId || "pi_real_" + Math.random().toString(36).substring(4),
          orderId: ord.orderId,
          email: ord.email,
          name: ord.name,
          amount: ord.totalAmount,
          currency: "usd",
          method: "Credit Card",
          status: ord.paymentStatus === 'Paid' ? 'Paid' : 'Failed',
          createdAt: ord.createdAt
        });
      }

      console.log(`💚 Crafted ${insertedOrders.length} historical complex orders. Created matching payments.`);
    }

    // 6. Seed Newsletter Subscribers (At least 20)
    const subscriberCount = await NewsletterSubscriber.countDocuments();
    if (subscriberCount === 0) {
      console.log("➡️ [DB Seeding] Enrolling 20 newsletter subscribers...");
      const subscribers = [
        { email: "concierge@royalbox.com", status: "Active", subscribedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { email: "tester@royalbox.com", status: "Active", subscribedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) },
        { email: "gifting@milanfashion.it", status: "Active", subscribedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
        { email: "william@goldencoast.us", status: "Active", subscribedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000) },
        { email: "corporate@elitegifts.co", status: "Active", subscribedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000) },
        { email: "bhargavbor597@gmail.com", status: "Active", subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        { email: "noble.giver@outlook.com", status: "Active", subscribedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        { email: "sovereign.patron@gmail.com", status: "Active", subscribedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) },
        { email: "lux@milano.it", status: "Active", subscribedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
        { email: "elite_curator@london.uk", status: "Active", subscribedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) },
        { email: "gold.member@paris.fr", status: "Active", subscribedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { email: "curator@vienna.at", status: "Active", subscribedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
        { email: "bespoke_gifting@tokyo.jp", status: "Active", subscribedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
        { email: "royal_patron@monaco.mc", status: "Active", subscribedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { email: "design_director@milan.it", status: "Active", subscribedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
        { email: "elite_buyer@nyc.com", status: "Active", subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { email: "general_manager@villas.es", status: "Active", subscribedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { email: "travel.curator@zurich.ch", status: "Active", subscribedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { email: "luxury.concierge@dubai.ae", status: "Active", subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { email: "sovereign.gifts@geneva.ch", status: "Active", subscribedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ];

      await NewsletterSubscriber.insertMany(subscribers);
      console.log(`💚 Seeded ${subscribers.length} exquisite active newsletter subscribers.`);
    }

    console.log("🌸 [DB Seeding] Success! Regal box sovereign data registry is completely populated & ready.");
  } catch (error: any) {
    console.error("❌ [DB Seeding] Exception occurred while populating database:", error.message);
  }
}
