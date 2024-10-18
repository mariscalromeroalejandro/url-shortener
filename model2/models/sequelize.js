import { Sequelize } from '@sequelize/core';
import { MariaDbDialect } from '@sequelize/mariadb';

const sequelize = new Sequelize({
  dialect: MariaDbDialect,
  database: 'tiny_urls',
  user: 'amariscalr',
  password: 'mypassword',
  host: 'localhost',
  port: 3306,
  showWarnings: true,
  connectTimeout: 1000,
});

export { sequelize };
