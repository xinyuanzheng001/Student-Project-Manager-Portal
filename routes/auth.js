/**
 * This file contains all of the routes for user authentication.
 */
// import modules
const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

/**
 * POST new accout information to register a user
 */
router.post("/register", authController.register);

/**
 * POST login information to authenticate user
 */
router.post("/login", authController.login);

/**
 * Logout of account by erasing session variables
 */
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

// export the router for other files to use
module.exports = router;