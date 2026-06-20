import mongoose, { Schema } from "mongoose";

// --- USERS SCHEMA CONFIG ---
export interface IUser {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password?: string;
  isVerified: boolean;
  verificationCode?: string;
  signupDate: Date;
  createdAt?: Date;
  role: 'Customer' | 'Admin';
  cart: Array<{
    productId: string;
    quantity: number;
  }>;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, default: "" },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  verificationCode: { type: String },
  signupDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
  cart: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
}, { collection: "users" });

// --- CATEGORIES SCHEMA CONFIG ---
export interface ICategory {
  id: string; // custom slug like 'beauty', 'fashion'
  name: string;
  iconName: string;
  description: string;
}

const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  iconName: { type: String, required: true, default: 'Package' },
  description: { type: String, default: "" }
}, { collection: "categories" });

// --- PRODUCTS SCHEMA CONFIG ---
export interface IProduct {
  id: string; // custom identifier e.g. 'foxtale-cleanser'
  name: string;
  description: string;
  price: number;
  image: string;
  gallery: string[];
  category: string; // category slug/ID standard e.g. 'beauty'
  rating: number;
  reviewsCount: number;
  details: string[];
  specs: Record<string, string>;
  isSpotlight: boolean;
  stock: number;
  status: string; // 'Active' or 'Inactive'
  sku: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  category: { type: String, required: true, index: true },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  details: [{ type: String }],
  specs: { type: Schema.Types.Mixed, default: {} },
  isSpotlight: { type: Boolean, default: false },
  stock: { type: Number, required: true, default: 15, min: 0 },
  status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] },
  sku: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { collection: "products" });

// --- REVIEWS SCHEMA CONFIG ---
export interface IReview {
  productId: string; // matches product custom id string
  userId?: string; // MongoDB ObjectId of user as string
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  productId: { type: String, required: true, index: true },
  userId: { type: String },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// --- ORDERS SCHEMA CONFIG ---
export interface IOrder {
  orderId: string; // legible custom text e.g. RGL-12345
  userId?: string; // optional linked logged-in user
  email: string;
  name: string;
  items: Array<{
    id: string; // product custom id
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  paymentId?: string; // Stripe PaymentIntent or custom reference
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, index: true },
  email: { type: String, required: true, index: true },
  name: { type: String, required: true },
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  trackingNumber: { type: String, default: "" },
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: "orders" });

// --- PAYMENTS SCHEMA CONFIG ---
export interface IPayment {
  paymentId: string; // e.g. Stripe PaymentIntent ID
  orderId: string;
  email: string;
  name: string;
  amount: number;
  currency: string;
  method: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  receiptUrl?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  paymentId: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  name: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  method: { type: String, default: 'Credit Card' },
  status: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  receiptUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// --- NEWSLETTER SUBSCRIBERS SCHEMA CONFIG ---
export interface INewsletterSubscriber {
  email: string;
  status: 'Active' | 'Unsubscribed';
  subscribedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['Active', 'Unsubscribed'], default: 'Active' },
  subscribedAt: { type: Date, default: Date.now }
}, { collection: "newsletter" });

// --- CONTACT MESSAGES SCHEMA CONFIG ---
export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: "General Query" },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

// --- COUPONS SCHEMA CONFIG ---
export interface ICoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
  expiryDate?: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  active: { type: Boolean, default: true },
  expiryDate: { type: Date }
});

// Compile Models with loose typings for query-compatibility bounds
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { PRODUCTS, CATEGORIES } from "../data";

const DB_FILE = path.join(process.cwd(), "local_storage_db.json");

function getLocalDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Local DB read error:", e);
  }

  // Pre-seed with default elements to ensure website content works immediately without MongoDB setup!
  const defaultAdminPassword = bcrypt.hashSync("Admin123!", 10);
  const defaultUsers = [
    {
      _id: "mock_bhargav",
      firstName: "Admin",
      lastName: "Sovereign",
      fullName: "Admin Sovereign",
      email: "bhargavbor597@gmail.com",
      password: defaultAdminPassword,
      role: "Admin",
      isVerified: true,
      signupDate: new Date().toISOString(),
      cart: []
    }
  ];

  const db = {
    users: defaultUsers,
    categories: CATEGORIES,
    products: PRODUCTS,
    reviews: [],
    orders: [],
    payments: [],
    subscribers: [],
    messages: [],
    coupons: []
  };

  saveLocalDB(db);
  return db;
}

function saveLocalDB(db: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Local DB write error:", e);
  }
}

