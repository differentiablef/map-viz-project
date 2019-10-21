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

    def in_boundary(self, point):
        """ determine whether a point is contained within the
             boundary associated with this county """
        crossings = 0
        for ii in range(0, len(self.boundary)-1):
            x1 = self.boundary[ii][0]
            x2 = self.boundary[ii+1][0]

            if (point[0] >= x1) and (point[0] >= x2):
                continue

            y1 = self.boundary[ii][1]
            y2 = self.boundary[ii+1][1]

            if y2 > y1:
                if (point[1] >= y1) and (point[1] < y2):
                    if (point[0] <= x1) and (point[0] <= x2):
                        crossings += 1
                        continue
                    

                    xref = x1 + (point[1] - y1)*(x2-x1)/(y2-y1)
                    if point[0] < xref:
                        crossings += 1
                        continue
                    pass
                pass
            elif y1 > y2:
                if (point[1] >= y2) and (point[1] < y1):
                    if (point[0] <= x1) and (point[0] <= x2):
                        crossings += 1
                        continue

                    xref = x1 + (point[1] - y1)*(x2-x1)/(y2-y1)
                    if point[0] < xref:
                        crossings += 1
                        continue
                    pass
                pass
            pass
        return ((crossings % 2) == 1)
    pass

# class describing the table containing 
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
    objs = load_data(datafile)

    
    # process the lightening strike records and
    #  bin them if they are recorded occuring within a particular county
    for obj in objs:
        pt = obj['point']
        for county in counties:
            if county.in_boundary(pt):
                print('hit')
                print(county.name, pt)
                break
        
    return 

# script entry-point ###########################################################

if __name__=="__main__":
    main()      # do main task
    sys.exit(0) # exit cleanly
