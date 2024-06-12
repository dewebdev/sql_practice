// Get the client
const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, (req, res) => {
  console.log(`Server Listening at PORT ${PORT}`);
});

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "deWebDev_app",
  password: "if0rg0t!10",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Insert query
// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
// }

// let q = "INSERT INTO users (id, username, email, passwd) VALUES ?";

// try {
//   connection.query(q, [data], (err, res) => {
//     console.log(res);
//   });
// } catch (error) {
//   console(err);
// }

// A simple SELECT query

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM users";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});

app.get("/user", (req, res) => {
  let q = "SELECT id,username,email FROM users";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("users.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edituser.ejs", { user });
    });
  } catch (err) {
    res.send("Something Went Through! Try again :) ");
  }
});

app.patch("/user/:id", (req, res) => {
  let { username: newUsername, password: formPassword } = req.body;

  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (user.passwd != formPassword) {
        res.send("Password Incorrect:( Retry Again");
      } else {
        let q2 = `UPDATE users SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    res.send("Something Went Through! Try again :) ");
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("deleteuser.ejs", { user });
    });
  } catch (err) {
    res.send("Something Went Through! Try again :) ");
  }
});

app.delete("/user/:id", (req, res) => {
  let { password: formPassword } = req.body;

  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (user.passwd != formPassword) {
        res.send("Password Incorrect:( Retry Again");
      } else {
        let q2 = `DELETE FROM users WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    res.send("Something Went Through! Try again :) ");
  }
});

app.get("/user/add", (req, res) => {
  res.render("adduser.ejs");
});

app.post("/user/add", (req, res) => {
  let {
    username: newUsername,
    password: newPassword,
    email: newEmail,
  } = req.body;

  let id = uuidv4();

  let q = "INSERT INTO users VALUES(?,?,?,?)";
  connection.query(
    q,
    [id, newUsername, newEmail, newPassword],
    (err, result) => {
      res.redirect("/user");
    }
  );
});
