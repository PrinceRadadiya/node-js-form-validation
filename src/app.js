require("dotenv").config();
const express = require("express");
require("./db/database");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const aurt = require("./middleware/aurt");

const port = 5000;
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));
const housedata = require("./module/manukaka");
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templet/views");
const partials_path = path.join(__dirname, "../templet/partials");

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use(express.static(static_path));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", aurt, (req, res) => {
  res.render("login");
});
app.get("/logout", aurt, async (req, res) => {
  try {
    // this is user to multipal device to use on divice logout not another divice logout
    req.user.token = req.user.token.filter((currToken) => {
      return currToken.token !== req.token;
    });

    res.clearCookie("jwt_token");
    // console.log("log out")
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/signin", aurt, async (req, res) => {
  try {
    // this is user to multipal device to use on divice logout not another divice logout
    req.user.token = [];

    res.clearCookie("jwt_token");
    // console.log("log out")
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
const {username,email,password,confirm} = req.body;
  if(!username || !email || !password || !confirm){
    return res.status(422).send("Please fill up the information")
  }

  try {
    const password = req.body.password;
    const confirm = req.body.confirm;

    if (password === confirm) {
      const registation = new housedata({
        username: req.body.username,
        email: req.body.email,
        password: password,
        confirm: confirm,
      });
     
      // console.log(registation)

      const token = await registation.genrateAurtToken();
      // console.log(token);
      res.cookie("jwt_token", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
        // secure:true   this is only HTTPS connection
      });
      const user_data = await registation.save();

      // console.log(user_data)
      res.status(200).render("login");
    } else {
      res.send("password is not maching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const mailfind = await housedata.findOne({ email: email });
    // console.log(mailfind);
    const ismatch = bcrypt.compare(password, mailfind.password);
    // console.log(ismatch);
    const token = await mailfind.genrateAurtToken();
    console.log(token)

    res.cookie("jwt_token", token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
      // secure:true   this is only HTTPS connection
    });

    if (ismatch) {
      res.status(201).render("shopping");
    }
  } catch (error) {
    res.status(400).send("invalid Email");
  }
});

app.listen(port, () => {
  console.log(`start code ${port}😜😜😜😜`);
});
