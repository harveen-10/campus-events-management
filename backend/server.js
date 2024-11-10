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

// for the home pg components
app.get("/home", async (req, res) => {
    try {
        const [products] = await db.query("SELECT Ename, Event_date, Poster, EventID FROM events ORDER BY Event_date ASC, s_time ASC");
        res.send({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    } 
});


// detailed description of the events
app.get("/eventdetails", async (req, res) => {
    const eventId = req.query.eventId;

    if (!eventId) {
        return res.status(400).send("EventID is required.");
    }

    try {
        const [rows] = await db.query("SELECT Ename, Category, Event_date, Domain, Poster, S_time, E_time, TeamSize FROM events WHERE EventID = ?", [eventId]);

        if (rows.length === 0) {
            return res.status(404).send("Event not found.");
        }
        return res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching event details: ", err);
        return res.status(500).send("An error occurred while fetching event details.");
    }
});


// Details of all the events the organizer is organizing
app.get("/organizingdetails", async (req, res) => {
    const srn = req.query.srn;

    if (!srn) {
        return res.status(400).send("SRN is required.");
    }

    try {
        // Get all EventIDs organized by the provided SRN
        const [eventIds] = await db.query("SELECT EventID FROM organized_by WHERE SRN = ?", [srn]);

        if (eventIds.length === 0) {
            return res.status(404).send("No events found.");
        }

        // Extract the EventIDs
        const eventIdList = eventIds.map(row => row.EventID);

        // Fetch details for all events organized by this SRN
        const [events] = await db.query(
            "SELECT Ename, Event_date, Poster FROM events WHERE EventID IN (?)",
            [eventIdList]
        );

        return res.json(events);
    } catch (err) {
        console.error("Error fetching event details: ", err);
        return res.status(500).send("An error occurred while fetching event details.");
    }
});


// Details of all the organizers organizing an event
app.get("/organizers", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Get all SRNs of organizers for the provided EventID
        const [organizerSRNs] = await db.query("SELECT SRN FROM organized_by WHERE EventID = ?", [eventID]);

        if (organizerSRNs.length === 0) {
            return res.status(404).send("No organizers found for this event.");
        }

        // Extract the SRNs
        const srnList = organizerSRNs.map(row => row.SRN);

        // Fetch details (SRN, name, email, phone_no) for all organizers whose SRN is in the list
        const [organizers] = await db.query(
            "SELECT SRN, Name, Email, phone_no FROM organizers WHERE SRN IN (?)",
            [srnList]
        );

        return res.json(organizers);
    } catch (err) {
        console.error("Error fetching organizers details: ", err);
        return res.status(500).send("An error occurred while fetching organizers details.");
    }
});


// Details of all the participants participating in the event
app.get("/participants", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        const [participants] = await db.query(
            "CALL GetParticipantsByEvent(?)", 
            [eventID]
        );

        if (participants.length === 0) {
            return res.status(404).send("No participants found for this event.");
        }

        return res.json(participants);
    } catch (err) {
        console.error("Error fetching participants details: ", err);
        return res.status(500).send("An error occurred while fetching participants details.");
    }
});



// Details of all the sponsors of an event
app.get("/sponsors", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Fetch sponsor details for the specified event
        const [sponsors] = await db.query(
            "SELECT Name, Email, Contribution, phone_no FROM sponsors WHERE EventID = ?",
            [eventID]
        );

        if (sponsors.length === 0) {
            return res.status(404).send("No sponsors found for this event.");
        }

        return res.json(sponsors);
    } catch (err) {
        console.error("Error fetching sponsor details: ", err);
        return res.status(500).send("An error occurred while fetching sponsor details.");
    }
});


// Details of all the guests of an event
app.get("/guests", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Fetch guest details for the specified event
        const [guests] = await db.query(
            "SELECT Name, Email, Role, phone_no FROM guests WHERE EventID = ?",
            [eventID]
        );

        if (guests.length === 0) {
            return res.status(404).send("No guests found for this event.");
        }

        return res.json(guests);
    } catch (err) {
        console.error("Error fetching guest details: ", err);
        return res.status(500).send("An error occurred while fetching guest details.");
    }
});

