const express = require("express");
const mongoose = require("mongoose");
const connect = require("./database/connection"); // mongo db connection
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getLocalIPAddress = require("./utils/captureIP");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// lets do some fun with the server listening method

const localIP = getLocalIPAddress();
const PORT = process.env.PORT;

app.listen(PORT, localIP, () => {
    console.log(`Server is running on http://${localIP}:${PORT}`);
}).on("error", (err) => {
    if (err.code === "EADDRNOTAVAIL") {
        console.log(
            `Local IP ${localIP} is not available, trying localhost ...`
        );
        app.listen(PORT, "localhost", () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } else {
        console.error("Error occurred:", err);
    }
});

// mongo db connection
connect();

// import user model from userSchema.js
const User = require("./model/userSchema");

app.get("/", (req, res) => {
    res.send("Hi there!");
});

// signup route
app.post("/signup", async (req, res) => {
    try {
        const {
            FirstName,
            LastName,
            Email,
            Password,
            Age,
            Gender,
            Weight,
            Height,
            FitnessLevel,
            YogaExperience,
            YogaGoals,
            YogaStyle,
            YogaDuration,
            YogaFrequency,
            YogaIntensity,
            YogaIntensityLevel,
            YogaIntensityLevelDescription,
            YogaIntensityLevelColor,
            Role,
        } = req.body;

        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res
                .status(409)
                .json({ error: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create the user
        const user = await User.create({
            FirstName,
            LastName,
            Email,
            Password: hashedPassword,
            Age,
            Gender,
            Weight,
            Height,
            FitnessLevel,
            YogaExperience,
            YogaGoals,
            YogaStyle,
            YogaDuration,
            YogaFrequency,
            YogaIntensity,
            YogaIntensityLevel,
            YogaIntensityLevelDescription,
            YogaIntensityLevelColor,
            Role: Role || "user",
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error("Error while signing up:", error);
        res.status(500).json({
            message: "Something went wrong",
            error: "Internal server error",
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(Password, user.Password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                Email: user.Email,
                Role: user.Role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.status(201).json({ message: "SignIn successful", token });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: "Internal server error",
        });
    }
});

// middleware to authenticate JWT

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                error: "Unauthorized: Invalid or expired token",
            });
        }

        req.user = user;
        next();
    });
}

// middleware to check if the user is admin

function isAdmin(req, res, next) {
    const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: "Invalid token",
            });
        }

        if (decoded.Role !== "admin") {
            return res.status(403).json({
                error: "Forbidden: You need an admin permission to access ⚠️",
            });
        }

        // req.user._id = decoded._id;
        next();
    });
}

// protected routes
app.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        user: req.user,
    });
});

app.get("/user-details", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-Password");

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        res.json({
            message: "User details fetched successfully",
            user,
        });
    } catch (error) {
        console.log("Error while retrieving user details:", error);
        res.status(500).json({
            message: "Something went wrong",
            error: "Internal server error",
        });
    }
});

//protected routes accessible to admins only

app.get("/admin/dashboard", authenticateToken, isAdmin, (req, res) => {
    res.json({
        message: "Welcome to admin dashboard",
        user: req.user,
    });
});

// const localIP = "192.168.16.101";

// app.listen(3000, localIP, () => {
//     console.log(`Server is running on http://${localIP}:3000`);
// });
