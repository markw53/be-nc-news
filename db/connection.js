require("dotenv").config();
const { Pool } = require("pg");
const dns = require("dns");

// Force IPv4 lookups inside Node
dns.setDefaultResultOrder("ipv4first");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

module.exports = pool;