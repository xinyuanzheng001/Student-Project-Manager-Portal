/**
 * This file contains the function calls for professor view
 */
// import modules
const express = require("express");
const projectController = require("../controllers/projects");
const courseController = require("../controllers/courses");

const router = express.Router();

/**
 * POST the project preferences
 */
router.post("/submitprefs", projectController.submitprefs);


router.get("/main", (req, res) => {
    res.render("professor/professor");
})

// Create course route
router.get("/createcourse", (req, res) => {res.render("professor/createcourse")});
router.post("/createcourse", courseController.createcourse);
// View and Delete course route
router.get("/admin-view-courses", courseController.viewcourses);
router.post("/admin-view-courses", courseController.deletecourses);
// Add project route
router.get("/addproject", (req, res) => {res.render("professor/addproject")});
router.post("/addproject", projectController.addproject);
// View and Delete project route
router.get("/admin-view-projects", projectController.viewprojects);
router.post('/admin-view-projects', projectController.deleteproject);
// View project detail and update the detail route
router.post("/view-project", projectController.viewsingleproject);
router.post("/update", projectController.updateProject);
// Assign project route
router.get("/select-project", courseController.getcourses);
router.post("/select-project", projectController.assignProjects);
// View profile and update route
router.get("/admin-settings", courseController.setting);
router.post('/admin-settings', courseController.updateSetting);


// export the router for other files to use
module.exports = router;