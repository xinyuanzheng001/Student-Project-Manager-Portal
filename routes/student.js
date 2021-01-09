/**
 * This file holds the function calls that will get the course/project information
 * for the courses and projects pages.
 */
const express = require("express");
const courseController = require("../controllers/courses");
const projectController = require("../controllers/projects");

const router = express.Router();

router.get("/main", (req, res) => {
    res.render("student/student");
})
// Add course route
router.get("/addcourse", (req, res) => {
    res.render("student/addcourse");
})
router.post("/addcourse", courseController.addcourse);
// View enrolled courses route
router.get("/enrolled", courseController.getEnrolledCourses);
// View profile and update route
router.get("/setting", courseController.setting);
router.post("/setting", courseController.updateSetting);

// View projects route
router.get("/projects", projectController.getProjects);
router.post("/view-project", projectController.viewsingleproject);
router.post("/select-project", projectController.select_project);
router.get("/student-project", projectController.getStudentProjects);
router.post("/submitprefs", projectController.submitprefs);


// export the router for other files to use
module.exports = router;