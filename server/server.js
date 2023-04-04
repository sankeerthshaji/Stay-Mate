require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mongoose = require("mongoose");
const cors = require("cors");

//express app
const app = express();

//middleware
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req,res,next)=>{
    console.log(req.method, req.path);
    next();
});

//routes
app.use("/", userRoutes);
app.use("/admin",adminRoutes)

//connect to db
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () =>
      console.log(`Connecting to db & listening on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("Oh no mongo error!!!");
    console.log(err);
  });