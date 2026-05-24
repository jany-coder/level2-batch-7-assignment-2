import express, { type Request, type Application, type Response } from "express";


const app : Application = express();
app.use(express.json());

app.get('/', (_req : Request, res : Response) => {
    res.status(200).json({ 
        message: 'Express Server',
        "author": "Jony Coder"
    });
});

export default app;