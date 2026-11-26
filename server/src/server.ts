import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDb, disconnectDb } from './db.js';

await connectDb(env.MONGO_URI);
const server = createApp().listen(env.PORT, () => {
  console.log(`CarBid API listening on http://localhost:${env.PORT}`);
  if (env.ENABLE_DOCS) console.log(`Swagger UI: http://localhost:${env.PORT}/api/docs`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
  });
}
