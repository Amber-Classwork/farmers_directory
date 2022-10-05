require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const APIVERSION1 = require("./api/api-v1");
const mongoose = require("mongoose");
// const { swaggerDocs: V1SwaggerDocs} = require( "./swagger")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1", APIVERSION1);
app.get("/", (req, res, next)=>{
   res.status(200).sendFile(__dirname+"/index.html");
})
mongoose.connect(process.env.DB_URI, {}, () => {
   console.log("database connection established");
});

app.listen(PORT, () => {
   console.log("listening on port ", PORT);
//    V1SwaggerDocs( app, PORT)
});
