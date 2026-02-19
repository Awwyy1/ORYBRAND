import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/api/payments/create-intent', (req, res) => {
  const { amount, currency = 'usd', cardNumber } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const cleanCard = (cardNumber || '').replace(/\s/g, '');
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

app.post('/api/orders', (req, res) => {
  const { items, customer: customerInfo, paymentIntentId } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'No items in order' });
  }
  if (!customerInfo?.email) {
    return res.status(400).json({ error: 'Customer email required' });
  }

  // Validate stock
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
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
  const customer = findOrCreateCustomer(
    customerInfo.email,
    customerInfo.firstName,
    customerInfo.lastName
  );

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
    paymentIntentId: paymentIntentId || null,
    status: 'confirmed',
    shippingAddress: {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      address: customerInfo.address,
      city: customerInfo.city,
      zip: customerInfo.zip,
      country: customerInfo.country,
    },
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

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
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
  console.log(`Mock Stripe test cards:`);
  console.log(`  4242 4242 4242 4242 — Success (Visa)`);
  console.log(`  5555 5555 5555 4444 — Success (Mastercard)`);
  console.log(`  4000 0000 0000 9995 — Fail (Insufficient funds)`);
  console.log(`  4000 0000 0000 0002 — Fail (Card declined)`);
});
