import React from 'react';
import { Grid } from '@material-ui/core';
import { RoleType } from '~/ui/constants/person';
import moment from 'moment';

interface WorkProps {
  personData: any;
}

const Work = ({ personData }: WorkProps) => {
  return (
    <div>
      {personData?.work?.length > 0
        ? personData?.work?.map((item: any) => {
            return (
              <>
               <div style={{marginLeft: "13px"}}>
                <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
                  <div className="worksheet-field-each" style={{ width: '50%' }}>
                    <label className="worksheet-label" style={{ width: '12%',  marginLeft:"-30px" }}>
                      Company :
                    </label>
                    <p className="worksheet-text" style={{ width: '88%', marginLeft:"38px"}}>
                      {item?.Company ? item?.Company : null}
                    </p>
                  </div>
                  <div className="worksheet-field-each" style={{ width: '50%' }}>
                    <label className="worksheet-label" style={{ width: '7%' }}>
                      Title :
                    </label>
                    <p style={{ width: '71%', marginLeft:"23px" }} className="worksheet-text">
                      {item?.Title ? item?.Title : null}
                    </p>
                  </div>
                </div>
                <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
                  <div className="worksheet-field-each" style={{ width: '60%' }}>
                  <label className="worksheet-label" style={{ width: '12%',  marginLeft:"-30px" }}>
                      Additional Info :
                    </label>
                    <p className="worksheet-text" style={{ width: '40%', marginLeft:"65px"}}>
                      {/* Data needed here */}
                    </p>
                  </div>
                  <div className="worksheet-field-each" style={{ width: '20%' }}>
                    <label className="worksheet-label" style={{ width: '32%' ,  marginLeft:"-157px" }}>
                      Start Date :
                    </label>
                    <p style={{ width: '68%' , marginLeft:"39px" }} className="worksheet-text">
                      {item?.StartDate ? moment(item?.CompletionDate).format('MMMM Do YYYY') : null}
                    </p>
                  </div>
                  <div className="worksheet-field-each" style={{ width: '20%' }}>
                    <label className="worksheet-label" style={{ width: '30%', marginLeft: "-119px"}}>
                      End Date :
                    </label>
                    <p style={{ width: '93%' , marginLeft:"35px" }} className="worksheet-text">
                      {item?.EndDate ? moment(item?.CompletionDate).format('MMMM Do YYYY') : null}
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

export default Work;
