import urlService from "../services/urlService.js";

// Controller to handle URL requests
const urlController = {
  
  async processUrlRequest(req, res) {
    const { longUrl } = req.body;
    const response = await urlService.findOrCreateUrl(longUrl);
    res.status(response.status).send(response.data)
  },

  async findByShortUrl(req, res) {
    const { shortUrl } = req.body;
    const response = await urlService.findByShortUrl(shortUrl);
    res.status(response.status).send(response.data);
  },

  async getAll(req, res) {
    try {
      const urls = await urlService.getAllUrls();
      sendResponse(res, urls);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      res.status(500).send("Error fetching URLs");
    }
  },
  async deleteAll(req, res) {
    try {
      await urlService.deleteAll();
    } catch (error) {
      console.error("Error deleting all registers", error);
      res.status(500).send("Error deleting all items");
    }
  },

};

function sendResponse(res, data) {
  res.json(data);
}

export default urlController;
