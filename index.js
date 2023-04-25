import express from 'express';
import dotenv from 'dotenv';

import { initSupabase } from './src/supabase/SupabaseClient.js';
import { routerApi } from './src/routes/index.js';

const app = express();
dotenv.config();

const ip = process.env.SERVER_IP || 'localhost';
const port = process.env.SERVER_PORT || '3000';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

initSupabase(supabaseUrl, supabaseKey);

app.use(express.json());

routerApi(app);

app.get('/', (req, res) => {
	res.send('[Server] connected');
});

app.listen(port, ip, () => {
	console.log(`[Server] escuchando en ${ip}:${port}`);
});
