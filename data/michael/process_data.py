# imports ######################################################################

# standard
import sys, os

# utility
import pandas as pd
import numpy as np

# sqlalchemy related
from sqlalchemy import create_engine, Column, Integer, String, Float, ARRAY
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base

# classes ######################################################################

Base = declarative_base()

# NC county class which serves
#     as an anchor points for our Tables.
class NCCounty(Base):
    __tablename__ = 'NC Counties' # non-standard naming but w.e.
    id       = Column(Integer, primary_key=True)
    name     = Column(String(255))
    boundary = Column(ARRAY(Float))
    
    
# methods ######################################################################

def load_counties(session):
    objs = session.query(NCCounty).all()
    return objs    

def load_data():
    pass

def in_polygon(polygon, point):
    pass

def generate_histogram():
    pass

def main():
    engine  = create_engine("postgresql://postgres@localhost:5432/project3")
    conn    = engine.connect()
    session = Session(bind=engine)

    counties = load_counties(session)

    pass


# script entry-point ###########################################################

if __name__=="__main__":
    main()      # do main task
    sys.exit(0) # exit cleanly
