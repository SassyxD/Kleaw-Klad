import { Elysia } from 'elysia';
import type { APIResponse } from '../types';

export const userRoutes = new Elysia({ prefix: '/user' })
  .get('/profile', async ({ headers }) => {
    // Mock profile data
    return {
      success: true,
      data: {
        id: '1',
        email: 'user@example.com',
        name: 'Demo User',
        role: 'client',
      },
    } as APIResponse;
  }, {
    detail: {
      tags: ['User'],
      summary: 'Get user profile',
      description: 'Retrieve current user profile information',
    },
  });
