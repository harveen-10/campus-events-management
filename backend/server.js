import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from 'mysql2';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3000;
const saltRounds = 10;

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',     
    user: 'root',           
    password: process.env.PASSWORD, 
    database: process.env.DATABASE 
}).promise();

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});


app.get("/home", async (req, res) => {
    try {
        const [products] = await db.query("SELECT Ename, Event_date, Poster FROM events ORDER BY Event_date ASC, s_time ASC");
        res.send({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    } 
});




app.post("/signup", async (req, res) => {
    const srn = req.body.srn;
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    if (!srn) {
        return res.status(400).send("SRN is required");
    }

    try {
        const hash = await bcrypt.hash(password, saltRounds);

        await db.query("CALL signupUser(?, ?, ?, ?)", [srn, email, name, hash]);
        
        return res.send("Signup successful");
    } catch (err) {
        if (err.sqlState === '45000') {
            return res.send(err.sqlMessage);
        }
        console.error("Error during signup: ", err);
        return res.status(500).send("An error occurred during signup");
    }
});


app.post("/login", async (req, res) => {
    const srn = req.body.srn;
    const password = req.body.password;

    if (!srn) {
        return res.status(400).send("SRN is required");
    }

    try {
        const [rows] = await db.query("CALL getUserBySRN(?)", [srn]);

        if (rows[0].length > 0) {
            const passwordStored = rows[0][0].password;

            bcrypt.compare(password, passwordStored, (err, result) => {
                if (err) {
                    console.log("Error comparing password:", err);
                    res.status(500).send("Internal server error");
                } else {
                    if (result) {
                        res.send("Login successful");
                    } else {
                        res.send("Incorrect password");
                    }
                }
            });
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.log("Error executing stored procedure:", err);
        res.status(500).send("Error checking user");
    }
});


app.post("/newevent", async (req, res) => {
    const ename = req.body.ename;
    const category = req.body.category;
    const event_date = req.body.event_date;
    const domain = req.body.domain;
    const poster = req.body.poster;
    const s_time = req.body.s_time;
    const e_time = req.body.e_time;

    if (!ename || !category || !event_date || !domain || !poster || !s_time || !e_time) {
        return res.status(400).send("All fields are required.");
    }

    try {
        await db.query("CALL signupUser(?, ?, ?, ?)", [srn, email, name, hash]);
        
        return res.send("Signup successful");
    } catch (err) {
        if (err.sqlState === '45000') {
            return res.send(err.sqlMessage);
        }
        console.error("Error during signup: ", err);
        return res.status(500).send("An error occurred during signup");
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
