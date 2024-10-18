import urlService from '../services/urlService.js';

const UrlController = {
  async getLongUrl(req, res) {
    try {
      const shortUrl = req.params.shortUrl;
      const longUrl = await urlService.getLongUrl(shortUrl);
      res.status(200).json({ longUrl });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  async createShortUrl(req, res) {
    const { longUrl } = req.body;
    try {
      const shortUrl = await urlService.generateShortUrl(longUrl);
      res.status(200).json({ shortUrl });
    } catch (e) {
      res.status(500).json({ error: 'Error generating short URL' });
    }
  },
};

export default UrlController;
