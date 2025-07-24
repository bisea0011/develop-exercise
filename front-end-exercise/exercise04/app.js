import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Setting up directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get a joke
app.get('/joke', async (req, res) => {
  try{
    const response = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single'); //gets the data from the API
    // read the data into the joketext below
    const joketext = await response.json();
    //Send this joketext into res (final response to the client)
    res.json(joketext);
  }
  catch(error){
    console.error('Error fetching joke:', error);
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});