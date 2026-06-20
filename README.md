# Regal Box - High-End Curated Luxury E-Commerce Platform

Regal Box is an exquisite, high-end, full-stack e-commerce platform designed for curated luxury gift boxes and fine desk accessories. Styled with a sophisticated royal blue and deep navy aesthetic, it pairs meticulously designed modern front-end layouts with a highly reliable and secure Node.js + Express backend.

---

## 🎨 Design Theme & Core Visuals

- **Aesthetic Pairings**: Pristine, high-contrast dark-mode and light-mode interfaces combining deep corporate navy shades (`bg-slate-900`/`bg-slate-950`) with rich regal blue accent borders (`border-blue-700`/`bg-blue-600`), and golden/slate trim detailing.
- **Micro-Animations**: Uses `motion/react` to provide fluid, responsive transition states for drawer triggers, catalog sliding, checkout confirmation, and custom back-office panels.
- **Premium Experience**: Designed to embody a boutique atelier feel, emphasizing spacious headers, high-fidelity gallery-style product displays, inline detail sheets, and beautiful typography.

---

## 🚀 Key Features

### 🛒 High-Fidelity Storefront & Cart Dynamics
- **Curated Catalog**: Filterable layouts containing artisan and luxury accessories (such as sovereign wool trench coats, skeleton watch models, fine desk utilities).
- **Interactive Cart**: Pop-out slide drawer with real-time tax calculation, dynamic coupon code deductions, and total tallies.
- **Product Review System**: Fully validated, user-authenticated review portal supporting 5-star ratings and individual comment threads.

### 💳 Secure Payment Core (Stripe-Integrated)
- **Production-Grade Stripe Elements Core**: Directly integrated with the Stripe Node.js API client for secure `PaymentIntent` processing.
- **Fail-safe Simulation Engine**: If no valid `STRIPE_SECRET_KEY` is present, the server executes a perfect mock-payment checkout sequence so that testing and preview sandboxes remain fully usable.
- **Order & Payments Persistence**: Places orders directly into a structured MongoDB Atlas database, logging payment indicators, customer details, exact lists of purchase items, values, and fulfillment states.

### 📊 Comprehensive Back-Office Administrator Dashboard
- **Telemetry Charts**: Interactive `recharts` graphs plotting real-time orders, dynamic sales trends, and daily checkout counts.
- **Inventory Control Matrix**: Interactive portal allowing immediate creation, updating, or deletion of luxury products and categories in the database.
- **Fulfillment Operations Manager**: View customer orders, transition fulfillment statuses (e.g., "Processing", "Shipped", "Delivered"), and edit carrier tracking numbers.

---

## 🛠️ Technology Stack

- **Frontend**: React (v18+), Vite, Tailwind CSS, Lucide Icons, Recharts, Motion (Animate)
- **Backend**: Node.js, Express, TypeScript (transpiled natively)
- **Database**: Mongoose (ODM), MongoDB Atlas (Cloud Database)
- **Payment Gateway**: Stripe SDK
- **Asset Storage**: Cloudinary (Optional, for fast image deliveries)

---

## 🔑 Environment Variables

To operate the Regal Box platform, establish a `.env` file in the project root containing the following configurations. Use `.env.example` as a template:

```env
# Gemini AI integration key (Auto-loaded on server side)
GEMINI_API_KEY="your-gemini-api-key"

# App public hosting URL (Used for base URL calculations)
APP_URL="http://localhost:3000"

# Stripe Developer keys
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# MongoDB Atlas cluster connection string
MONGO_URI="mongodb+srv://<username>:<password>@cluster0...mongodb.net/?appName=Cluster0"

# Token signature secret for Session JWTs
JWT_SECRET="your-highly-secure-jwt-secret-string"

# Cloudinary Integration (For uploading custom product imagery)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 💻 Installation & Local Development

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd regal-box
```

### 2. Install Project Dependencies
This project uses a unified package standard in which Vite handles frontend bundlings, and the Express code layer compiles through structured development and build modes.
```bash
npm install
```

### 3. Create Local Configurations
Duplicate the supplied `.env.example` file and supply the respective credentials:
```bash
cp .env.example .env
```

### 4. Boot Up the Development Server
This boots up the local TypeScript compiler environment, executing the backend server on incoming **Port 3000** and activating full-stack Vite route forwardings.
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the application.

### 5. Build for Production Execution
To test a production-grade bundle before continuous integration deploys, compile client-side and backend servers natively using:
```bash
npm run build
```
Once build succeeds, run the local cluster using the native production server runner:
```bash
npm start
```

---

## 🌐 Deploys onto Cloud Hosting (e.g. Google Cloud Run)

This containerized workspace is designed for standard, one-click continuous delivery:

1. **Containers**: The framework is pre-configured to bind specifically to host interface `0.0.0.0` on Port `3000`, matching Google Cloud Run, AWS App Runner, and standard Docker specs.
2. **Environment variables**: Supply production credentials (`MONGO_URI`, `STRIPE_SECRET_KEY`, etc.) as Cloud Run Secrets or Secure Environment Variables. Do not inject `.env` files into source control.

---

## 📊 Git Commands to Push to GitHub

Prepare your repository and upload your files to empty secure repositories on GitHub:

```bash
# 1. Initialize a new Git repository (if not already initiated)
git init

# 2. Stage all audited source files (respects custom .gitignore)
git add .

# 3. Create your initial commit
git commit -m "feat: complete luxury ordering system and MongoDB Atlas integrations"

# 4. Create main main branch
git branch -M main

# 5. Link to your target GitHub repository
git remote add origin <your-github-repo-url-here>

# 6. Push code to the Remote main branch
git push -u origin main
```
