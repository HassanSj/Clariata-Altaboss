import React from 'react';
import { Grid } from '@material-ui/core';
import { RoleType } from '~/ui/constants/person';
import moment from 'moment';

interface EducationProps {
  personData: any;
}

const Education = ({ personData }: EducationProps) => {
  return (
    <div>
      {personData?.education?.length > 0
        ? personData?.education?.map((item:any) => {
            return (
              <>
                <div style={{marginLeft: "41px"}}>
                 <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
                  <div className="worksheet-field-each" style={{ width: '50%' }}>
                    <label className="worksheet-label" style={{ width: '14%' , marginLeft : "-58px" }}>
                      Institution :
                    </label>
                    <p className="worksheet-text" style={{ width: '86%' , marginLeft:"32px" }}>
                      {item?.InstitutionName ? item?.InstitutionName : null}
                    </p>
                  </div>
                  <div className="worksheet-field-each" style={{ width: '50%' }}>
                    <label className="worksheet-label" style={{ width: '11%', marginLeft:"-28px" }}>
                      Degree :
                    </label>
                    <p style={{ width: '67%', marginLeft:"25px" }} className="worksheet-text">
                      {item?.EducationDescription ? item?.EducationDescription : null}
                    </p>
                  </div>
                </div>
                <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
                  <div className="worksheet-field-each" style={{ width: '33%' }}>
                    <label className="worksheet-label" style={{ width: '30%' , marginLeft:"-59px"}}>
                      Completion Date :
                    </label>
                    <p className="worksheet-text" style={{ width: '70%', marginLeft:"60px" }}>
                      {item?.CompletionDate ? moment(item?.CompletionDate).format('MMMM Do YYYY') : null}
                    </p>
                  </div>
                  <div className="worksheet-field-each" style={{ width: '33%' }}>
                    <label className="worksheet-label" style={{ width: '18%', marginLeft: "-7px"}}>
                      Location :
                    </label>
                    <p style={{ width: '53%' , marginLeft: "34px"}} className="worksheet-text">
                      {item?.Location ? item?.Location : null}
                    </p>
                  </div>
                  <div className="worksheet-field-each" style={{ width: '33%' }}>
                    <label className="worksheet-label" style={{ width: '27%', marginLeft: "-49px" }}>
                      Additional Info :
                    </label>
                    <p style={{ width: '39%', marginLeft:"48px" }} className="worksheet-text">
                      {/* Data needed for this */}
                    </p>
                  </div>
                </div>
                </div>
              </>
            );
          })
        : null}
    </div>
  );
};

export default Education;
