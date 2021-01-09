const mysql = require("mysql");
const e = require("express");
const {spawn} = require("child_process");
const { type } = require("os");

// connect to database
const db = mysql.createConnection({
    // host IP address
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    // database name
    database: process.env.DATABASE
})


// To add a project into database
exports.addproject = (req, res) => {
    const { projectName, projectDescription, clientName, clientEmail, extraDetails, courseID} = req.body;

    let email = req.session.email;
    db.query("INSERT INTO projects SET ?", { project_name:projectName, project_detail: projectDescription, client_name: clientName, client_contact:clientEmail, extra_details:extraDetails, user_id:req.session.userid, course_id:courseID }, (error, result) => {
        if(error) {
            res.render('professor/addproject', {
                message: "An error occured. Please try again!"
            })
        } else {
            res.render('professor/addproject', {
                message: "Project Created!"
        })}
    })
};

// Get all projects from database and display them   
exports.viewprojects = (req, res) => {
    db.query("SELECT * FROM projects, courses WHERE courses.user_id = projects.user_id AND projects.course_id = courses.id AND courses.user_id=?", [req.session.userid], (error, result) => {
        if(error) {
            res.render("professor/admin-view-projects", {
                message: "An error occured!"
            })
        } else if (result.length == 0) {
            res.render("professor/admin-view-projects", {
                message: "No projects found"
            })
        } else {
            res.render("professor/admin-view-projects", {
                results: result
            })
        }
    })
};

// Delete a project
exports.deleteproject = (req, res) => {
    const { project_id } = req.body;
    db.query("DELETE FROM projects WHERE project_id = ?", [project_id], (error, result)=> {
        if(error) {
            res.render("professor/admin-view-projects", {
                message: "An error occured!"
            })
        } else {
            this.viewprojects(req, res);
        }
    })
}

// View the detail of the project 
exports.viewsingleproject = (req, res) => {
    let email = req.session.email;
    const { projectName, projectDetail, clientName, clientContact, extraDetails, courseNumber, professor, project_id, courseID } = req.body;

    if (req.session.role == 'student') {
        res.render('student/view-project', {
            project_name: projectName,
            project_detail: projectDetail,
            course_number: courseNumber,
            client_name: clientName,
            client_contact: clientContact,
            extra_details: extraDetails,
            // project_id: project_id
        })
    } else {
        res.render('professor/view-project', {
            project_name: projectName,
            project_detail: projectDetail,
            course_number: courseNumber,
            client_name: clientName,
            client_contact: clientContact,
            extra_details: extraDetails,
            project_id: project_id,
            courseID: courseID,
        })
    }
}

//update a project's info
exports.updateProject = (req, res) => {
    const { client_name, client_contact, project_detail, project_id } = req.body;
    db.query("UPDATE projects SET ? WHERE project_id = ?", [{client_name:client_name, client_contact:client_contact, project_detail:project_detail}, project_id], (error, result) => {
        if(error) {
            res.render('professor/view-project', {
                message: "An error occured!"
            })
        } else {
            res.render('professor/view-project', {
                message: "Project updated!",
                client_name:client_name,
                client_contact:client_contact,
                project_detail: project_detail,
                project_id: project_id
            })
        }
    })

}


// get available projects for enrolled classes
exports.getProjects = (req, res) => {
    db.query("SELECT * FROM projects, enrolled, courses WHERE enrolled.student_id = ? AND projects.course_id = enrolled.course_id AND courses.id=projects.course_id ORDER BY courses.id", [req.session.userid], (error, result) => {
        if(error) {
            res.render("student/projects", {
                message: "An error occured!"
            })
        } else if (result.length == 0) {
            res.render("student/projects", {
                message: "No project posted"
            })
        }
        else {
            let courses = [];
            let s = new Set();
            for (let i = 0; i < result.length; i++) {
                let c_id = result[i]['course_id'];
                let c_number = result[i]['course_number'];
                if(!s.has(c_id)) {
                    s.add(c_id);
                    courses.push({course_id: c_id, course_number:c_number})
                }
            }
            res.render("student/projects", {
                results: result,
                courses: courses
            })
        }
    })
}

