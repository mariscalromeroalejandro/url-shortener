import express from 'express';
import UrlController from './controllers/urlController.js';
import { sequelize } from './models/sequelize.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/shorten', UrlController.createShortUrl);
app.get('/:shortUrl', UrlController.getLongUrl);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
