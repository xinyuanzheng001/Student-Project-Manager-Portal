/**
 * This file contains the functions that will retrieve the user's course information from the database.
 */
const mysql = require("mysql");
const e = require("express");
const md5 = require("md5");

const db = mysql.createConnection({
    // host IP address
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    // database name
    database: process.env.DATABASE
})

// Student add a course
exports.addcourse = (req, res) => {
    const course_code = req.body.coursecode;
    db.query("SELECT * FROM courses WHERE id=?", [course_code], (error, result) => {
        if(error) {
            res.render('student/addcourse', {
                message: "An error occured, Please try again!"
            })
        } else if (result.length == 0) {
            res.render('student/addcourse', {
                message: "No course found with that course code!"
            })
        } else {
                db.query("INSERT INTO enrolled SET ? ", {course_id:course_code, student_id: req.session.userid}, (error, result) => {
                    if (error) {
                        console.log(error)
                        res.render('student/addcourse', {
                            message: "An error occured, Please try again!2"
                        })
                    } else {
                        res.render('student/addcourse', {
                            message: "You have successfully enrolled!"
                        })
                    }
                })
            }
        })   
    }


// Get all courses that student enrolled and display them
exports.getEnrolledCourses = (req, res) => {
    // query the database for all of the courses the user is enrolled in
    db.query("SELECT courses.course_number, course_description, professor FROM enrolled JOIN courses WHERE courses.id = enrolled.course_id AND enrolled.student_id = ?", [req.session.userid], (error, results) => {
        if (error) {
            res.render("student/courses", {
                userID: req.userID,
                message: "An unexpected error occured"
            })
        }
        // enter if statement if the user is not enrolled in any courses
        else if (results.length <= 0) {
            res.render("student/courses", {
                userID: req.userID,
                message: "You are not enrolled in any courses",
            })
        }
        else {
            req.results = results;
            res.render("student/courses", {
                userID: req.userID,
                results: results
            })
        }
    })
}

// View profile
exports.setting = (req, res) => {
    db.query("SELECT * FROM users WHERE id = ?", [req.session.userid], (error, result) => {
        if(error) {
            if (req.session.role == 'student') {
                res.render('student/setting', {
                    message: "An unknown error occured!",
                    username: result[0]['username'],
                    email: result[0]['email']
                })
            } else {
                res.render('professor/admin-settings', {
                    message: "An unknown error occured!",
                    username: result[0]['username'],
                    email: result[0]['email']
                })
            }
        } else {
            if (req.session.role == 'student') {
                res.render('student/setting', {
                    username: result[0]['username'],
                    email: result[0]['email']
                })
            } else {
                res.render('professor/admin-settings', {
                    username: result[0]['username'],
                    email: result[0]['email']
                })
            }
        }
    })
}

