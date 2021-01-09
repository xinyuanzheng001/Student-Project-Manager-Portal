/**
 * This file contains the functions that will authenticate
 */

const mysql = require("mysql");
const md5 = require("md5");

const db = mysql.createConnection({
    // host IP address
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    // database name
    database: process.env.DATABASE
})

// register a new user
exports.register = (req, res) => {
    let e = false;
    // get information from HTML form
    const { username, password, confirmPassword, email, role } = req.body;    
    // check password
    if (password != confirmPassword) {
        res.render('register', {
            message: "Passwords do not match!"
        })
        e = true;
    }
    
    // query the database for the input email
    else{
        db.query("SELECT email FROM users WHERE email = ?", [email], (error, results) => {
        if (error) {
            res.render('register', {
                message: "An error occured"
            });
            e = true;
        }
        // if the email is already registered send a message and go back to register page
        else if (results.length > 0) {
            res.render('register', {
                message: "That email is already registered"
            });
            e = true;
        }

        // insert new user into the users table
        if (e === false) {
            db.query("INSERT INTO users SET ?", { username:username, email: email, authentication: md5(password), role:role }, (error, results) => {
                if (error) {
                    res.render('register', { 
                        message: "An error occured"
                    })
                }
                else {
                    res.render('index', {
                        message: "Account registered"
                    })
                }
            })
    
        };    
    })}
}

// authenticate and login a new user
exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT role, id FROM users WHERE email = ? AND authentication = ?", [email, md5(password)], (error, results) => {
        if (error) {
            res.render('index', {
                message: "Could not log in, try again"
            })
        } else if (results.length === 0) {
            res.render('index', {
                message: "Wrong email or password"
            })
        } else {
            let role = results[0]['role'];
            if (role === 'student'){
                req.session.email = email;
                req.session.role = role;
                req.session.userid = results[0]['id'];
                req.params.userID = results[0].id;
                res.redirect("/student/main");
            } else {
                req.session.email = email;
                req.session.role = role;
                req.session.userid = results[0]['id'];
                req.params.userID = results[0].id;
                res.redirect("/professor/main");
            } 
        }
    })
}