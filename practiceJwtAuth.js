const express = require ('express');
const jwt = require ('jsonwebtoken');
const JWT_SECRET = "pawan123123";
const app = express();
app.use(express.json());

const users = [];

app.post("/signup",logger, function(req, res) {
    const username = req.body.username
    const password = req.body.password

    users.push ({
        username: username,
        password: password
    })

    //we should check if a user with this username already exists

    res.json({
        message: "You are signed up!"
    })
})

app.post("/signin",logger, function(req, res) {
    const username = req.body.username
    const password = req.body.password

    let foundUser = null;

    for (let i=0; i<users.length; i++) {
        if(users[i].username === username && users[i].password === password) {
            foundUser = users[i]
        }
    }

    if (!foundUser){
        res.json({
            message: "credentials incorrect"
        })
        return;
    } else {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.header("jwt", token);  // if you want to send the token in the response header you can send it like this
        res.header("random", "pawan");

        res.json({
            token: token
        })
    }

})

function auth (req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData.username) {
        req.username = decodedData.username;
        next();
    } else{
        res.json({
            message: "Unauthorized"
        })
    }
}

function logger(req, res, next){
    console.log(`${req.method} request came`);
    next();
}

app.get("/me", logger, auth, function(req, res) {
    
    if(req.username) {
        let foundUser = null;

        for (let i=0; i<users.length; i++) {
            if (users[i].username === req.username) {
                foundUser = users[i]
            }
        }

        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }
})

app.get("/todo", auth, function(req, res){
    
})

app.post("/todo", auth, function(req, res){
    
})

app.delete("/todo", auth, function(req, res){
    
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})