import express, { Express } from 'express';
import cors from 'cors';  // Import the cors middleware
import { PrismaClient } from '@prisma/client';
import rootRouter from './routes';

const app: Express = express();
const prismaClient = new PrismaClient();

// CORS Configuration
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Headers allowed in requests
};

// Apply CORS middleware with the above configuration
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', rootRouter);

async function startServer() {
    try {
        await prismaClient.$connect();
        console.log('Prisma connected.');

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`App is working on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
}

process.on('SIGTERM', async () => {
    await prismaClient.$disconnect();
    console.log('Prisma disconnected.');
    process.exit(0);
});

startServer();

export { prismaClient };
