import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { jwt } from '@elysiajs/jwt';

// Import routes
import { authRoutes } from './routes/auth';
import { floodRoutes } from './routes/flood';
import { evacuationRoutes } from './routes/evacuation';
import { alertRoutes } from './routes/alerts';
import { userRoutes } from './routes/user';

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_for_development_only_change_in_production_minimum_32';

const app = new Elysia()
  .use(cors({
    origin: true,
    credentials: true,
  }))
  .use(swagger({
    documentation: {
      info: {
        title: 'Klaew Klad API Documentation',
        version: '1.0.0',
        description: 'Satellite-Driven Flood Forecasting & Strategic Evacuation API',
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Flood', description: 'Flood status and forecasting' },
        { name: 'Evacuation', description: 'Evacuation routes and shelters' },
        { name: 'Alerts', description: 'Alert management' },
        { name: 'User', description: 'User management' },
      ],
    },
  }))
  .use(jwt({
    name: 'jwt',
    secret: JWT_SECRET,
  }))
  .get('/', () => ({
    message: 'Klaew Klad API - Hat Yai Flood Forecasting System',
    version: '1.0.0',
    status: 'online',
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(userRoutes)
      .use(floodRoutes)
      .use(evacuationRoutes)
      .use(alertRoutes)
  )
  .listen(PORT);

console.log(`🌊 Klaew Klad Backend Platform running at http://localhost:${app.server?.port}`);
console.log(`📚 API Documentation: http://localhost:${app.server?.port}/swagger`);

export type App = typeof app;