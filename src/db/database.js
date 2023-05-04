const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/movie_application", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MogoDB is connect 📀📀📀📀📀");
  })
  .catch((err) => {
    console.log("no data find");
  });
