import { Url } from '../models/Url.js';
import { createHash } from 'crypto';

const urlService = {
  async getLongUrl(shortUrl) {
    const existingUrl = await Url.findOne({
      where: {
        short_url: shortUrl,
      },
    });
    console.log(existingUrl);

    if (existingUrl) {
      return existingUrl.long_url;
    }

    throw new Error('URL not found');
  },

  async generateShortUrl(longUrl) {
    try {
      const sortedParams = this.sortParametersFromUrl(longUrl);
      const hashedParams = this.generateHashFromParams(sortedParams);
      console.log(sortedParams);

      // Get only 9 first characters
      const shortHash = hashedParams.substring(0, 9);
      console.log(shortHash);

      // Find by params
      const existingEntries = await Url.findAll({
        where: { params_hash: shortHash },
      });

      // Find by long url (subset)
      for (const entry of existingEntries) {
        if (entry.long_url === longUrl) {
          return entry.short_url;
        }
      }

      // Generate new short URL if not found
      let shortUrl = this.generateShortUrlFromHash(shortHash);
      let count = 0;

      //Check collisions
      while (await Url.findOne({ where: { short_url: shortUrl } })) {
        count += 1;
        shortUrl = this.generateShortUrlFromHash(shortHash, count);
      }

      await Url.create({
        long_url: longUrl,
        short_url: shortUrl,
        params_hash: shortHash,
      });

      return shortUrl;
    } catch (e) {
      console.error(e);
      throw Error('Error processing request');
    }
  },

  sortParametersFromUrl(url) {
    const params = this.extractParams(url);
    return this.sortParams(params);
  },

  extractParams(longUrl) {
    const url = new URL(longUrl);
    const params = new URLSearchParams(url.search);
    const paramObj = {};
    for (const [key, value] of params.entries()) {
      paramObj[key] = value;
    }
    return paramObj;
  },

  sortParams(params) {
    const sortedEntries = Object.entries(params).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    );
    return Object.fromEntries(sortedEntries);
  },

  generateHashFromParams(params) {
    return createHash('sha256').update(JSON.stringify(params)).digest('hex');
  },

  generateShortUrlFromHash(hash, count = 0) {
    const valueToEncode = createHash('sha256')
      .update(hash + count.toString())
      .digest('base64');
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api/';
    return baseUrl + valueToEncode.substring(0, 9);
  },
};

export default urlService;
