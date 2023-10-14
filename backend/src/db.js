const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.findUser = async (user) => {
  const select = 'SELECT * FROM users WHERE email_address = $1';
  const query = {
    text: select,
    values: [user],
  };
  const {rows} = await pool.query(query);
  return rows.length == 1 ? rows[0] : undefined;
};


exports.selectAllMail = async () => {
  const select = 'SELECT * FROM mail';
  const query = {
    text: select,
  };
  const {rows} = await pool.query(query);
  const mails = [];
  for (const row of rows) {
    mails.push(row);
  }
  return mails;
};
console.log(`Connected to database '${process.env.POSTGRES_DB}'`);

