import { Sequelize } from '@sequelize/core';
import { MariaDbDialect } from '@sequelize/mariadb';

// Initialize Sequelize with the MariaDB dialect
const sequelize = new Sequelize({
  dialect: MariaDbDialect,
  database: 'url_shortener',
  user: 'amariscalr', // Update with your MariaDB username
  password: 'mypassword', // Update with your MariaDB password
  host: 'localhost',
  port: 3306,
  showWarnings: true,
  connectTimeout: 1000,
});

export { sequelize };
