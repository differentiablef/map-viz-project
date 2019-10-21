# imports ######################################################################

# sqlalchemy related
from sqlalchemy import create_engine, Column, Integer, String, Float, ARRAY
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base

# standard
import sys, os, bz2, json

# utility
import pandas as pd
import numpy as np

# classes ######################################################################

Base = declarative_base()

# NC county class which serves
#     as an anchor points for our Tables.
class NCCounty(Base):
    __tablename__ = 'NC Counties' # non-standard naming but w.e.
    id       = Column(Integer, primary_key=True)
    name     = Column(String(255))
    boundary = Column(ARRAY(Float))

    # determines whether a point is contained within the
    #   boundary associated with this county
    def in_boundary(self, point):
        for vertex in self.boundary:
            print(vertex)
        return False
    pass

# class describing the table containing the
#  county level lightening strike data
class LighteningStrikes(Base):
    __tablename__ = 'CountyStrikes'
    id      = Column(Integer, primary_key=True)
    county  = Column(Integer) # id of county 
    strikes = Column(Integer) # number of lightening strikes in county
    pass

# methods ######################################################################

def load_counties(session):
    """ Load list of counties """
    objs = session.query(NCCounty).all()
    return objs    

def load_data(path):
    """ Load data from bzip'd raw json """
    # will hold aggregated json
    objs = []

    # open and process contents of bzip'd json file
    #  combining all lines into a single list
    with bz2.open(path, 'r') as ifile:
        for line in ifile:
            if len(line) > 1:
                objs.extend(json.loads(line))

    # convert "POINT" entries into tubles and rename
    #  some attributes
    for obj in objs:
        s = obj.get('center_point').split(' ')
        obj['point'] = (float(s[0][6:]), float(s[1][:-1]))
        del obj['center_point']

        obj['strikes'] = obj['number_of_strikes']
        del obj['number_of_strikes']
        
    return objs

def main():
    # path to lightenting data
    datafile = './raw-lightening.json.bz2'
    
    # setup connection to postgresql database
    engine  = create_engine("postgresql://postgres@localhost:5432/project3")
    conn    = engine.connect()
    session = Session(bind=engine)

    # extract counties from database
    counties = load_counties(session)

    # load data to be binned by county
    data = load_data(datafile)
    pass

# script entry-point ###########################################################

if __name__=="__main__":
    main()      # do main task
    sys.exit(0) # exit cleanly
