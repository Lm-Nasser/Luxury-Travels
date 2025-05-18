
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const bcrypt = require('bcrypt');
const mysql = require("mysql");
const path = require('path');
const { title } = require("process");
const app = express();

app.use(express.json());

const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static("public/uploads"));




app.use(
    session({
        secret: "4f6a3b9c-1e2d-4b3a-8c5d-7f6e1a2b3c4d",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true for HTTPS
    })
);



// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // Save files in 'public/uploads/'
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Multer middleware
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});



// ############################################### DB Connection ###############################################

app.listen(port, () => {
    console.log('http://localhost:'+port)
})

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "trips_agency"
});

connection.connect((err) => {
    if (!err) {
        console.log("DB connection succeeded");
    } else {
        console.log("DB connection failed: " + JSON.stringify(err, undefined, 2));
    }
});



// ############################################### navigation ###############################################

// ##################################### client #####################################

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/public/trippage.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "trippage.html"));
});

app.get('/public/thankyoupage.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "thankyoupage.html"));
});

app.get('/public/addReview.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "addReview.html"));
});

app.get("/fetch-home-trips", (req, res) => {
    const sql = "SELECT * FROM trips";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch trips" });
        } else {
            res.json(results);
        }
    });
});

app.get("/fetch-home-trips/:id", (req, res) => {
    const tripId = req.params.id;
    const sql = "SELECT * FROM trips WHERE id = ?";
    
    connection.query(sql, [tripId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch trip" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Trip not found" });
        } else {
            res.json(results[0]);
        }
    });
});

app.get("/fetch-home-trips-gallery/:id", (req, res) => {
    const tripId = req.params.id; // Get the trip ID from URL params
    const sql = "SELECT * FROM images WHERE tripID = ?"; // Query to fetch images for the trip
    
    connection.query(sql, [tripId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch gallery images" });
        } else if (results.length === 0) {
            return res.status(404).json({ error: "No images found for this trip" });
        } else {
            res.json(results); // Return all images for the trip
        }
    });
});



// ##################################### admin login #####################################

app.get('/public/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/check-user", async (req, res) => {
    try {
        const { username, password } = req.body;

        
        connection.query(
            "SELECT * FROM user_test WHERE username = ?",
            [username],
            async (err, result) => {
                if (err) {
                    console.error("Database query error:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                if (result.length === 0) {
                    return res.status(404).json({ message: "User not found" });
                }

                // Compare hashed password
                const user = result[0];
                const passwordMatch = await bcrypt.compare(password, user.password_hash);

                if (!passwordMatch) {
                    return res.status(401).json({ message: "Incorrect username or password" });
                }
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                };

                return res.status(200).json({ message: "Login successful!", user: req.session.user });
            }
        );
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get("/check-session", (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        return res.status(401).json({ loggedIn: false });
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
    });
});



// #################### admin navigation ####################

app.get('/public/adduser.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "adduser.html"));
});


app.get('/public/addTrip.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "addTrip.html"));
});

app.get('/public/bookings.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "bookings.html"));
});

app.get('/public/bookingPreview.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "bookingPreview.html"));
});

app.get('/public/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get('/public/customers.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "customers.html"));
});

app.get('/public/customers.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "customers.html"));
});

app.get('/public/addgallery.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "addgallery.html"));
});

// ############################################### CRUD for users ###############################################

app.get("/fetch-all-users", (req, res) => {
    connection.query("SELECT * FROM user_test", (err, rows, fields) => {
        rows.forEach(user => {
            user.creation_date = new Date(user.creation_date).toISOString().split('T')[0];
        });
        res.json(rows);
    })
})

    app.post("/create", async (req, res) => {
        try {
            const { username, email, password } = req.body;
    
            // Check users
            connection.query(
                "SELECT * FROM user_test WHERE username = ? OR email = ?",
                [username, email],
                async (err, result) => {
                    if (err) {
                        console.error("Database query error:", err);
                        return res.status(500).send("Internal Server Error");
                    }
    
                    if (result.length > 0) {
                        return res.status(400).json({ message: "User already exists" });
                    }
    
                    // Hash the password
                    const hashedPassword = await bcrypt.hash(password, 10);
    
                    // Insert new user
                    connection.query(
                        "INSERT INTO user_test (username, email, password_hash) VALUES (?, ?, ?)",
                        [username, email, hashedPassword],
                        (err, insertResult) => {
                            if (err) {
                                console.error("Database insert error:", err);
                                return res.status(500).send("Error saving user");
                            }
                            res.status(201).json({ message: "User created successfully" });
                        }
                    );
                }
            );
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).send("Internal Server Error");
        }
    });
    

