import express, { Express } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import rootRouter from './routes';
import cron from 'node-cron'; 
import dayjs from 'dayjs'; 

const app: Express = express();
const prismaClient = new PrismaClient();

// CORS Configuration
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', rootRouter);

// Define the cron job that runs daily to clean up old posts
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily clean-up task...');

    try {
        // Fetch all posts ordered by creation date (newest first)
        const allPosts = await prismaClient.post.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Ensure we keep the two most recent posts
        if (allPosts.length > 2) {
            const postsToDelete = allPosts.slice(2).filter(post => {
                // Delete posts older than 24 hours
                return dayjs(post.createdAt).isBefore(dayjs().subtract(24, 'hours'));
            });

            const postIdsToDelete = postsToDelete.map(post => post.id);

            if (postIdsToDelete.length > 0) {
                await prismaClient.post.deleteMany({
                    where: {
                        id: {
                            in: postIdsToDelete,
                        },
                    },
                });
                console.log(`${postIdsToDelete.length} posts deleted.`);
            } else {
                console.log('No posts older than 24 hours to delete.');
            }
        } else {
            console.log('Less than 2 posts in the database, skipping deletion.');
        }
    } catch (error) {
        console.error('Error during clean-up:', error);
    }
});

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
