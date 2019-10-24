# A Choropleth Map of North Carolina Counties
<h3><strong>Database Creation</strong></h3> The ```./dbcreate``` folder contains all the files required to generate tables within a Postgres SQL database called ‘Project3’. 
It is recommended that this name be used because the application that generates the choropleth plots contains code that assumes ‘Project3’ is the name of the SQL database. 
The string required for the SQLAlchemy connection to the database is contained in the file ```dbconfig.py```. 
In particular, the user should review the password contained in this file and configure it to match his/her personal Postgres password.
