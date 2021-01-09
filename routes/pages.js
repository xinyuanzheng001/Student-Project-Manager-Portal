/**
 * This file contains all of the routes for our website.
 */
// import modules
const express = require("express");
const courseController = require("../controllers/courses")

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/addcourse", (req, res) => {
    res.render("addcourse");
});

router.get("/courses", (req, res) => {
    res.render("courses");
});

router.get("/admin-view-courses", (req, res) => {
    res.render("admin-view-courses");
});

router.get("/admin-view-projects", (req, res) => {
    res.render("admin-view-projects");
});

router.get("/view-project", (req, res) => {
    res.render("view-project");
});


// export the router for other files to use
module.exports = router;