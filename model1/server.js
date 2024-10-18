import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import urlController from './controllers/urlController.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.post('/api/url', urlController.findByShortUrl)
app.post('/api/urls', urlController.processUrlRequest);
app.get('/api/urls', urlController.getAll);
app.delete('/api/urls', urlController.deleteAll);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