// Details of all the finances of an event
app.get("/finances", async (req, res) => {
    const eventID = req.query.eventID;

    if (!eventID) {
        return res.status(400).send("EventID is required.");
    }

    try {
        // Fetch finance details for the specified event
        const [finances] = await db.query(
            "SELECT SpentOn, Amount, Receipt FROM finance WHERE EventID = ?",
            [eventID]
        );

        if (finances.length === 0) {
            return res.status(404).send("No finance details found for this event.");
        }

        return res.json(finances);
    } catch (err) {
        console.error("Error fetching finance details: ", err);
        return res.status(500).send("An error occurred while fetching finance details.");
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
            return res.status(400).send("This SRN already exists. Try logging in.");
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

// creating a new event
app.post("/newevent", async (req, res) => {
    const ename = req.body.ename;
    const category = req.body.category;
    const event_date = req.body.event_date;
    const domain = req.body.domain;
    const poster = req.body.poster;
    const s_time = req.body.s_time;
    const e_time = req.body.e_time;
    const teamSize = req.body.teamSize;

    if (!ename || !category || !event_date || !domain || !poster || !s_time || !e_time || !teamSize) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Call the stored procedure to insert the new event and generate EventID and ecode
        await db.query("CALL insertNewEvent(?, ?, ?, ?, ?, ?, ?, ?, @EventID, @ecode);", 
            [ename, category, event_date, domain, poster, s_time, e_time, teamSize]);

        // Fetch the generated EventID and ecode
        const [rows] = await db.query("SELECT @EventID AS EventID, @ecode AS ecode;");

        // Return the EventID and ecode to the user
        return res.json({
            EventID: rows[0].EventID,
            ecode: rows[0].ecode
        });
    } catch (err) {
        console.error("Error during event creation: ", err);
        return res.status(500).send("An error occurred during event creation.");
    }
});


// registering for an event
app.post("/register", async (req, res) => {
    const eventID = req.body.eventID;
    const participants = req.body.participants;
    const teamName = req.body.teamName;
    console.log("eventID", eventID);
    console.log("participants", participants);
    console.log("teamName", teamName);

    if (!eventID || !participants || participants.length === 0) {
        return res.status(400).send("EventID and participant details are required.");
    }

    try {
        const [eventRows] = await db.query("SELECT TeamSize FROM events WHERE EventID = ?", [eventID]);
        if (eventRows.length === 0) {
            return res.status(404).send("Event not found.");
        }
        const teamSize = eventRows[0].TeamSize;
        console.log("Retrieved teamSize:", teamSize); 

        let teamID = null;
        if (teamSize > 1) {
            teamID = Math.random().toString(36).substring(2, 8); 
            await db.query("INSERT INTO teams (TeamID, Team_name, EventID) VALUES (?, ?, ?)", [teamID, teamName, eventID]);
        }

        const participantQueries = participants.map((participant) => 
            db.query("INSERT INTO participants (SRN, Name, Email, phone_no, EventID, TeamID) VALUES (?, ?, ?, ?, ?, ?)", 
                     [participant.srn, participant.name, participant.email, participant.phone, eventID, teamID])
        );

        await Promise.all(participantQueries);

        res.status(201).send("Registration successful.");
    } catch (err) {
        console.error("Error during registration: ", err);
        res.status(500).send("An error occurred during registration.");
    }
});

// new organizer for an existing event
app.post("/addorganizer", async (req, res) => {
    const srn = req.body.srn;
    const ename = req.body.ename;
    const ecode = req.body.ecode;
    const name = req.body.name;
    const email = req.body.email;
    const phone_no = req.body.phone_no;

    if (!srn || !ename || !ecode || !name || !email || !phone_no) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Check if the event exists and get the EventID by Event Name (ename)
        const [eventRows] = await db.query("SELECT EventID, ecode FROM events WHERE Ename = ?", [ename]);

        if (eventRows.length === 0) {
            return res.status(404).send("Event not found.");
        }

        const eventID = eventRows[0].EventID;
        const eventEcode = eventRows[0].ecode;
        console.log("Actual ecode", eventEcode);

        // Check if the ecode matches
        if (ecode !== eventEcode) {
            return res.status(400).send("The ecode entered is incorrect.");
        }

        // Check if the organizer already exists in the organizers table
        const [existingOrganizer] = await db.query(
            "SELECT * FROM organizers WHERE SRN = ? OR Email = ? OR phone_no = ?",
            [srn, email, phone_no]
        );

        if (existingOrganizer.length === 0) {
            // If the organizer doesn't exist, insert them into the organizers table
            await db.query(
                "INSERT INTO organizers (Name, SRN, Email, phone_no) VALUES (?, ?, ?, ?)",
                [name, srn, email, phone_no]
            );
        }

        // Now add the organizer to the organized_by table
        await db.query("INSERT INTO organized_by (SRN, EventID) VALUES (?, ?)", [srn, eventID]);

        return res.send("Organizer added successfully.");
    } catch (err) {
        // Check if the error is a duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("This organizer is already assigned to the event.");
        }
        console.error("Error adding organizer: ", err);
        return res.status(500).send("An error occurred while adding the organizer.");
    }
});




