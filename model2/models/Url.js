import { DataTypes } from '@sequelize/core';
import { sequelize } from './sequelize.js';

export const Url = sequelize.define(
  'Url',
  {
    long_url: {
      type: DataTypes.STRING,
      unique: true,
    },
    short_url: {
      type: DataTypes.STRING,
      unique: true,
    },
    params_hash: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'url_mapping',
  }
);

export default Url;
