import { Op } from 'sequelize';
import { UrlModel } from '../models/UrlModel.js';
import { createHash } from 'crypto';

const VALID_KEYS = Object.keys(UrlModel.modelDefinition.rawAttributes);

const urlService = {
  async findOrCreateUrl(longUrl) {
    try {
      const params = getUrlParams(longUrl);
      const searchConditions = [];
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          searchConditions.push({ [key]: value });
        }
      }
      // Filter by conditions
      let filteredUrls = [];
      if (searchConditions.length > 0) {
        filteredUrls = await UrlModel.findAll({
          where: {
            [Op.and]: searchConditions,
          },
        });
      }

      //
      if (filteredUrls.length > 0) {
        const normalizedUrl = normalizeUrl(longUrl);
        const foundUrl = filteredUrls.find(
          (url) => url.longUrl === normalizedUrl
        );
        if (foundUrl) {
          return { status: 200, data: { shortUrl: filteredUrls.shortUrl } };
        }
      }
      const shortUrl = await generateShortUrlHash(normalizedUrl);
      const newUrl = await UrlModel.create({
        longUrl: normalizedUrl,
        shortUrl,
        ...params,
      });
      return { status: 201, data: newUrl };
    } catch (e) {
      console.error('Error finding or creating URL:', e);
      return { status: 500, data: { message: 'Server error' } };
    }
  },

  async findByShortUrl(shortUrl) {
    try {
      const entry = await UrlModel.findOne({
        where: { shortUrl },
      });
      return { status: 200, data: entry.longUrl };
    } catch (error) {
      return { status: 404, data: { message: 'Not found' } };
    }
  },

  async getAllUrls() {
    try {
      const urls = await UrlModel.findAll();
      return urls;
    } catch (error) {
      console.error('Error fetching URLs:', error.message);
      throw error;
    }
  },

  async deleteAll() {
    try {
      await UrlModel.truncate();
    } catch (error) {
      console.error('Error deleting all registers', error.message);
      throw error;
    }
  },

  async findUrl(longUrl) {
    const urlEntry = await UrlModel.findOne({
      where: { longUrl },
    });
    return urlEntry;
  },
};

function normalizeUrl(url) {
  const urlObj = new URL(url);
  const sortedParams = getUrlParams(url);
  let newUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
  const queryString = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');
  newUrl += (newUrl.includes('?') ? '&' : '?') + queryString;
  newUrl = new URL(newUrl);
  return newUrl.toString();
}

function getUrlParams(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  console.log(params);
  const filteredParams = filterValidParams(params);
  const sortedParams = sortKeys(filteredParams);
  return sortedParams;
}

function filterValidParams(allParams) {
  const validParams = VALID_KEYS;
  const result = {};
  for (const [key, value] of allParams.entries()) {
    const camelCaseKey = toCamelCase(key);
    if (validParams.includes(camelCaseKey)) {
      result[camelCaseKey] = value;
    }
  }
  return result;
}

function sortKeys(params) {
  return Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
}

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, ''); // Eliminar espacios
}

async function generateShortUrlHash(url) {
  const baseHash = createHash('sha256').update(url).digest('hex').slice(0, 10);
  let shortHash = baseHash;
  let counter = 1;

  while (await checkHashInDatabase(shortHash)) {
    shortHash = baseHash + counter; // Sumar un número al hash base
    shortHash = shortHash.slice(0, 10); // Mantener el hash en 10 caracteres
    counter++;
  }

  return `tiny.com/${shortHash}`;
}

async function checkHashInDatabase(shortUrl) {
  const existingHash = await UrlModel.findOne({
    where: { shortUrl },
  });
  return existingHash !== null;
}

export default urlService;