// Insert details of the sponsors of an event
app.post("/sponsorinsert", async (req, res) => {
    const { Name, Email, Contribution, phone_no, EventID } = req.body;

    if (!Name || !Email || !Contribution || !phone_no || !EventID) {
        return res.status(400).send("All sponsor details (Name, Email, Contribution, phone_no, EventID) are required.");
    }

    try {
        // Call the stored procedure to insert sponsor details
        await db.query("CALL InsertSponsor(?, ?, ?, ?, ?)", [Name, Email, Contribution, phone_no, EventID]);

        // Return a success message
        return res.status(201).json({
            message: "Sponsor added successfully",
            sponsor: { Name, Email, Contribution, phone_no, EventID }
        });

    } catch (err) {
        console.error("Error adding sponsor details: ", err);
        return res.status(500).send("An error occurred while adding sponsor details.");
    }
});

// Insert details of the guests of an event
app.post("/guestinsert", async (req, res) => {
    const { Name, Email, Role, phone_no, EventID } = req.body;

    if (!Name || !Email || !Role || !phone_no || !EventID) {
        return res.status(400).send("All guest details (Name, Email, Role, phone_no, EventID) are required.");
    }

    try {
        // Call the stored procedure to insert guest details
        await db.query("CALL InsertGuest(?, ?, ?, ?, ?)", [Name, Email, Role, phone_no, EventID]);

        // Return a success message
        return res.status(201).json({
            message: "Guest added successfully",
            guest: { Name, Email, Role, phone_no, EventID }
        });

    } catch (err) {
        console.error("Error adding guest details: ", err);
        return res.status(500).send("An error occurred while adding guest details.");
    }
});

// Insert details of the finances of an event
app.post("/financeinsert", async (req, res) => {
    const { SpentOn, Amount, Receipt, EventID } = req.body;

    if (!SpentOn || !Amount || !Receipt || !EventID) {
        return res.status(400).send("All finance details (SpentOn, Amount, Receipt, EventID) are required.");
    }

    try {
        // Call the stored procedure to insert finance details
        await db.query("CALL InsertFinance(?, ?, ?, ?)", [SpentOn, Amount, Receipt, EventID]);

        // Return a success message
        return res.status(201).json({
            message: "Finance details added successfully",
            finance: { SpentOn, Amount, Receipt, EventID }
        });

    } catch (err) {
        console.error("Error adding finance details: ", err);
        return res.status(500).send("An error occurred while adding finance details.");
    }
});