class MockQuery {
  private results: any[];
  private wrapDocFn: (doc: any) => any;

  constructor(results: any[], wrapDocFn: (doc: any) => any) {
    this.results = results;
    this.wrapDocFn = wrapDocFn;
  }

  sort(criteria: any) {
    if (typeof criteria === 'object') {
      const field = Object.keys(criteria)[0];
      const dir = criteria[field];
      this.results.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();
        if (valA === valB) return 0;
        if (dir === -1) {
          return valA > valB ? -1 : 1;
        } else {
          return valA > valB ? 1 : -1;
        }
      });
    } else if (typeof criteria === 'string') {
      let field = criteria;
      let dir = 1;
      if (criteria.startsWith('-')) {
        field = criteria.substring(1);
        dir = -1;
      }
      this.results.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();
        if (valA === valB) return 0;
        if (dir === -1) {
          return valA > valB ? -1 : 1;
        } else {
          return valA > valB ? 1 : -1;
        }
      });
    }
    return this;
  }

  limit(count: number) {
    this.results = this.results.slice(0, count);
    return this;
  }

  select(fields: string) {
    return this;
  }

  populate(arg: any) {
    return this;
  }

  lean() {
    return this;
  }

  async exec() {
    return this.results.map(item => this.wrapDocFn(item));
  }

  then(onfulfilled?: any, onrejected?: any) {
    const wrapped = this.results.map(item => this.wrapDocFn(item));
    return Promise.resolve(wrapped).then(onfulfilled, onrejected);
  }
}

class MockModel {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private getCollection(): any[] {
    const db = getLocalDB();
    return db[this.collectionName] || [];
  }

  private saveCollection(items: any[]) {
    const db = getLocalDB();
    db[this.collectionName] = items;
    saveLocalDB(db);
  }

