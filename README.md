# Student Portal Manager

A web-based application that manages projects for software engineering/development courses.

**Description**

Primarily using Node.js, Express.js, and a MySQL database, this web application allows professors/clients
to post projects available to specific classes and students in that class can order their preferences among 
all other available projects.  The professor will then be able to assign projects to all students in a class
based on a provided algorithm.

**Installation/Running the application**

In order to run the application, the system must have a MySQL database running (the schema is provided).  Node.js
and Express.js must also be installed.  Open the `.env` file to enter the information for the running database.
At this point, the application is ready to be run.  Open the software folder in a terminal window, and run the command:
`node app.js` to start the application.

**Code Structure**

Brief description of the code each folder contains:
- controllers: These files are responsible for actions that interact with the database.
- public: These are the two .css files that stylize the entire interface.
- routes: These .js files contain the function calls for all actions on the website.
- views: These .hbs files (essentially .html files) are the structure for each page on the website.
