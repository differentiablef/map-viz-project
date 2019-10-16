import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

engine = create_engine("postgresql://postgres:postgres@localhost:5432/Project3")

# Reflect an existing database into a new model.
# Each table is reflected as a class.

Base = automap_base()

# Reflect the tables.

Base.prepare(engine, reflect=True)

NC_Counties = Base.classes['NC Counties']
NC_Life_Expectancy = Base.classes['NC Life Expectancy']

session = Session(engine)

#---------------------------------------------

results1 = session.query(NC_Counties).first()

print(results1.name)

results2 = session.query(NC_Life_Expectancy).first()


print(results2.life_expectancy)

results = session.query(NC_Counties).all()
results2 = session.query(NC_Life_Expectancy).all()

ledict = {}
for rr in results2:
	ledict[rr.id] = rr.life_expectancy
	
print(ledict[5])

#for rr in results:
#	print(rr.name)
#	print(rr.boundary)

@app.route("/")
def index():
    """Return the homepage."""
	# The render_template function returns a string containing the
	# html required to redner the page.
    return(render_template("index.html"))
	
	
@app.route("/samples/life_expectancy")
def samples():
	results = session.query(NC_Counties).all()
	
	data = []
	
	for rr in results:
		data.append({"name": rr.name, 
		"life_expectancy": ledict[rr.id],
		"polygon":rr.boundary })
	
	return jsonify(data)
	
if __name__ == "__main__":
    app.run()