  wrapDoc(doc: any) {
    if (!doc) return doc;
    if (Object.prototype.hasOwnProperty.call(doc, 'save')) return doc;

    const self = this;
    Object.defineProperty(doc, 'save', {
      value: async function() {
        const items = self.getCollection();
        const index = items.findIndex(u => 
          String(u._id) === String(doc._id) || 
          (doc.id && String(u.id) === String(doc.id))
        );
        if (index !== -1) {
          const toSave = { ...doc };
          delete toSave.save;
          items[index] = toSave;
          self.saveCollection(items);
        }
        return doc;
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
    return doc;
  }

  async countDocuments(filter: any = {}) {
    const list = await this.find(filter).exec();
    return list.length;
  }

  find(filter: any = {}) {
    const items = this.getCollection();
    let results = [...items];

    // Handle filter properties
    if (filter && typeof filter === 'object' && Object.keys(filter).length > 0) {
      results = results.filter(item => {
        for (const key in filter) {
          if (key.startsWith('$')) continue; // skip operators
          const val = filter[key];
          if (val && typeof val === 'object') {
            if ('$gte' in val || '$lte' in val) {
              const itemDate = new Date(item[key]);
              if ('$gte' in val && itemDate < new Date(val.$gte)) return false;
              if ('$lte' in val && itemDate > new Date(val.$lte)) return false;
            } else if ('$lte' in val) {
              if (item[key] > val.$lte) return false;
            }
          } else {
            // standard equality
            if (String(item[key]).toLowerCase() !== String(val).toLowerCase()) return false;
          }
        }
        return true;
      });
    }

    return new MockQuery(results, (doc) => this.wrapDoc(doc));
  }

  async findOne(filter: any = {}) {
    const results = await this.find(filter).exec();
    return results[0] || null;
  }

  async findById(id: string) {
    const items = this.getCollection();
    const found = items.find(u => String(u._id) === String(id) || String(u.id) === String(id));
    return this.wrapDoc(found);
  }

  async create(doc: any) {
    const items = this.getCollection();
    const newDoc = {
      _id: doc._id || 'mock_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    this.saveCollection(items);
    return this.wrapDoc(newDoc);
  }

  async insertMany(docs: any[]) {
    const items = this.getCollection();
    const seeded = docs.map(doc => ({
      _id: doc._id || 'mock_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...doc
    }));
    items.push(...seeded);
    this.saveCollection(items);
    return seeded.map(doc => this.wrapDoc(doc));
  }

  async findByIdAndUpdate(id: string, update: any, options: any = {}) {
    const items = this.getCollection();
    const index = items.findIndex(u => String(u._id) === String(id) || String(u.id) === String(id));
    if (index === -1) return null;

    const current = items[index];
    const updated = { ...current };
    const setObj = update.$set || update;

    for (const key in setObj) {
      if (key === 'cart') {
        updated.cart = setObj.cart;
      } else {
        updated[key] = setObj[key];
      }
    }

    items[index] = updated;
    this.saveCollection(items);
    return this.wrapDoc(updated);
  }

  async findOneAndUpdate(filter: any, update: any, options: any = {}) {
    const found = await this.findOne(filter);
    if (!found) return null;
    return this.findByIdAndUpdate(found._id || found.id, update, options);
  }

  async findOneAndDelete(filter: any) {
    const found = await this.findOne(filter);
    if (!found) return null;
    const items = this.getCollection();
    const remaining = items.filter(u => String(u._id) !== String(found._id) && String(u.id) !== String(found.id));
    this.saveCollection(remaining);
    return found;
  }

  async findByIdAndDelete(id: string) {
    const found = await this.findById(id);
    if (!found) return null;
    const items = this.getCollection();
    const remaining = items.filter(u => String(u._id) !== String(id) && String(u.id) !== String(id));
    this.saveCollection(remaining);
    return found;
  }

  async deleteMany(filter: any = {}) {
    if (!filter || Object.keys(filter).length === 0) {
      this.saveCollection([]);
      return { deletedCount: 0 };
    }
    const items = this.getCollection();
    const filtered = items.filter(item => {
      for (const key in filter) {
        if (String(item[key]).toLowerCase() === String(filter[key]).toLowerCase()) return false;
      }
      return true;
    });
    this.saveCollection(filtered);
    return { deletedCount: items.length - filtered.length };
  }
}

class MongoFallbackModel {
  private collectionName: string;
  private mongooseModel: any;
  private mockModel: MockModel;

  constructor(collectionName: string, mongooseModel: any) {
    this.collectionName = collectionName;
    this.mongooseModel = mongooseModel;
    this.mockModel = new MockModel(collectionName);
  }

  private getActiveModel() {
    if ((global as any).useMockDb) {
      return this.mockModel;
    }
    return this.mongooseModel;
  }

  async countDocuments(filter: any = {}) {
    return this.getActiveModel().countDocuments(filter);
  }

  find(filter: any = {}) {
    return this.getActiveModel().find(filter);
  }

  findOne(filter: any = {}) {
    return this.getActiveModel().findOne(filter);
  }

  findById(id: string) {
    return this.getActiveModel().findById(id);
  }

  create(doc: any) {
    return this.getActiveModel().create(doc);
  }

  insertMany(docs: any[]) {
    return this.getActiveModel().insertMany(docs);
  }

  findByIdAndUpdate(id: string, update: any, options: any = {}) {
    return this.getActiveModel().findByIdAndUpdate(id, update, options);
  }

  findOneAndUpdate(filter: any, update: any, options: any = {}) {
    return this.getActiveModel().findOneAndUpdate(filter, update, options);
  }

  findOneAndDelete(filter: any) {
    return this.getActiveModel().findOneAndDelete(filter);
  }

  findByIdAndDelete(id: string) {
    return this.getActiveModel().findByIdAndDelete(id);
  }

  deleteMany(filter: any = {}) {
    return this.getActiveModel().deleteMany(filter);
  }
}

const isMongoConfigured = !!process.env.MONGO_URI;

const mongooseUser = (mongoose.models.User || mongoose.model<IUser>("User", UserSchema)) as any;
const mongooseCategory = (mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)) as any;
const mongooseProduct = (mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)) as any;
const mongooseReview = (mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)) as any;
const mongooseOrder = (mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)) as any;
const mongoosePayment = (mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)) as any;
const mongooseNewsletterSubscriber = (mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema)) as any;
const mongooseContactMessage = (mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema)) as any;
const mongooseCoupon = (mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema)) as any;

export const User = new MongoFallbackModel("users", mongooseUser) as any;
export const Category = new MongoFallbackModel("categories", mongooseCategory) as any;
export const Product = new MongoFallbackModel("products", mongooseProduct) as any;
export const Review = new MongoFallbackModel("reviews", mongooseReview) as any;
export const Order = new MongoFallbackModel("orders", mongooseOrder) as any;
export const Payment = new MongoFallbackModel("payments", mongoosePayment) as any;
export const NewsletterSubscriber = new MongoFallbackModel("newsletter", mongooseNewsletterSubscriber) as any;
export const ContactMessage = new MongoFallbackModel("messages", mongooseContactMessage) as any;
export const Coupon = new MongoFallbackModel("coupons", mongooseCoupon) as any;

