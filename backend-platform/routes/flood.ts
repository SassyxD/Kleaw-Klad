import { Elysia } from 'elysia';
import type { APIResponse, FloodStatus, FloodForecast, RiskAssessment } from '../types';
import { mockFloodStatus, mockFloodForecasts, mockRiskAssessment } from '../mock/flood-data';

export const floodRoutes = new Elysia({ prefix: '/flood' })
  .get('/current-status', async () => {
    return {
      success: true,
      data: mockFloodStatus,
    } as APIResponse<FloodStatus>;
  }, {
    detail: {
      tags: ['Flood'],
      summary: 'Get current flood status',
      description: 'Retrieve current flood situation in Hat Yai',
    },
  })
  .get('/forecast', async ({ query }) => {
    const hours = parseInt(query.hours as string || '24');
    
    return {
      success: true,
      data: {
        forecasts: mockFloodForecasts.slice(0, Math.min(hours, 72)),
      },
    } as APIResponse<{ forecasts: FloodForecast[] }>;
  }, {
    detail: {
      tags: ['Flood'],
      summary: 'Get flood forecast',
      description: 'Retrieve flood forecast for next 24-72 hours',
    },
  })
  .get('/risk-assessment', async () => {
    return {
      success: true,
      data: mockRiskAssessment,
    } as APIResponse<RiskAssessment>;
  }, {
    detail: {
      tags: ['Flood'],
      summary: 'Get risk assessment',
      description: 'Retrieve infrastructure risk assessment from GNN',
    },
  });
