require("dotenv").config({ silent: true });

// Provide system variables for an app in a single object

const settings = {
    currentEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 7000,
    db: {
        port: process.env.DB_PORT || 27017,
        hostname: process.env.DB_HOSTNAME || "",
        username: process.env.DB_USERNAME || "",
        password: process.env.DB_PASSWORD || "",
    },
}

export default settings;