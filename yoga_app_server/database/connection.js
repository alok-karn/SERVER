const mongoose = require("mongoose");
const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            `Connected to mongo instance ${connection.connection.host}`
        );
    } catch (error) {
        console.error("Error connecting to mongo", error);
        process.exit(1);
    }
};

module.exports = connect;
