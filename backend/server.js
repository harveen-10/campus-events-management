import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',     
    user: 'root',           
    password: process.env.PASSWORD, 
    database: process.env.DATABASE 
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});

// Close the connection
connection.end();
