import { Elysia, t } from 'elysia';
import type { APIResponse, Alert } from '../types';

// Mock alerts storage
let alerts: Alert[] = [
  {
    id: 'alert_1',
    severity: 'warning',
    title: 'U-Tapao Canal Water Level Rising',
    message: 'Water level at U-Tapao Canal is rising. Residents in Zone A should prepare for potential evacuation.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    areas: ['zone_a'],
  },
  {
    id: 'alert_2',
    severity: 'info',
    title: 'Shelter Capacity Update',
    message: 'PSU Gym shelter now at 47% capacity. Additional shelters standing by.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];

export const alertRoutes = new Elysia({ prefix: '/alerts' })
  .get('/', async () => {
    return {
      success: true,
      data: { alerts },
    } as APIResponse<{ alerts: Alert[] }>;
  }, {
    detail: {
      tags: ['Alerts'],
      summary: 'Get alerts',
      description: 'Retrieve active alerts',
    },
  })
  .post('/', async ({ body }) => {
    const { severity, title, message, areas, expiry } = body as any;

    const newAlert: Alert = {
      id: `alert_${Date.now()}`,
      severity,
      title,
      message,
      timestamp: new Date().toISOString(),
      expiry,
      areas,
      actionRequired: severity === 'critical',
    };

    alerts.unshift(newAlert);

    // Calculate affected population (mock)
    const sentTo = areas ? areas.length * 15000 : 50000;

    return {
      success: true,
      data: {
        alertId: newAlert.id,
        sentTo,
        timestamp: newAlert.timestamp,
      },
    } as APIResponse;
  }, {
    body: t.Object({
      severity: t.String(),
      title: t.String(),
      message: t.String(),
      areas: t.Array(t.String()),
      expiry: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Alerts'],
      summary: 'Broadcast alert',
      description: 'Send alert to clients (operator only)',
    },
  })
  .delete('/:id', async ({ params }) => {
    alerts = alerts.filter((a) => a.id !== params.id);

    return {
      success: true,
      data: { message: 'Alert deleted' },
    } as APIResponse;
  }, {
    detail: {
      tags: ['Alerts'],
      summary: 'Delete alert',
      description: 'Remove an alert',
    },
  });
