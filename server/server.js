const express = require("express")
const cors = require("cors");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// start server
app.listen(9000, () => {
    console.log("Server running on port 9000");
});

// to start to server 
// go inside server folder (cd server)
// then run (npm run dev)