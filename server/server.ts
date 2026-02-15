import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env file manually
const __dirname = process.cwd();
const envPath = path.join(__dirname, '.env');

console.log('[server] Looking for .env at:', envPath);

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        console.log('[server] .env file found, size:', envContent.length, 'bytes');
        
        // Parse line by line to handle any encoding issues
        const lines = envContent.split(/\r?\n/);
        let loadedCount = 0;
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    process.env[key.trim()] = value;
                    loadedCount++;
                }
            }
        });
        
        console.log('[server] Loaded', loadedCount, 'environment variables');
        console.log('[server] DATABASE_URL:', process.env.DATABASE_URL ? '✓ SET' : '✗ NOT SET');
        console.log('[server] BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? '✓ SET' : '✗ NOT SET');
        console.log('[server] BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL ? '✓ SET' : '✗ NOT SET');
    } else {
        console.error('[server] ERROR: .env file not found at:', envPath);
        console.error('[server] Current working directory:', __dirname);
        console.error('[server] Files in current directory:', fs.readdirSync(__dirname).slice(0, 10));
    }
} catch (error) {
    console.error('[server] Error reading .env file:', error);
}

import express, { Request, Response } from 'express';
import cors from 'cors';    
import userRouter from './routes/userRouters';
import projectRouter from './routes/projectRoutes';
import { stripeWebhook } from './controllers/stripeWebhook';

// Validate critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('[server] ERROR: Missing required environment variables:', missingEnvVars.join(', '));
}

// Log any crashes instead of silently exiting
process.on('unhandledRejection', (reason) => {
    console.error('[server] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[server] Uncaught exception:', err);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = Number(process.env.PORT) || 3000;
const corsOptions ={
    origin: process.env.TRUSTED_ORIGINS?.split(',').map(origin => origin.trim()) || [],
    credentials:true,          
      //access-control-allow-credentials:true
}

app.use(cors(corsOptions));
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

let authHandlerPromise: Promise<(req: Request, res: Response) => unknown> | null = null;
const getAuthHandler = async () => {
    if (!authHandlerPromise) {
        authHandlerPromise = (async () => {
            const { getAuth } = await import('./lib/auth');
            const auth = await getAuth();
            const { toNodeHandler } = await import('better-auth/node');
            return toNodeHandler(auth);
        })();
    }

    return authHandlerPromise;
};

app.use('/api/auth', (req: Request, res: Response, next) => {
    getAuthHandler().then(handler => {
        handler(req, res);
    }).catch(next);
});

app.use(express.json({ limit: '50mb' }));
app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.get('/api', (req: Request, res: Response) => {
    res.send('API is Live!');
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('[server] Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
    });
});

// Start the server in non-serverless environments (Render/Railway/etc.)
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Export for Vercel (CommonJS)
module.exports = app;