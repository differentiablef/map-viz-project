# A Choropleth Map of North Carolina Counties

## Database Creation ##
The ```./dbcreate``` folder contains all the files required to generate tables within a Postgres SQL database called ‘Project3’. 
It is recommended that this name be used because the application that generates the choropleth plots contains code that assumes ‘Project3’ is the name of the SQL database. 
The string required for the SQLAlchemy connection to the database is contained in the file ```dbconfig.py```. 
In particular, the user should review the password contained in this file and configure it to match his/her personal Postgres password.
<br>
The individual tables are now listed along with the corresponding creation software together with a data file (if appropriate). The data files are also contained in the ```./dbcreate``` folder. At the very least, the 'NC Counties' table should be created beacuse this table contains data pertaining to the geometry of each county boundary as well as the name of each county.

### NC Counties ###
contains the FIPS code, name and geometry of each county in NC. It is created by running the ```LifeExpectancySQL``` notebook.

### NC Life Expectancy ###
contains an estimate of the average life expectancy of individuals born in each NC county. It is also created by running the ```LifeExpectancySQL``` notebook.

### NC Drugs ###
contains a yearly death rate due to drug poisoning for each county. It is created by running the ```drug_poisoning``` notebook.

### CountyStrikes ###
is a data set that contains the total number of lightning strikes in each NC county. It is created by running the script ```process_data.py```, which makes use of data contained in ```raw-lightning.json.bz2```.

### NC Cardiovascular Fatality Rate ###
contains the cardiovascular fatality rate (per 100,000 people) for each county. It is created bt running the notebook ```SonalSQL```, which imports data contained in ```CVFatality.csv```.

### NC Census Data ###
contains a miscellany of census data obtained for each county in NC, including population, population immigration for 2018, education level, poverty level and much more. It is created by running the notebook ```CensusData``` which imports data contained in ```ProjectData.csv```.

