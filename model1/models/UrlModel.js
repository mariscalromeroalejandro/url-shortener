import { DataTypes } from '@sequelize/core';
import { sequelize } from './database.js';

// Define the Urls model
const UrlModel = sequelize.define('Urls', {
  url_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  longUrl: {
    type: DataTypes.STRING,
    columnName: 'longUrl', // Maps to the actual column name in the database
  },
  shortUrl: {
    type: DataTypes.STRING,
    columnName: 'shortUrl', // Maps to the actual column name in the database
  },
  page: {
    type: DataTypes.STRING,
    columnName: 'page'
  },
  objectId: {
    type: DataTypes.STRING,
    columnName: 'objectId'
  },
  layoutId: {
    type: DataTypes.STRING,
    columnName: 'layoutId',
    allowNull: false
  },
  tab: {
    type: DataTypes.STRING,
    columnName: 'tab'
  },
  runType: {
    type: DataTypes.STRING,
    columnName: 'runType',
  },
  runNumber: {
    type: DataTypes.INTEGER,
    columnName: 'runNumber'
  },
  periodName: {
    type: DataTypes.STRING,
    columnName: 'periodName'
  },
  passName: {
    type: DataTypes.STRING,
    columnName: 'passName'
  },
  ts: {
    type: DataTypes.BIGINT,
    columnName: 'ts'
  },
  id: {
    type: DataTypes.STRING,
    columnName: 'id'
  }
}, {
  tableName: 'Urls', // Ensure this matches your actual table name
  timestamps: false, // Set to true if you are using timestamps in your model
});

// Function to synchronize the database (optional)
async function syncDatabase() {
  try {
    await sequelize.sync({alter: true}); // Creates the table if it doesn't exist
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
}

syncDatabase();

export { UrlModel };
