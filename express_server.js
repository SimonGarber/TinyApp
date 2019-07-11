const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require(`cookie-parser`);

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


const generateRandomString = function () {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  };
  return result;
};  
/*-----------------------------[Users Database]------------------------------------------------*/
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
/*------------------------------[URL Database]----------------------------------------------------*/
const urlDatabase = {
  "b2xVn2":{longURL: "http://www.lighthouselabs.ca", userId:"aJ48LW" } ,
  "9sm5xK": {longURL:"http://google.com", userId:"aJ48LW"}
};
/*-------------------------[Email Lookup Helper function]-------------------------------------*/
const emailLookUp = function (email) {
 for (i in users) {
   if (users[i].email === email) {
     return true 
   }
 } 
 return false
};
/*--------------------------[Password Lookup Helper Function]-------------------------------*/
const pwLookup = function (password) {
  for (i in users) {
    if (users[i].password === password) {
      return true
    }
  }
  return false
};
/*-------------------------------------------------------------------------------------------*/
const findUserByEmail = function (email) {
  for (i in users) {
    if (users[i].email === email) {
      return users[i]
    }
  }
return false;
}
/*---------------------------------------------------------------------------------------------*/
function urlsForUser(id) {
  let result = {}
  for (key in urlDatabase) {
     if (urlDatabase[key].userId === id) {
       result[key] = urlDatabase[key]
    }
   
  }
  return result
}

/*-----------------------------------------------------------------------------------------------*/
app.get("/register", (req,res)=> {

  let userId = req.cookies.user_id
  let templateVars = {
   urls: urlDatabase,
   user: users[userId]
 }
 res.render("urls_register",templateVars)

 });


/*-------------------------------------------------------------------------------------------------*/
app.get("/", (req, res) => {
    res.send("hello!");
    // res.send is replaced with res.render once ejs view files are added.
});
/*--------------------------------------------------------------------------------------------------*/
app.get("/urls.json", (req,res) => {
    res.json(urlDatabase);
});
/*--------------------------------------------------------------------------------------------------*/
app.get("/hello", (req,res) => {
  let userId = req.cookies.user_id
  let templateVars = {
    user: users[userId],
    greeting: "Hello World!"
    };
    res.render("Hello_World", templateVars);
});
/*---------------------------------------------------------------------------------------------------*/
app.get("/urls", (req,res) => {
  if(req.cookies.user_id) {
    const key = req.cookies.user_id
    const userUrls = urlsForUser(key)
    let templateVars = {
     user: users[key], 
     urls: userUrls,
    };    
    res.render("urls_index", templateVars); 
  } else {
    res.redirect('/login')
  }
});
  
/*----------------------------------------------------------------------------------------------------*/
app.get("/urls/new", (req,res) => {
  let userId = req.cookies.user_id
  if(userId === undefined ) {
    res.redirect("/login")
  } else {  
    let templateVars = {
      user: users[userId]
    }
    res.render("urls_new",templateVars); 
  }
});
/*-----------------------------------------------------------------------------------------------------*/  
app.get("/login", (req,res)=> {
  let userId = req.cookies.user_id

  let templateVars = {
  user: users[userId]
  }
  
  res.render("urls_login",templateVars)
  
});
/*------------------------------------------------------------------------------------------------------*/     
app.get("/urls/:shortURL", (req,res) => {
 

let templateVars = {
    
    user: users[req.cookies.user_id], 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]["longURL"]
}; 
res.render("urls_show", templateVars);
});
/* ------------------------------------------------------------------------------------------------------*/
app.get("/u/:shortURL", (req,res) => {
    const longURL = urlDatabase[req.params.shortURL]['longURL']
    const key = req.params.shortURL
    res.redirect(longURL)
});
/*--------------------------------------------------------------------------------------------------------*/ 
app.post("/urls", (req, res) => {
  if (req.cookies.user_id){
    let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body['longURL'],
    userId: req.cookies.user_id,}
    console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect(403,'/urls');
  }
  
});
    
app.post("/urls/:shortURL/delete", (req, res) => {
  if(urlDatabase[req.params.shortURL].userId === req.cookies.userId){
    delete urlDatabase[req.params.shortURL]
    res.redirect("/urls");
    } else {
        res.status(403).send("ah ah ah , you didn't say the magic word...")
    }
});

  

app.post("/urls/:id", (req,res) => {
const shortURL = req.params.id
urlDatabase[shortURL].longURL = req.body.longURL
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
  

  