app.delete("/delete", (req, res)=>{
    const id = req.body.id;
    if (!id) {
        return res.sendStatus(400);
    }

    connection.query("DELETE FROM user_test WHERE id = ?", [id],
        (err, rows, fields) => {
            if(err) throw err;
            res.sendStatus(200);
        }
    )
})

app.get("/users/:id", (req, res)=>{
    const id = req.params.id;
    if (!id) {
        return res.sendStatus(400);
    }

    connection.query("SELECT * FROM user_test WHERE id = ?", [id],
        (err, rows, fields) => {
            if(err) throw err;
            res.json(rows);
        }
    )
})

app.post("/update", (req, res)=>{
    const body = req.body;
    if (!body) {
        return res.sendStatus(400);
    }
    const sql = "UPDATE user_test SET username=?, email=?, password_hash=? WHERE id=?";
    
    connection.query(sql, [body.username, body.email, body.password, body.id],
        (err, rows, fields) => {
        if(err) throw err;
        res.sendStatus(200);
    })
})

// ############################################### CRUD for trips ###############################################

app.get("/fetch-all-trips", (req, res) => {
    connection.query("SELECT * FROM trips", (err, rows, fields) => {
        rows.forEach(trip => {
            trip.created_at = new Date(trip.created_at).toISOString().split('T')[0];
        });
        res.json(rows);
    })
})

app.post("/create-trip", upload.single("image"), (req, res) => {
    const body = req.body;
    const imageFilename = req.file ? req.file.filename : null; // Get the uploaded file name

    if (!body) {
        return res.sendStatus(400);
    }

    const query = `
        INSERT INTO trips (title, location_from, location_to, price_group, price_private, 
                        description, trip_image, trip_details, price_group_children, 
                        price_private_children, discount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [
        body.Title,
        body.from,
        body.to,
        body.priceG,
        body.priceP,
        body.description,
        imageFilename, // Store only the filename
        body.tipDetails,
        body.priceG_children,
        body.priceP_children,
        body.discount
    ], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, message: "Trip added successfully!", imageUrl: `/uploads/${imageFilename}` });
    });
});


app.delete("/delete-trip", (req, res)=>{
    const id = req.body.id;
    if (!id) {
        return res.sendStatus(400);
    }

    connection.query("DELETE FROM trips WHERE id = ?", [id],
        (err, rows, fields) => {
            if(err) throw err;
            res.sendStatus(200);
        }
    )
})

app.get("/trips/:id", (req, res)=>{
    const id = req.params.id;
    if (!id) {
        return res.sendStatus(400);
    }

    connection.query("SELECT * FROM trips WHERE id = ?", [id],
        (err, rows, fields) => {
            if(err) throw err;
            res.json(rows);
        }
    )
})

app.post("/update-trip", upload.single("image"), (req, res) => {
    const body = req.body;
    if (!body) {
        return res.sendStatus(400);
    }

    let image = req.file ? req.file.filename : body.existingImage; // Keep old image if no new file is uploaded

    const sql = `
        UPDATE trips 
        SET title=?, location_from=?, location_to=?, price_group=?, price_private=?, 
            description=?, trip_image=?, trip_details=?, price_group_children=?, 
            price_private_children=?, discount=? 
        WHERE id=?`;

    connection.query(
        sql,
        [
            body.Title, body.from, body.to, body.priceG, body.priceP,
            body.description, image, body.tipDetails, body.priceG_children,
            body.priceP_children, body.discount, body.id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating trip:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.sendStatus(200);
        }
    );
});

app.delete("/delete-trip-gallery/:id", (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        return res.status(400).json({ error: "Missing ID parameter" });
    }

    // Corrected SQL query
    connection.query("DELETE FROM images WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database operation failed" });
        }

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No image found with that ID" });
        }

        res.status(200).json({ message: "Image deleted successfully" });
    });
});


// ############################################### CRU for bookings ###############################################

app.post("/create-booking/:id", (req, res) => {
    const body = req.body;
    const id = req.params.id;
    function generateBookingReference() {
        const prefix = "#TRAG2001-";
        const randomNumber = Math.floor(10000 + Math.random() * 9000000); 
        return prefix + randomNumber;
    }

    if (!body) {
        return res.sendStatus(400);
    }

    const BookingReferenceCode = generateBookingReference();

    const query = `INSERT INTO bookings (FullName, Email, Nationality, Phone, PickupLocation, TourType, AdultTravelers, ChildrenTravelers, Date, SpecialRequest, TripID, BookingReference, adultsTotalPrice, childrenTotalPrice, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        body.fullName,
        body.email,
        body.Nationality,
        body.phone,
        body.pickupLocation,
        body.tourType,
        body.adults,
        body.children,
        body.date,
        body.SR,
        id,
        BookingReferenceCode,
        body.priceAdultsInput,
        body.priceChildrenInput,
        body.totalPriceInput,

    ];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.json({ success: true, bookingData: { 
            FullName: body.fullName, 
            date: body.date, 
            adultTP: body.adults, 
            childrenTP: body.children, 
            tourType: body.tourType, 
            totalPrice: body.totalPriceInput,

            Email: body.email, 
            phone: body.phone, 
        } });
    })
}) 





