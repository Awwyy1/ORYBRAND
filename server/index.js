import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// ─── H17: SECURITY HEADERS ─────────────────────────────────────────
app.use((_req, res, next) => {
  // HSTS — enforce HTTPS for 1 year, include subdomains
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // CSP — restrict resource origins
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://images.unsplash.com https://*.unsplash.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '));
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy — disable unneeded browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  next();
});

// HTTPS redirect (in production behind a proxy, check X-Forwarded-Proto)
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }
  next();
});

// ─── H19: RATE LIMITING ────────────────────────────────────────────

const rateLimitStore = new Map();

function rateLimit({ windowMs = 60_000, max = 60, message = 'Too many requests' } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = rateLimitStore.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      entry = { windowStart: now, count: 0 };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((entry.windowStart + windowMs) / 1000));

    if (entry.count > max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((entry.windowStart + windowMs - now) / 1000),
      });
    }

    next();
  };
}

// Cleanup stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > 120_000) {
      rateLimitStore.delete(key);
    }
  }
}, 300_000);

// Global rate limit: 120 req/min per IP
app.use('/api/', rateLimit({ windowMs: 60_000, max: 120, message: 'Global rate limit exceeded' }));

// Stricter limits for sensitive endpoints
const paymentLimiter = rateLimit({ windowMs: 60_000, max: 10, message: 'Too many payment attempts. Please slow down.' });
const newsletterLimiter = rateLimit({ windowMs: 60_000, max: 5, message: 'Too many subscription attempts.' });
const orderLimiter = rateLimit({ windowMs: 60_000, max: 10, message: 'Too many order attempts.' });

// ─── H18: INPUT SANITIZATION HELPER ────────────────────────────────

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')          // strip angle brackets (XSS)
    .replace(/javascript:/gi, '')   // strip JS protocol
    .replace(/on\w+=/gi, '')        // strip inline event handlers
    .trim()
    .slice(0, 500);                 // hard length cap
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
}

function validateCardNumber(card) {
  if (!card || typeof card !== 'string') return false;
  const digits = card.replace(/\s/g, '');
  return /^\d{13,19}$/.test(digits);
}

// ─── In-Memory Database ───────────────────────────────────────────

const db = {
  products: [
    { id: 'stealth', name: 'Ory Stealth', price: 85, stock: { S: 50, M: 100, L: 80, XL: 40 } },
    { id: 'carbon',  name: 'Ory Carbon',  price: 95, stock: { S: 30, M: 60,  L: 50, XL: 25 } },
    { id: 'ice',     name: 'Ory Ice',     price: 85, stock: { S: 45, M: 90,  L: 70, XL: 35 } },
    { id: 'midnight',name: 'Ory Midnight', price: 110, stock: { S: 20, M: 40, L: 30, XL: 15 } },
  ],
  orders: [],
  customers: [],
  emails: [],
  newsletter: [],
};

// ─── INVENTORY ────────────────────────────────────────────────────

app.get('/api/inventory', (_req, res) => {
  res.json(db.products);
});