// Display the projects in the course that student selected
exports.select_project = (req, res) => {
    const {course_id} = req.body;
    db.query("SELECT * FROM projects, courses WHERE projects.course_id=courses.id AND projects.course_id=?",[course_id], (error, result) => {
        if (error) {
            res.render("student/projects", {
                message: "An error occured!"
            })
        } else{
                res.render("student/select-project", {
                    results: result,
                    prefs: result[0].num_prefs,
                    id: result[0].id,
                    num_prefs: result[0].num_prefs
                });}
    })
}

/**
 * Submit students' project preference to the database
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.submitprefs = (req, res) => {
    const {id} = req.body;
    console.log(req.body, "--------------------");
    db.query("SELECT * FROM courses_info WHERE student_id = ? AND id = ?", [req.session.userid, id], (error, result) => {
        if (error) {
            res.render("student/select-project", {
                message: "An error occured"
            })
        } else if(result.length > 0) {
            db.query("SELECT * FROM projects, courses WHERE projects.course_id=courses.id AND projects.course_id=?",[id], (error, result) => {
                if (error) {
                    res.render("student/projects", {
                        message: "An error occured!"
                    })
                } else{
                    res.render("student/select-project", {
                        results: result,
                        prefs: result[0].num_prefs,
                        id: result[0].id,
                        num_prefs: result[0].num_prefs,
                        message: "You already submitted preference for this course"
                });}
            })
        } else {
            const {num_prefs} = req.body;
            if(num_prefs == 3) {
                const {pref1, pref2, pref3, id} = req.body;
                db.query("INSERT INTO courses_info SET ? ", {id:id, student_id:req.session.userid, proj_preference1:pref1, proj_preference2:pref2, proj_preference3: pref3}, (error, result) => {
                    if (error) {
                        res.render("student/select-project", {
                            message: "An error occured"
                        })
                    } else {
                        db.query("SELECT * FROM projects, courses WHERE projects.course_id=courses.id AND projects.course_id=?",[id], (error, result) => {
                            if (error) {
                                res.render("student/projects", {
                                    message: "An error occured!"
                                })
                            } else{
                                res.render("student/select-project", {
                                    results: result,
                                    prefs: result[0].num_prefs,
                                    id: result[0].id,
                                    num_prefs: result[0].num_prefs,
                                    message: "Preference submitted!"
                            });}
                    })
                }})
            } else if (num_prefs == 4) {
                const {pref1, pref2, pref3, pref4, id} = req.body;
                db.query("INSERT INTO courses_info SET ? ", {id:id, student_id: req.session.userid, proj_preference1: pref1, proj_preference2:pref2, proj_preference3: pref3, proj_preference4: pref4}, (error, result) => {
                    if (error) {
                        res.render("student/select-project", {
                            message: "An error occured"
                        })
                    } else {
                        db.query("SELECT * FROM projects, courses WHERE projects.course_id=courses.id AND projects.course_id=?",[id], (error, result) => {
                            if (error) {
                                res.render("student/projects", {
                                    message: "An error occured!"
                                })
                            } else{
                                res.render("student/select-project", {
                                    results: result,
                                    prefs: result[0].num_prefs,
                                    id: result[0].id,
                                    num_prefs: result[0].num_prefs,
                                    message: "Preference submitted!"
                            });}
                        })
                    }
                })
            } else if (num_prefs == 5) {
                const {pref1, pref2, pref3, pref4, pref5, id} = req.body;
                db.query("INSERT INTO courses_info SET ? ", {id:id, student_id: req.session.userid, proj_preference1: pref1, proj_preference2: pref2, proj_preference3: pref3, proj_preference4: pref4, proj_preference5: pref5}, (error, result) => {
                    if (error) {
                        res.render("student/select-project", {
                            message: "An error occured"
                        })
                    } else {
                        db.query("SELECT * FROM projects, courses WHERE projects.course_id=courses.id AND projects.course_id=?",[id], (error, result) => {
                            if (error) {
                                res.render("student/projects", {
                                    message: "An error occured!"
                                })
                            } else{
                                res.render("student/select-project", {
                                    results: result,
                                    prefs: result[0].num_prefs,
                                    id: result[0].id,
                                    num_prefs: result[0].num_prefs,
                                    message: "Preference submitted!"
                            });}
                        })
                    }
                })
            }
        }
    })
}

// get all projects in the courses that student enrolled
exports.getStudentProjects = (req, res) => {
    db.query("SELECT * FROM courses_info, courses WHERE student_id = ? AND courses_info.id=courses.id", [req.session.userid], (error, results)=> {
        if (error) {
            res.render("student/student-project", {
                message: "An error occured"
            })
        } else if(results.length == 0) {
            res.render("student/student-project", {
                message: "You have not chosen any projects!"
            })
        } else {
            res.render("student/student-project", {
                results: results
            })
        }
    })
}

/**
 * Using the provided algorithm, assign projects to students based on project preferences
 * 
 * @param {} req 
 * @param {*} res 
 */
