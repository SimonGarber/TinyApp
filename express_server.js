const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require(`cookie-parser`);

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/* Random Character Generator function for Short URLs */
const generateRandomString = function () {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  };
  return result;
};  
  
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://google.com"
};

app.get("/", (req, res) => {
    res.send("hello!");
    // res.send is replaced with res.render once ejs view files are added.
});

app.get("/urls.json", (req,res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  let templateVars = {
    username: req.cookies["username"],
    greeting: "Hello World!"
    };
    res.render("Hello_World", templateVars);
});

app.get("/urls", (req,res) => {
  let templateVars = {
   username: req.cookies.username, 
      urls: urlDatabase,
      
  };
  res.render("urls_index", templateVars);
    
});

app.get("/urls/new", (req,res) => {
  let templateVars = {
    username: req.cookies.username
  }
  
  res.render("urls_new",templateVars);  
});

app.get("/urls/:shortURL", (req,res) => {
// console.log(req.params.shortURL)
let templateVars = {
    username: req.cookies.username, 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
};
res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req,res) => {
    const longURL = urlDatabase[req.params.shortURL]
    const key = req.params.shortURL
    res.redirect(longURL)
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] =  req.body.longURL
  // console.log(urlDatabase[shortURL])
  res.redirect(`/urls/${shortURL}`);
});
    
app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(key) // Prints the ShortURL
  // console.log(urlDatabase[key]) //Prints the longURL 
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls");  
});

app.post("/urls/:id", (req,res) => {
const shortURL = req.params.id
urlDatabase[shortURL] = req.body.longURL
// req.body.longURL = urlDatabase[req.params.shortURL]
// console.log(urlDatabase[req.params.id]) //Prints out the longURL we are editing
// console.log(req.params.id) //Prints out the shortURL of the long
res.redirect("/urls")
});

app.post("/login", (req,res)=> {
if(req.body.username){
    // let username = req.body.username
    res.cookie("username",req.body.username);
    console.log(`Welcome to Tiny App ${req.body.username}!`);
}
res.redirect("/urls");
});

app.post("/logout", (req, res) => {
res.clearCookie("username")
res.redirect('/urls');   
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


   
    
    





