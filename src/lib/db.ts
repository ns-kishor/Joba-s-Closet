/**
 * In-Memory Demo Database for Joba's Closet.
 * Provides full mock persistence for Users, Sessions, and Orders on serverless (Vercel)
 * without requiring any external database service (Supabase/Neon/PostgreSQL).
 */

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionRecord = {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  user?: UserRecord;
};

export type OrderItemRecord = {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

export type OrderRecord = {
  id: string;
  userId: string | null;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  note: string | null;
  zone: string;
  payment: string;
  status: string;
  subtotal: number;
  delivery: number;
  total: number;
  createdAt: Date;
  items: OrderItemRecord[];
};

// Global memory stores that persist across warm lambda calls
const globalForStore = globalThis as unknown as {
  __demoUsers?: Map<string, UserRecord>;
  __demoSessions?: Map<string, SessionRecord>;
  __demoOrders?: Map<string, OrderRecord>;
};

if (!globalForStore.__demoUsers) {
  globalForStore.__demoUsers = new Map<string, UserRecord>();
}
if (!globalForStore.__demoSessions) {
  globalForStore.__demoSessions = new Map<string, SessionRecord>();
}
if (!globalForStore.__demoOrders) {
  globalForStore.__demoOrders = new Map<string, OrderRecord>();
}

const users = globalForStore.__demoUsers;
const sessions = globalForStore.__demoSessions;
const orders = globalForStore.__demoOrders;

// Pre-seed Demo User and realistic sample orders if not already initialized
const DEMO_USER_ID = "usr_demo_jc";
if (!users.has(DEMO_USER_ID)) {
  const demoUser: UserRecord = {
    id: DEMO_USER_ID,
    name: "Nusrat Jahan",
    email: "demo@jobascloset.com",
    phone: "01712345678",
    // Precalculated hash or marker verified in auth-server
    passwordHash: "DEMO_USER_HASH",
    createdAt: new Date("2026-08-15T10:00:00.000Z"),
    updatedAt: new Date(),
  };
  users.set(DEMO_USER_ID, demoUser);

  // Pre-seed realistic past orders for demonstration
  const sampleOrder1: OrderRecord = {
    id: "JC-8K3N7R",
    userId: DEMO_USER_ID,
    customerName: "Nusrat Jahan",
    phone: "01712345678",
    email: "demo@jobascloset.com",
    address: "House 24, Road 7, Dhanmondi",
    city: "Dhaka",
    note: "Please call before delivery",
    zone: "inside",
    payment: "cod",
    status: "Delivered",
    subtotal: 1450,
    delivery: 70,
    total: 1520,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    items: [
      {
        id: "item_demo_1",
        orderId: "JC-8K3N7R",
        productId: "necklace",
        name: "Royal Pearl Choker & Pendant",
        price: 1450,
        qty: 1,
        image: "/images/products/necklace-1.jpg",
      },
    ],
  };

  const sampleOrder2: OrderRecord = {
    id: "JC-4F2P9W",
    userId: DEMO_USER_ID,
    customerName: "Nusrat Jahan",
    phone: "01712345678",
    email: "demo@jobascloset.com",
    address: "House 24, Road 7, Dhanmondi",
    city: "Dhaka",
    note: null,
    zone: "inside",
    payment: "cod",
    status: "Processing",
    subtotal: 700,
    delivery: 70,
    total: 770,
    createdAt: new Date(Date.now() - 18 * 3600 * 1000),
    items: [
      {
        id: "item_demo_2",
        orderId: "JC-4F2P9W",
        productId: "scrunchie",
        name: "Silk Velvet Scrunchie Set (Pack of 3)",
        price: 350,
        qty: 2,
        image: "/images/products/scrunchie-1.jpg",
      },
    ],
  };

  orders.set(sampleOrder1.id, sampleOrder1);
  orders.set(sampleOrder2.id, sampleOrder2);
}

export const db = {
  user: {
    async findUnique(args: { where: { email?: string; id?: string } }): Promise<UserRecord | null> {
      if (args.where.id) {
        return users.get(args.where.id) ?? null;
      }
      if (args.where.email) {
        const query = args.where.email.toLowerCase().trim();
        for (const u of users.values()) {
          if (u.email.toLowerCase() === query) return u;
        }
      }
      return null;
    },

    async create(args: {
      data: { name: string; email: string; phone?: string | null; passwordHash: string };
    }): Promise<UserRecord> {
      const email = args.data.email.toLowerCase().trim();
      const id = "usr_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const user: UserRecord = {
        id,
        name: args.data.name,
        email,
        phone: args.data.phone || null,
        passwordHash: args.data.passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.set(id, user);
      return user;
    },

    async update(args: {
      where: { id: string };
      data: { name?: string; phone?: string | null; passwordHash?: string };
    }): Promise<UserRecord> {
      const user = users.get(args.where.id);
      if (!user) {
        throw new Error("User not found");
      }
      if (args.data.name !== undefined) user.name = args.data.name;
      if (args.data.phone !== undefined) user.phone = args.data.phone;
      if (args.data.passwordHash !== undefined) user.passwordHash = args.data.passwordHash;
      user.updatedAt = new Date();
      users.set(user.id, user);
      return user;
    },
  },

  session: {
    async create(args: {
      data: { id: string; userId: string; expiresAt: Date };
    }): Promise<SessionRecord> {
      const session: SessionRecord = {
        id: args.data.id,
        userId: args.data.userId,
        expiresAt: args.data.expiresAt,
        createdAt: new Date(),
      };
      sessions.set(session.id, session);
      return session;
    },

    async findUnique(args: {
      where: { id: string };
      include?: { user?: boolean };
    }): Promise<(SessionRecord & { user: UserRecord }) | null> {
      const s = sessions.get(args.where.id);
      if (!s) return null;
      const user = users.get(s.userId);
      if (!user) return null;
      return { ...s, user };
    },

    async delete(args: { where: { id: string } }): Promise<void> {
      sessions.delete(args.where.id);
    },

    async deleteMany(args?: {
      where?: {
        expiresAt?: { lt: Date };
        userId?: string;
        id?: { not: string };
      };
    }): Promise<{ count: number }> {
      let count = 0;
      if (!args?.where) {
        count = sessions.size;
        sessions.clear();
        return { count };
      }
      const { expiresAt, userId, id } = args.where;
      for (const [key, s] of sessions.entries()) {
        let match = true;
        if (expiresAt?.lt && s.expiresAt >= expiresAt.lt) match = false;
        if (userId && s.userId !== userId) match = false;
        if (id?.not && s.id === id.not) match = false;

        if (match) {
          sessions.delete(key);
          count++;
        }
      }
      return { count };
    },
  },

  order: {
    async create(args: {
      data: {
        id: string;
        userId?: string | null;
        customerName: string;
        phone: string;
        email?: string | null;
        address: string;
        city: string;
        note?: string | null;
        zone: string;
        payment?: string;
        status?: string;
        subtotal: number;
        delivery: number;
        total: number;
        items: {
          create: Array<{
            productId: string;
            name: string;
            price: number;
            qty: number;
            image: string;
          }>;
        };
      };
      include?: { items?: boolean };
    }): Promise<OrderRecord> {
      const items: OrderItemRecord[] = args.data.items.create.map((it, idx) => ({
        id: `item_${args.data.id}_${idx + 1}`,
        orderId: args.data.id,
        productId: it.productId,
        name: it.name,
        price: it.price,
        qty: it.qty,
        image: it.image,
      }));

      const order: OrderRecord = {
        id: args.data.id,
        userId: args.data.userId || null,
        customerName: args.data.customerName,
        phone: args.data.phone,
        email: args.data.email || null,
        address: args.data.address,
        city: args.data.city,
        note: args.data.note || null,
        zone: args.data.zone,
        payment: args.data.payment || "cod",
        status: args.data.status || "confirmed",
        subtotal: args.data.subtotal,
        delivery: args.data.delivery,
        total: args.data.total,
        createdAt: new Date(),
        items,
      };

      orders.set(order.id, order);
      return order;
    },

    async findUnique(args: {
      where: { id: string };
      include?: { items?: boolean };
    }): Promise<OrderRecord | null> {
      const targetId = args.where.id.toUpperCase();
      for (const [key, o] of orders.entries()) {
        if (key.toUpperCase() === targetId) return o;
      }
      return null;
    },

    async findMany(args?: {
      where?: { userId?: string };
      orderBy?: { createdAt?: "desc" | "asc" };
      include?: { items?: boolean };
    }): Promise<OrderRecord[]> {
      const list: OrderRecord[] = [];
      for (const o of orders.values()) {
        if (!args?.where?.userId || o.userId === args.where.userId) {
          list.push(o);
        }
      }
      list.sort((a, b) => {
        const order = args?.orderBy?.createdAt === "asc" ? 1 : -1;
        return (a.createdAt.getTime() - b.createdAt.getTime()) * order;
      });
      return list;
    },
  },
};