exports.assignProjects = (req, res) => {
    const {course_id} = req.body;
    db.query("SELECT * FROM courses", (error, result) => {
        if (error) {
            res.render("professor/assign-projects", {
                message: "An error occured!"
            })
        } else{
            db.query("SELECT * FROM courses_info WHERE id=?", [course_id], (error, results) => {
                if (error) {
                    res.render("professor/assign-projects", {
                    message: "An error occured!"
                    })
                } else {
                    db.query("SELECT username FROM users JOIN courses_info ON users.id=courses_info.student_id WHERE courses_info.id=?", [course_id], (error, name) => {
                        if (error) {
                            res.render("professor/assign-projects", {
                                message: "An error occured!"
                            })
                        } else {
                            
                            // Get names of students and store into results object
                            for(var i = 0; i < results.length; i++) {
                                results[i]['name'] = name[i]['username'];
                            }
                            // Algorithm Begin
                            db.query("SELECT project_name, capacity FROM projects WHERE projects.course_id=?",[course_id], (error, proj) => {
                                if (error) {
                                    res.render("professor/assign-projects", {
                                    message: "An error occured!"
                                })
                                } 
                                else {

                                    //Storing capacities of members per project
                                    const capacities = {};
                                    for(var i = 0; i < proj.length; i++) {
                                        capacities[proj[i]['project_name']] = proj[i]['capacity'];   
                                    }
                                    db.query("SELECT num_prefs FROM courses where id=?",[course_id], (error, num_prefs) => {
                                        if (error) {
                                            res.render("professor/assign-projects", {
                                                message: "An error occured!"
                                            })
                                        } else {
                                            var prefs = {}
                                            num_prefs = num_prefs[0]['num_prefs'];
                                            // Storing class' preference in one object. Each property is a student. 
                                            // Each student has an array of his/her project preferences
                                            for(var i = 0; i < results.length; i++) {
                                                prefs[results[i]['name']] = [];
                                                for(var j = 1; j <= num_prefs; j++) {
                                                    switch(j) {
                                                        case 1: prefs[results[i]['name']].push(results[i]['proj_preference1']);
                                                            break;
                                                        case 2: prefs[results[i]['name']].push(results[i]['proj_preference2']);
                                                            break;
                                                        case 3: prefs[results[i]['name']].push(results[i]['proj_preference3']);
                                                            break;
                                                        case 4: prefs[results[i]['name']].push(results[i]['proj_preference4']);
                                                            break;
                                                        case 5: prefs[results[i]['name']].push(results[i]['proj_preference5']);
                                                            break;
                                                    }
                                                }
                                            }
                                            
                                            // convert prefs to JSON to pass to python script
                                            var asJSON = JSON.stringify(prefs);
                                            var capacitiesAsJSON = JSON.stringify(capacities);
                                            
                                            // create a child process that calls the python script and passes student preferences to it
                                            const python = spawn("python", ["algorithm.py", asJSON, capacitiesAsJSON]);
                                            // run the python script and return the output in the variable data
                                            python.stdout.on("data", (data) => {
                                                // make the output readable 
                                                dataToSend = data.toString();
                                                // parse the data from python file and make it readable
                                                dataToSend = JSON.parse(dataToSend);
                                                let p_group = [];
                                                for(let i in dataToSend){
                                                    // convert the data into array of objects
                                                    p_group.push({
                                                        "project": i,
                                                        "group" : dataToSend[i]
                                                    })
                                                }
                                                // pass data into page
                                                res.render("professor/assign-projects", {
                                                    results: results,
                                                    name: name,
                                                    groups: p_group
                                                })
                                            })
                                            // close python child process
                                            python.on("close", (code) => {
                                                console.log(code);
                                            })
                                        }
                                    })
                                }
                            })
                            // Algorithm End
                        }
                    })
                }
            })
            }
    })
}