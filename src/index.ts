import express, { Express } from 'express'
import { PrismaClient } from "@prisma/client";
import rootRouter from './routes';

const app: Express = express()

app.use(express.json())

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient();

app.listen(process.env.PORT, () => {
    (console.log("App is working"))
})