// Update details of the guests of an event
app.post("/guestupdate", async (req, res) => {
    const { Name, Email, Role, phone_no, EventID } = req.body;

    // Validate that all necessary fields are provided
    if (!Name || !Email || !Role || !phone_no || !EventID) {
        return res.status(400).send("All guest details (Name, Email, Role, phone_no, EventID) are required.");
    }

    try {
        // Find the guest's ID based on Name, Email, and EventID
        const [guest] = await db.query(
            "SELECT ID FROM guests WHERE Name = ? AND Email = ? AND EventID = ?",
            [Name, Email, EventID]
        );

        // Check if the guest was found
        if (!guest) {
            return res.status(404).send("No guest found with the provided details.");
        }

        const guestID = guest.ID; // Get the ID of the found guest

        // Now update the guest details using the ID found above
        const result = await db.query(
            "UPDATE guests SET Name = ?, Email = ?, Role = ?, phone_no = ?, EventID = ? WHERE ID = ?",
            [Name, Email, Role, phone_no, EventID, guestID]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("No guest found with the provided ID to update.");
        }

        // Return a success message along with the updated guest details
        return res.status(200).json({
            message: "Guest details updated successfully",
            guest: { Name, Email, Role, phone_no, EventID }
        });
    } catch (err) {
        console.error("Error updating guest details: ", err);
        return res.status(500).send("An error occurred while updating guest details.");
    }
});



// Update details of the sponsors of an event
app.post("/sponsorupdate", async (req, res) => {
    const { Name, Email, Contribution, phone_no, EventID } = req.body;

    // Validate that all necessary fields are provided
    if (!Name || !Email || !Contribution || !phone_no || !EventID) {
        return res.status(400).send("All sponsor details (Name, Email, Contribution, phone_no, EventID) are required.");
    }

    try {
        // First, find the sponsor's ID based on the Email (or EventID)
        const [sponsor] = await db.query(
            "SELECT ID FROM sponsors WHERE Email = ? AND EventID = ?",
            [Email, EventID]
        );

        if (!sponsor) {
            return res.status(404).send("No sponsor found with the provided Email and EventID.");
        }

        // Use the found sponsor ID to update the details
        const result = await db.query(
            "UPDATE sponsors SET Name = ?, Email = ?, Contribution = ?, phone_no = ? WHERE ID = ?",
            [Name, Email, Contribution, phone_no, sponsor.ID]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("No sponsor found with the provided ID to update.");
        }

        // Return a success message along with the updated sponsor details
        return res.status(200).json({
            message: "Sponsor details updated successfully",
            sponsor: { Name, Email, Contribution, phone_no, EventID }
        });
    } catch (err) {
        console.error("Error updating sponsor details: ", err);
        return res.status(500).send("An error occurred while updating sponsor details.");
    }
});


// Update details of the finances of an event
app.post("/financeupdate", async (req, res) => {
    const { SpentOn, Amount, Receipt, EventID } = req.body;

    // Validate that all necessary fields are provided
    if (!SpentOn || !Amount || !Receipt || !EventID) {
        return res.status(400).send("All finance details (SpentOn, Amount, Receipt, EventID) are required.");
    }

    try {
        // Find the finance record's TransID based on the EventID
        const [financeRecord] = await db.query(
            "SELECT TransID FROM finance WHERE EventID = ?",
            [EventID]
        );

        // Check if the finance record was found
        if (!financeRecord) {
            return res.status(404).send("No finance record found for this event.");
        }

        const transID = financeRecord.TransID; // Get the TransID of the found finance record

        // Now update the finance details using the TransID found above
        const result = await db.query(
            "UPDATE finance SET SpentOn = ?, Amount = ?, Receipt = ? WHERE TransID = ?",
            [SpentOn, Amount, Receipt, transID]
        );

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("No finance record found with the provided TransID to update.");
        }

        // Return a success message along with the updated finance details
        return res.status(200).json({
            message: "Finance details updated successfully",
            finance: { SpentOn, Amount, Receipt, EventID }
        });
    } catch (err) {
        console.error("Error updating finance details: ", err);
        return res.status(500).send("An error occurred while updating finance details.");
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
