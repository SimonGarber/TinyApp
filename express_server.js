const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const generateRandomString = function () {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
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
})

app.get("/hello", (req,res) => {
    let templateVars = {greeting: "Hello World!"};
    res.render("Hello_World", templateVars);
});

app.get("/urls", (req,res) => {
   
    let templateVars = { urls: urlDatabase};
    res.render("urls_index", templateVars);
    
});

app.get("/urls/new", (req,res) => {
    res.render("urls_new");  
})

app.get("/urls/:shortURL", (req,res) => {
// console.log(req.params.shortURL)
let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };

res.render("urls_show", templateVars);

});

app.get("/u/:shortURL", (req,res) => {
    const longURL = urlDatabase[req.params.shortURL]
    
    res.redirect(longURL)
});

app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] =  req.body.longURL
    console.log(urlDatabase[shortURL])
    res.redirect(`/urls/${shortURL}`);
    
});





app.listen(PORT, () => {
    
    console.log(`Example app listening on port ${PORT}!`);
});