app.get('/api/inventory/:productId', (req, res) => {
  const product = db.products.find(p => p.id === req.params.productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// ─── CUSTOMERS ────────────────────────────────────────────────────

app.get('/api/customers', (_req, res) => {
  res.json(db.customers);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = db.customers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

function findOrCreateCustomer(email, firstName, lastName) {
  let customer = db.customers.find(c => c.email === email);
  if (!customer) {
    customer = {
      id: randomUUID(),
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      orderCount: 0,
      totalSpent: 0,
    };
    db.customers.push(customer);
  }
  return customer;
}

// ─── MOCK STRIPE PAYMENT ─────────────────────────────────────────

const STRIPE_TEST_CARDS = {
  '4242424242424242': { status: 'succeeded', brand: 'visa' },
  '4000056655665556': { status: 'succeeded', brand: 'visa_debit' },
  '5555555555554444': { status: 'succeeded', brand: 'mastercard' },
  '5200828282828210': { status: 'succeeded', brand: 'mastercard_debit' },
  '4000000000009995': { status: 'failed', error: 'insufficient_funds' },
  '4000000000000002': { status: 'failed', error: 'card_declined' },
  '4000000000009979': { status: 'failed', error: 'stolen_card' },
};

app.post('/api/payments/create-intent', paymentLimiter, (req, res) => {
  const { amount, currency = 'usd', cardNumber } = req.body;

  // H18: Validate inputs
  if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 100000) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const cleanCard = sanitize(cardNumber || '').replace(/\s/g, '');
  if (!validateCardNumber(cleanCard)) {
    return res.status(400).json({ error: 'Invalid card number' });
  }

  const cardResult = STRIPE_TEST_CARDS[cleanCard];

  // Simulate 1-2s processing delay
  const delay = 1000 + Math.random() * 1000;

  setTimeout(() => {
    if (cardResult && cardResult.status === 'failed') {
      return res.json({
        id: `pi_mock_${randomUUID().slice(0, 8)}`,
        status: 'failed',
        error: cardResult.error,
        amount,
        currency,
      });
    }

    res.json({
      id: `pi_mock_${randomUUID().slice(0, 8)}`,
      status: 'succeeded',
      amount,
      currency,
      brand: cardResult?.brand || 'unknown',
      last4: cleanCard.slice(-4) || '0000',
      created: Date.now(),
    });
  }, delay);
});

// ─── ORDERS ───────────────────────────────────────────────────────

app.get('/api/orders', (_req, res) => {
  res.json(db.orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', orderLimiter, (req, res) => {
  const { items, customer: customerInfo, paymentIntentId } = req.body;

  // H18: Validate items
  if (!items || !Array.isArray(items) || items.length === 0 || items.length > 20) {
    return res.status(400).json({ error: 'Invalid items (1-20 items required)' });
  }

  // H18: Validate customer info
  if (!customerInfo || typeof customerInfo !== 'object') {
    return res.status(400).json({ error: 'Customer info required' });
  }

  const email = sanitize(customerInfo.email || '');
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const firstName = sanitize(customerInfo.firstName || '');
  const lastName = sanitize(customerInfo.lastName || '');
  const address = sanitize(customerInfo.address || '');
  const city = sanitize(customerInfo.city || '');
  const zip = sanitize(customerInfo.zip || '');
  const country = sanitize(customerInfo.country || '');

  if (!firstName || !lastName || !address || !city || !zip || !country) {
    return res.status(400).json({ error: 'All shipping fields required' });
  }

  // Validate each item
  const validSizes = ['S', 'M', 'L', 'XL'];
  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    if (!validSizes.includes(item.size)) {
      return res.status(400).json({ error: `Invalid size: ${item.size}` });
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 10) {
      return res.status(400).json({ error: 'Invalid quantity (1-10)' });
    }
  }

  // Validate stock
  for (const item of items) {
    const product = db.products.find(p => p.id === sanitize(item.productId));
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock[item.size] < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for ${product.name} size ${item.size}`,
        available: product.stock[item.size],
      });
    }
  }

  // Deduct stock
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    product.stock[item.size] -= item.quantity;
  }

  // Find or create customer
  const customer = findOrCreateCustomer(email, firstName, lastName);

  // Calculate total
  const total = items.reduce((sum, item) => {
    const product = db.products.find(p => p.id === item.productId);
    return sum + (product.price * item.quantity);
  }, 0);

  // Create order
  const order = {
    id: `ORY-${Date.now().toString(36).toUpperCase()}`,
    customerId: customer.id,
    customerEmail: customer.email,
    items: items.map(item => {
      const product = db.products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.price,
        total: product.price * item.quantity,
      };
    }),
    subtotal: total,
    shipping: 0,
    total,
    paymentIntentId: paymentIntentId ? sanitize(paymentIntentId) : null,
    status: 'confirmed',
    shippingAddress: { firstName, lastName, address, city, zip, country },
    trackingNumber: `ORY${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  db.orders.push(order);

  // Update customer stats
  customer.orderCount += 1;
  customer.totalSpent += total;

  // Send mock confirmation email
  sendMockEmail({
    to: customer.email,
    type: 'order_confirmation',
    subject: `ORY Order Confirmed — ${order.id}`,
    orderId: order.id,
    items: order.items,
    total: order.total,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    shippingAddress: order.shippingAddress,
  });

  // Schedule mock shipping email (3 seconds later for demo)
  setTimeout(() => {
    sendMockEmail({
      to: customer.email,
      type: 'shipping_notification',
      subject: `Your ORY Order ${order.id} Has Shipped`,
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      carrier: 'DHL Express',
    });

    // Update order status
    order.status = 'shipped';
  }, 3000);

  res.status(201).json(order);
});

// ─── MOCK EMAIL SERVICE ───────────────────────────────────────────

function sendMockEmail(emailData) {
  const email = {
    id: randomUUID(),
    ...emailData,
    sentAt: new Date().toISOString(),
    delivered: true,
  };
  db.emails.push(email);
  console.log(`[EMAIL] ${email.type} → ${email.to}: ${email.subject}`);
  return email;
}

app.get('/api/emails', (_req, res) => {
  res.json(db.emails);
});

app.get('/api/emails/:orderId', (req, res) => {
  const emails = db.emails.filter(e => e.orderId === req.params.orderId);
  res.json(emails);
});

// ─── NEWSLETTER ───────────────────────────────────────────────────

app.post('/api/newsletter', newsletterLimiter, (req, res) => {
  const email = sanitize(req.body?.email || '');

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const exists = db.newsletter.find(n => n.email === email);
  if (exists) {
    return res.status(409).json({ error: 'Already subscribed' });
  }

  const subscriber = {
    id: randomUUID(),
    email,
    subscribedAt: new Date().toISOString(),
  };
  db.newsletter.push(subscriber);

  console.log(`[NEWSLETTER] New subscriber: ${email}`);

  // Send welcome email
  sendMockEmail({
    to: email,
    type: 'newsletter_welcome',
    subject: 'Welcome to ORY — You\'re In',
    orderId: null,
  });

  res.status(201).json({ message: 'Subscribed successfully' });
});

app.get('/api/newsletter', (_req, res) => {
  res.json(db.newsletter);
});

// ─── ADMIN / STATS ───────────────────────────────────────────────

app.get('/api/stats', (_req, res) => {
  const totalRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = db.orders.length;
  const totalCustomers = db.customers.length;
  const totalItemsSold = db.orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0
  );

  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalItemsSold,
    topProducts: db.products.map(p => ({
      id: p.id,
      name: p.name,
      remainingStock: Object.values(p.stock).reduce((a, b) => a + b, 0),
    })),
  });
});

// ─── START ────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ORY Backend running on port ${PORT}`);
  console.log(`Security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options`);
  console.log(`Rate limiting: 120/min global, 10/min payments, 5/min newsletter`);
  console.log(`Mock Stripe test cards:`);
  console.log(`  4242 4242 4242 4242 — Success (Visa)`);
  console.log(`  5555 5555 5555 4444 — Success (Mastercard)`);
  console.log(`  4000 0000 0000 9995 — Fail (Insufficient funds)`);
  console.log(`  4000 0000 0000 0002 — Fail (Card declined)`);
});
