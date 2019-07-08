const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
const urlDatabase = {
    "bZVn2": "http://www.lighthouselabs.ca",
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
    res.send("<html><body>hello <b>World</b></body</html>\n");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
