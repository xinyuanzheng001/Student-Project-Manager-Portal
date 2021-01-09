CREATE DATABASE project_db;
USE project_db;

CREATE TABLE roles(
id INT PRIMARY KEY DEFAULT 2,
rolename varchar(20) NOT NULL
);

#Table to store student information (Password is keyword so i am using passkey)
CREATE TABLE users(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(100) NOT NULL,
-- extra_details VARCHAR(100),
email VARCHAR(100) NOT NULL,
authentication VARCHAR(100) NOT NULL,
role varchar(20) NOT NULL 
);

-- CREATE TABLE roles(
-- role varchar(20) NOT NULL,
-- user_id INT,
-- FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- table for the course that professor created
CREATE TABLE courses(
    id VARCHAR(20) PRIMARY KEY,
    course_number VARCHAR(20),
    course_description VARCHAR(2100),
    professor VARCHAR(100),
    user_id INT,
    num_prefs INT
);

CREATE TABLE projects(
project_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
project_name VARCHAR(200) NOT NULL,
project_detail VARCHAR(2100),
client_name VARCHAR(50) NOT NULL,
client_contact VARCHAR(100),
course_id VARCHAR(20),
extra_details VARCHAR(2100),
user_id INT,
capacity INT NOT NULL
-- FOREIGN KEY (user_id) REFERENCES users(id),
-- FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- table to store the projects, students in that course
CREATE TABLE courses_info(
    id VARCHAR(20),
    student_id INT,
    projects_id VARCHAR(100),
    proj_preference1 VARCHAR(100),
    proj_preference2 VARCHAR(100),
    proj_preference3 VARCHAR(100),
    proj_preference4 VARCHAR(100),
    proj_preference5 VARCHAR(100)
    -- FOREIGN KEY (id) REFERENCES courses(id),
    -- FOREIGN KEY (student_id) REFERENCES users(id),
    -- FOREIGN KEY (projects_id) REFERENCES projects(project_id)
);

CREATE TABLE enrolled (
    course_id VARCHAR(20),
    student_id INT,
    -- FOREIGN KEY (course_number) REFERENCES courses(course_number),
    FOREIGN KEY (student_id) REFERENCES users(id)
);