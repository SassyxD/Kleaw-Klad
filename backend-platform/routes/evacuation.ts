import { Elysia, t } from 'elysia';
import type { APIResponse, EvacuationRoute, Shelter } from '../types';
import { mockShelters, generateMockRoute } from '../mock/evacuation-data';

export const evacuationRoutes = new Elysia({ prefix: '/evacuation' })
  .post('/routes', async ({ body }) => {
    const { origin, destinations, priority } = body as any;
    
    // Generate mock routes for each destination
    const routes: EvacuationRoute[] = destinations.map((dest: any, index: number) => 
      generateMockRoute(origin, dest, priority, index)
    );

    return {
      success: true,
      data: { routes },
    } as APIResponse<{ routes: EvacuationRoute[] }>;
  }, {
    body: t.Object({
      origin: t.Object({
        lat: t.Number(),
        lng: t.Number(),
      }),
      destinations: t.Array(t.Object({
        id: t.String(),
        lat: t.Number(),
        lng: t.Number(),
      })),
      priority: t.String(),
    }),
    detail: {
      tags: ['Evacuation'],
      summary: 'Calculate evacuation routes',
      description: 'Generate optimal evacuation routes using RL',
    },
  })
  .get('/shelters', async () => {
    return {
      success: true,
      data: { shelters: mockShelters },
    } as APIResponse<{ shelters: Shelter[] }>;
  }, {
    detail: {
      tags: ['Evacuation'],
      summary: 'Get shelters list',
      description: 'Retrieve list of active shelters',
    },
  });
