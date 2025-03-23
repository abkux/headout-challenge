import express from 'express';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors'
import swaggerDocs from './swagger.js';

// Load .env configuration to process.env
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000; // Set the port, default to 5000 if not specified

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()) // Enable CORS for cross-origin requests

app.get('/', async(req, res) => {
    res.status(200).json({status: OK});
})

// Routes
app.use('/api/auth', authRoutes); // Routes for authentication (e.g., login, register)
app.use('/api/game', gameRoutes); // Routes for game-related operations

app.use('/api/misc', miscRoutes);
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

swaggerDocs(app);
