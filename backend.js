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

app.use(Express.urlencoded())
app.set("view engine","ejs")
app.use(Express.static("public"))
require("dotenv").config(); // Add at the top


const connectedData = db.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.get("/admission/form", function(req,res)
{
  res.render("applicationForm.ejs")
})

app.post("/admission/form", async function(req,res)
{
    const myName = req.body.myName;
    const myEmail = req.body.myEmail;
    const myNumber = req.body.myNumber;
    const myCity = req.body.myCity;
    const myFather = req.body.myFatherName
    
    const details = [myName, myEmail, myNumber, myCity, myFather]
    console.log(details)

    await connectedData.query("insert into admissions(studentName,studentEmail,studentPhoneNo,studentCity,studentFather) values(?)", [details])

    res.render("Home.ejs")
})

app.post("/contact", async function(req,res)
{
  console.log(req.body)
  const myName = req.body.myName;
  const myEmail = req.body.myEmail;
  const myMessage = req.body.myMessage

  const details = [myName, myEmail, myMessage]

  await connectedData.query("insert into contact(contactName,contactEmail,contactMessage) values(?)",[details])

 
})
app.listen("4001")