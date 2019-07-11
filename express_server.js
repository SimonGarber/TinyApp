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

const users = {
"userRandomID": {
 id: "userRandomID",
 email: "user@example.com",
 password: "purple-monkey-dinosaur"  
},
"user2RandomID": {
 id: "user2RandomID",
 email: "user2@example.com",
 password: "dishwasher-funk" 
}  
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://google.com"
};

const emailLookUp = function (email) {
 for (i in users) {
   if (users[i].email === email) {
     return true 
   }
 } 
 return false
};

const pwLookup = function (password) {
  for (i in users) {
    if (users[i].password === password) {
      return true
    }
  }
  return false
};

const findUserByEmail = function (email) {
  for (i in users) {
    if (users[i].email === email) {
      return users[i]
    }
  }
return false;
}

// const myAlert = function (reason) {
//   if (reason = alreadyExists)
//   res.status.send(400).message("This user already exists");
//   else if(reason = noEmail) {
//   res.status.send(400).message("Please enter an email");
//     }
//   }
app.get("/register", (req,res)=> {

  let userId = req.cookies.user_id
  let templateVars = {
   urls: urlDatabase,
   user: users[userId]
 }
 res.render("urls_register",templateVars)

 });



app.get("/", (req, res) => {
    res.send("hello!");
    // res.send is replaced with res.render once ejs view files are added.
});

app.get("/urls.json", (req,res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  let userId = req.cookies.user_id
  let templateVars = {
    user: users[userId],
    greeting: "Hello World!"
    };
    res.render("Hello_World", templateVars);
});

app.get("/urls", (req,res) => {
  
  let userId = req.cookies.user_id
  let templateVars = {
   user: users[userId], 
   urls: urlDatabase,
  };
      
  res.render("urls_index", templateVars); 
});

app.get("/urls/new", (req,res) => {
  let userId = req.cookies.user_id
  
    let templateVars = {
      user: users[userId]
    }
    res.render("urls_new",templateVars);  
  });
  

  
app.get("/login", (req,res)=> {
  let userId = req.cookies.user_id

  let templateVars = {
  user: users[userId]
  }
  
  res.render("urls_login",templateVars)
});

app.get("/urls/:shortURL", (req,res) => {
  let userId = req.cookies.user_id

let templateVars = {
    user: users[userId], 
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
  res.redirect(`/urls/${shortURL}`);
});
    
app.post("/urls/:shortURL/delete", (req, res) => { 
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls");  
});

app.post("/urls/:id", (req,res) => {
const shortURL = req.params.id
urlDatabase[shortURL] = req.body.longURL
res.redirect("/urls");
});

app.post("/login", (req,res)=> {
  if(!emailLookUp(req.body.email) || !pwLookup(req.body.password)) {
    res.redirect(403,'/login');
  } else if (!req.body.email || !req.body.password) {
    res.redirect(403,'/login')
  } else {
    let user = findUserByEmail(req.body.email)
    res.cookie("user_id",user.id)
    res.redirect("/urls");
  }
});
    
    
    
    
    
  
   
   

  

  




app.post("/logout", (req, res) => {
res.clearCookie('user_id')
res.redirect('/urls');   
});

app.post("/register", (req, res) => {
  
if(emailLookUp(req.body.email)) {
res.redirect(400,'/register');
} else if (!req.body.email) {
res.redirect(400,'/register')
} else if (!req.body.password) {
res.redirect(400,'/register')
} else {

const newUser = generateRandomString()
users[newUser] = {  

  id: newUser,
  email: req.body.email,
  password: req.body.password
}
res.cookie("user_id",users[newUser].id)
res.redirect("/urls")
}    
}); 

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


