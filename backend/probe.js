const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        console.log('✅ MySQL connection successful');
        await connection.query('CREATE DATABASE IF NOT EXISTS ' + (process.env.DB_NAME || 'gearguard'));
        console.log('✅ Database ensured');
        await connection.end();
    } catch (err) {
        console.error('❌ MySQL check failed:', err.message);
    }
}
test();
