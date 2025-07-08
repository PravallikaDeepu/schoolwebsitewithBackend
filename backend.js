/*Storing Data in JSON file*/
// const Express = require("express")
// const app = Express()
// const myPath = require("path")
// const FileSystem = require("fs")


// app.use(Express.urlencoded())
// app.use(Express.static(myPath.join(__dirname, 'public')));

// // app.use(Express.static(__dirname))

// app.set("view engine", "ejs")
// app.get("/admission/form", function(req,res)
// {
//     console.log("HIiiiiiiiiiiii")
//     res.render("applicationForm.ejs")
   
// })

// app.post("/collect/data", function(req,res)
// {
//     const readData = FileSystem.readFileSync("contact.json")
//     const actualReadData = JSON.parse(readData)
    

//     const studentData = {
//         studentName: req.body.myName,
//         studentEmail: req.body.myEmail,
//         studentNumber: req.body.myNumber,
//         studentCity: req.body.myCity,
//         studentFatherName: req.body.myFatherName
//     }

//     actualReadData.push(studentData)
//     console.log(actualReadData)

//     const data = FileSystem.writeFileSync("contact.json",JSON.stringify(actualReadData))

//     res.render("Home.ejs")
// })

// app.listen(3001)



//Storing data in Mysql
const Express = require("express")
const app = Express()
const db = require("mysql2/promise")
const CORS = require("cors")

app.use(Express.urlencoded())
app.use(Express.json());  // Add this line to parse JSON request bodies

app.use(CORS())
app.set("view engine","ejs")
app.use(Express.static("public"))
require("dotenv").config(); // Add at the top


const connectedData = db.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.get("/", function(req,res)
{
  res.render("Home.ejs")
})

app.post("/admission/form", async function (req, res) {
  try {
    console.log(req.body, "Hi");

    const firstName = req.body.myFirst;
    const lastName = req.body.myLast;
    const myEmail = req.body.myEmail;
    const myFather = req.body.myFather;
    const phoneNo = req.body.phone;
    const myGender = req.body.myGender;
    const myPercentage = req.body.myPercentage;
    const myClass = req.body.myClass;
    const rawDob = req.body.myDob;

    const details = [
      firstName,
      lastName,
      myEmail,
      myFather,
      phoneNo,
      rawDob,
      myPercentage,
      myGender,
      myClass
    ];

    await connectedData.query(
      "INSERT INTO admissions(studentFirstName, studentLastName, studentEmail, studentFather, studentPhoneno, studentDob, studentPercentage, studentGender, studentClass) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      details
    );

    res.json({ message: "Your details saved successfully!" });

  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ message: "Failed to save form." });
  }
});


app.post("/contact", async function (req, res) {
  try {
    console.log(req.body);

    const { myName, myEmail, myMessage } = req.body;
    const details = [myName, myEmail, myMessage];

    await connectedData.query(
      "INSERT INTO contact(contactName, contactEmail, contactMessage) VALUES (?, ?, ?)",
      details
    );

    res.json({ message: "Contact form submitted successfully! 💐💐💐" });
  } catch (error) {
    console.error("Contact insert error:", error);
    res.status(500).json({ message: "Failed to submit contact form." });
  }
});
app.listen("4001")