// Allow user to update their profile
exports.updateSetting = (req, res) => {
    const { username, email, password, new_password, confirm_password } = req.body;
    db.query("SELECT * FROM users WHERE id = ?", [req.session.userid], (error, result) => {
        // Determine whether the user is student or professor
        if (req.session.role == 'student') {
            if(error) {
                res.render('student/setting', {
                    message: "An unknown error occured",
                    username: username,
                    email: email
                })
            } else if (md5(password) != result[0]['authentication']) {
                res.render('student/setting', {
                    message: "Wrong password",
                    username: username,
                    email: email
                })
            } else if (new_password != confirm_password) {
                res.render('student/setting', {
                    message: "New password does not match!",
                    username: username,
                    email: email
                })
            } else if (username == result[0]['username'] && email == result[0]['email'] && !new_password && !confirm_password ) {
                res.render('student/setting', {
                    message: "Nothing updated!",
                    username: username,
                    email: email
                })
            } else {
                if (new_password) {
                    db.query("UPDATE users SET ? WHERE id = ?", [{username:username, email:email, authentication:md5(new_password)}, req.session.userid], (error, result) => {
                        if(error) {
                            res.render('student/setting', {
                                message: "An unknown error occured!",
                                username: username,
                                email: email
                            })
                        } else {
                            res.render('student/setting', {
                                message: "Updated",
                                username: username,
                                email: email
                            })
                        }
                    })
                } else {
                    db.query("UPDATE users SET ? WHERE id = ?", [{username:username, email:email}, req.session.userid], (error, result) => {
                        if(error) {
                            res.render('student/setting', {
                                message: "An unknown error occured!",
                                username: username,
                                email: email
                            })
                        } else {
                            res.render('student/Setting', {
                                message: "Updated",
                                username: username,
                                email: email
                            })
                        }
                    })
                }
            }
        } else if(req.session.role == 'professor') {
            if(error) {
                res.render('professor/admin-settings', {
                    message: "An unknown error occured",
                    username: username,
                    email: email
                })
            } else if (md5(password) != result[0]['authentication']) {
                res.render('professor/admin-settings', {
                    message: "Wrong password",
                    username: username,
                    email: email
                })
            } else if (new_password != confirm_password) {
                res.render('professor/admin-settings', {
                    message: "New password does not match!",
                    username: username,
                    email: email
                })
            } else if (username == result[0]['username'] && email == result[0]['email'] && !new_password && !confirm_password ) {
                res.render('professor/admin-settings', {
                    message: "Nothing updated!",
                    username: username,
                    email: email
                })
            } else {
                if (new_password) {
                    db.query("UPDATE users SET ? WHERE id = ?", [{username:username, email:email, authentication:md5(new_password)}, req.session.userid], (error, result) => {
                        if(error) {
                            res.render('professor/admin-settings', {
                                message: "An unknown error occured!",
                                username: username,
                                email: email
                            })
                        } else {
                            res.render('professor/admin-settings', {
                                message: "Updated",
                                username: username,
                                email: email
                            })
                        }
                    })
                } else {
                    db.query("UPDATE users SET ? WHERE id = ?", [{username:username, email:email}, req.session.userid], (error, result) => {
                        if(error) {
                            res.render('professor/admin-settings', {
                                message: "An unknown error occured!",
                                username: username,
                                email: email
                            })
                        } else {
                            res.render('professor/admin-settings', {
                                message: "Updated",
                                username: username,
                                email: email
                            })
                        }
                    })
                }
            }

        }
    })
}


// Professor's page, create a course
exports.createcourse = (req, res) => {
    const { coursenumber, description, num_prefs } = req.body;
    // generate a random code for the course
    course_id = Math.random().toString(36).substring(2, 10);
    let email = req.session.email;
    db.query("SELECT username FROM users WHERE email=?", [email], (error, result)=>{
        if (error) {
            res.render("professor/createcourse", {
                message: "An error occured!"
            })
        } else {
            db.query("INSERT INTO courses SET ?", { id:course_id, course_number:coursenumber, course_description:description, professor: result[0]['username'], user_id:req.session.userid, num_prefs: num_prefs }, (error, result) => {
                if(error) {
                    console.log(error);
                    res.render('professor/createcourse', {
                        message: "An error occured. Please try again!"
                    })
                } else {
                    res.render('professor/createcourse', {
                        message: "Course created!"
                    })}
                })}
            })};
// View all courses that professor created
exports.viewcourses = (req, res) => {
    db.query("SELECT * FROM courses WHERE user_id = ?", [req.session.userid], (error, result) => {
        if (error) {
            res.render("professor/admin-view-courses", {
                message: "An error occured!"
            })
        } else if (result.length == 0) {
            res.render("professor/admin-view-courses", {
                message: "No courses found!"
            })
        } else {
            res.render("professor/admin-view-courses", {
                results: result
            })
        }
    })
};
// Allow professor to delete a course
exports.deletecourses = (req, res) => {
    const { course_id } = req.body;
    db.query("DELETE FROM courses WHERE id = ?", [course_id],(error, result) => {
        if(error) {
            res.render("professor/admin-view-courses", {
                message: "An error occured!"
            })
        } else {
            db.query("DELETE FROM projects WHERE course_id = ?", [course_id], (error, result) => {
                if (error) {
                    res.render("professor/admin-view-courses", {
                        message: "An error occured!"
                    })
                } else {
                    this.viewcourses(req, res);
                }
            })
        }
    })
}
// Select course and assign project
exports.getcourses = (req, res) => {
    db.query("SELECT * FROM courses", (error, result) => {
        if (error) {
            res.render("professor/select-project", {
                message: "An error occured!"
            })
        } else {
            let courses = [];
            let s = new Set();
            for (let i = 0; i < result.length; i++) {
                let c_id = result[i]['id'];
                let c_number = result[i]['course_number'];
                if(!s.has(c_id)) {
                    s.add(c_id);
                    courses.push({course_id: c_id, course_number:c_number})
                }
            }
            res.render("professor/select-project", {
                courses: courses
            })
        }
    })
}