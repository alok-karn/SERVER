const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Age: {
        type: Number,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    Weight: {
        type: Number,
        required: true,
    },
    Height: {
        type: Number,
        required: true,
    },
    FitnessLevel: {
        type: String,
        required: true,
    },
    YogaExperience: {
        type: String,
        required: true,
    },
    YogaGoals: {
        type: String,
        required: true,
    },
    YogaStyle: {
        type: String,
        required: true,
    },
    YogaDuration: {
        type: Number,
        required: true,
    },
    YogaFrequency: {
        type: Number,
        required: true,
    },
    YogaIntensity: {
        type: String,
        required: true,
    },
    YogaIntensityLevel: {
        type: Number,
        required: true,
    },
    YogaIntensityLevelDescription: {
        type: String,
        required: true,
    },
    YogaIntensityLevelColor: {
        type: String,
        required: true,
    },
    Role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