app.get("/fetch-all-bookings", (req, res) => {
    connection.query("SELECT bookings.*, trips.location_from, trips.location_to FROM bookings INNER JOIN trips ON bookings.TripID = trips.id;", 
        (err, rows, fields) => {
            rows.forEach(booking => {
                booking.Date = new Date(booking.Date).toISOString().split('T')[0];
            });
        
        res.json(rows);
    })
})

app.post("/reject-booking", (req, res)=>{
    const id = req.body.id;
    const status = "REJECTED";
    if (!id) {
        return res.sendStatus(400);
    }

    const query = "UPDATE bookings SET Status=? WHERE BookingID = ?";

    connection.query(query, [status, id],
        (err, rows, fields) => {
            if(err) throw err;
            res.sendStatus(200);
        }
    )
})

app.post("/accept-booking", (req, res)=>{
    const id = req.body.id;
    const status = "ACCEPTED";
    if (!id) {
        return res.sendStatus(400);
    }

    const query = "UPDATE bookings SET Status=? WHERE BookingID = ?";

    connection.query(query, [status, id],
        (err,) => {
            if(err) throw err;
            res.sendStatus(200);
        }
    )
})

app.get("/booking-details/:id", (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        return res.status(400).json({ error: "Missing booking ID" });
    }

    const query = "SELECT * FROM bookings WHERE BookingID = ?";

    connection.query(query, [id], (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(rows[0]);
    });
});


app.get("/fetch-all-customers", (req, res) => {
    connection.query("SELECT FullName, Email, Nationality, Phone FROM bookings", 
        (err, rows) => {
        
        res.json(rows);
    })
})

app.post("/create-review/:id", (req, res) => {
    const { booking_Reference_Code, fullName, rating, Review } = req.body;
    const id = req.params.id;


    const checkBookingQuery = "SELECT * FROM bookings WHERE BookingReference = ?";
    
    connection.query(checkBookingQuery, [booking_Reference_Code], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to check booking reference." });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid Booking Reference Code." });
        }

        const insertReviewQuery = `
            INSERT INTO reviews (trip_id, reference_code, name, rating, review) 
            VALUES (?, ?, ?, ?, ?)`;

        const values = [id, booking_Reference_Code, fullName, rating, Review];

        connection.query(insertReviewQuery, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Failed to save review." });
            }
            res.status(200).json({ message: "Review submitted successfully." });
        });
    });
});

app.get('/fetch-all-images/:id', (req, res) => {
    const tripID = req.params.id;

    connection.query('SELECT * FROM images WHERE tripID = ?', tripID, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json(results);
    });
});



app.post('/create-gallery/:id', upload.array('photos', 10), (req, res) => {
    try {
        const tripID = req.params.id;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        // Insert into database
        const query = `INSERT INTO images (tripID, image_name) VALUES ?`;
        const values = files.map(file => [tripID, file.filename]);

        connection.query(query, [values], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }
            
            res.json({ 
                success: true, 
                message: `${files.length} images uploaded successfully`,
                images: files.map(file => ({
                    filename: file.filename,
                    url: `/uploads/${file.filename}`
                }))
            });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

app.delete("/delete-image/:id", (req, res)=>{
    const id = req.params.id;
    if (!id) {
        return res.sendStatus(400);
    }

    connection.query("DELETE FROM images WHERE id = ?", [id],
        (err, rows, fields) => {
            if(err) throw err;
            res.sendStatus(200);
        }
    )
})