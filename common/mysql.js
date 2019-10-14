const mysql = require('mysql');
const config = require('../../config.js');

let pool = '';
const init = async () => {
  await new Promise((resolve) => {
    pool = mysql.createPool({
      connectionLimit: 30,
      host: 'localhost',
      user: 'root',
      password: config.nanaDbPass,
      database: 'notebook',
      charset: 'UTF8MB4_GENERAL_CI',
    });

    pool.on('connection', () => {
      console.log('mysql connection');
    });
    pool.on('enqueue', () => console.log('Mysql waiting for available connection slot'));
    pool.on('error', (err) => console.error(`Mysql err${err}`));

    resolve();
  });
};

// bind mysql connection query
const bindQuery = (sql, params, db) => new Promise((resolve, reject) => {
  pool.getConnection((err, conn) => {
    if (err) {
      reject(err);

      return;
    }

    conn.query(sql, params, (err, rows) => {
      conn.release();

      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// promisify mysql connection query
const promisifyQuery = (sql, db) => new Promise((resolve, reject) => {
  pool.getConnection((err, conn) => {
    if (err) {
      reject(err);

      return;
    }

    conn.query(sql, (err, rows) => {
      conn.release();

      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

const bindSql = (sql, params, db) => bindQuery(sql, params, db);

const runSql = (sql, db) => promisifyQuery(sql, db);

module.exports = {
  init,
  bindSql,
  runSql,
};
