const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

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

app.get("/urls/:shortURL", (req,res) => {
console.log(req.params.shortURL)
let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };

res.render("urls_show", templateVars);

});

app.listen(PORT, () => {
    
    console.log(`Example app listening on port ${PORT}!`);
});
