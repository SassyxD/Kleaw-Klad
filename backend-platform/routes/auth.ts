import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import type { APIResponse, User, JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_for_development_only_change_in_production_minimum_32';

// Mock users database (replace with real database)
const users: Map<string, User & { password: string }> = new Map([
  ['client@demo.com', {
    id: '1',
    email: 'client@demo.com',
    password: 'password', // In production, use hashed passwords
    name: 'Demo Client',
    role: 'client',
    createdAt: new Date(),
  }],
  ['operator@hatyai.gov', {
    id: '2',
    email: 'operator@hatyai.gov',
    password: 'password',
    name: 'Emergency Operator',
    role: 'operator',
    createdAt: new Date(),
  }],
  ['admin@hatyai.gov', {
    id: '3',
    email: 'admin@hatyai.gov',
    password: 'password',
    name: 'System Administrator',
    role: 'admin',
    createdAt: new Date(),
  }],
]);

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwt({
    name: 'jwt',
    secret: JWT_SECRET,
  }))
  .post('/login', async ({ body, jwt }) => {
    const { email, password, role } = body as { email: string; password: string; role: string };

    const user = users.get(email);

    if (!user || user.password !== password) {
      return {
        success: false,
        error: {
          code: 'AUTH_001',
          message: 'Invalid credentials',
        },
      } as APIResponse;
    }

    // Check if user role matches requested role
    if (user.role !== role && user.role !== 'admin') {
      return {
        success: false,
        error: {
          code: 'AUTH_003',
          message: 'Insufficient permissions',
        },
      } as APIResponse;
    }

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await jwt.sign(payload);
    const refreshToken = await jwt.sign({ ...payload, type: 'refresh' });

    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      data: {
        token,
        refreshToken,
        user: userWithoutPassword,
      },
    } as APIResponse;
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
      role: t.String(),
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Login with credentials',
      description: 'Authenticate user and return JWT tokens',
    },
  })
  .post('/refresh', async ({ headers, jwt }) => {
    const authHeader = headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Invalid or missing token',
        },
      } as APIResponse;
    }

    const token = authHeader.substring(7);

    try {
      const payload = await jwt.verify(token) as JWTPayload & { type?: string };

      if (!payload || payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      const newPayload: JWTPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      const newToken = await jwt.sign(newPayload);

      return {
        success: true,
        data: {
          token: newToken,
        },
      } as APIResponse;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_002',
          message: 'Token expired or invalid',
        },
      } as APIResponse;
    }
  }, {
    detail: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      description: 'Get a new access token using refresh token',
    },
  })
  .post('/register', async ({ body, jwt }) => {
    const { email, password, name, role } = body as { email: string; password: string; name: string; role: string };

    if (users.has(email)) {
      return {
        success: false,
        error: {
          code: 'AUTH_004',
          message: 'Email already registered',
        },
      } as APIResponse;
    }

    const newUser: User & { password: string } = {
      id: String(users.size + 1),
      email,
      password, // In production, hash this
      name,
      role: role as any,
      createdAt: new Date(),
    };

    users.set(email, newUser);

    const payload: JWTPayload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = await jwt.sign(payload);
    const refreshToken = await jwt.sign({ ...payload, type: 'refresh' });

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      data: {
        token,
        refreshToken,
        user: userWithoutPassword,
      },
    } as APIResponse;
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
      name: t.String(),
      role: t.String(),
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description: 'Create a new user account',
    },
  });
