import React from 'react';
import { Grid } from '@material-ui/core';
import { Genders, RoleType } from '~/ui/constants/person';
import moment from 'moment';
import { Person } from '~/types/api/person';
import { PersonRelationshipType } from '~/ui/constants/api';

interface PersonalProps {
  person: Person;
  personData: any;
}

const Personal = ({ person }: PersonalProps) => {
  return (
    <>
    <div style={{marginLeft: "-16px"}}>
       <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '100%' }}>
          <label className="worksheet-label" style={{ width: '11%' }}>
            Original Surname :
          </label>
          <p className="worksheet-text" style={{ width: '79%' , marginLeft:"54px"}}>
            {person?.OriginalSurname ? person?.OriginalSurname : null}
          </p>
        </div>
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '40%' }}>
          <label className="worksheet-label" style={{ width: '20%' }}>
            Date of Birth :
          </label>
          <p className="worksheet-text" style={{ width: '80%' , marginLeft:"45px"}}>
            {person?.DateOfBirth ? moment(person?.DateOfBirth).format('MMMM Do YYYY') : null}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '60%' }}>
          <label className="worksheet-label" style={{ width: '12%' }}>
            Birthplace :
          </label>
          <p style={{ width: '76%' , marginLeft:"34px"}} className="worksheet-text">
            {person?.Birthplace ? person?.Birthplace : null}
          </p>
        </div>
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '10%' }}>
          <label className="worksheet-label" style={{ width: '100%' }}>
            Marital Status :
          </label>
        </div>
        <div className="worksheet-field-each" style={{ width: '22%', marginLeft:"21px"}}>
          <input
            type="checkbox"
            className="marital-checkbox"
            style={{ width: '5%' }}
            checked={person?.MarriageDate ? true : false}
            disabled={true}
          ></input>
          <label className="worksheet-label" style={{ width: '47%' }}>
            MARRIED - Date:
          </label>
          <p className="worksheet-text" style={{ width: '70%',marginLeft: "50px" }}>
            {person?.MarriageDate ? moment(person?.MarriageDate).format('MMMM Do YYYY') : false}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '22%', marginLeft : "77px"}}>
          <input
            type="checkbox"
            className="marital-checkbox"
            style={{ width: '5%' }}
            checked={person?.DivorcedDate ? true : false}
            disabled={true}
          ></input>
          <label className="worksheet-label" style={{ width: '50%' }}>
            DIVORCED - Date:
          </label>
          <p className="worksheet-text" style={{ width: '318px',marginLeft: "47px" , marginRight:"-177px" }}>
            {person?.DivorcedDate ? moment(person?.DivorcedDate).format('MMMM Do YYYY') : false}
          </p>
        </div>
        {/* <div className="worksheet-field-each" style={{ width: '22%' }}>
          <input
            type="checkbox"
            className="marital-checkbox"
            style={{ width: '5%' }}
            checked={person?.SeparatedDate ? true : false}
            disabled={true}
          ></input>
          <label className="worksheet-label" style={{ width: '50%' }}>
            SEPARATED - Date:
          </label>
          <p className="worksheet-text" style={{ width: '45%',marginLeft: "-65px" }}>
            {person?.SeparatedDate ? moment(person?.SeparatedDate).format('MMMM Do YYYY') : false}
          </p>
        </div> */}
        {/* <div className="worksheet-field-each" style={{ width: '22%' }}>
          <input
            type="checkbox"
            className="marital-checkbox"
            style={{ width: '5%' }}
            checked={person?.WidowedDate ? true : false}
            disabled={true}
          ></input>
          <label className="worksheet-label" style={{ width: '40%' }}>
            WIDOW - Date:
          </label>
          <p className="worksheet-text" style={{ width: '55%',marginLeft: "-70px" }}>
            {person?.WidowedDate ? moment(person?.WidowedDate).format('MMMM Do YYYY') : false}
          </p>
        </div> */}
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '100%' }}>
          <label className="worksheet-label" style={{ width: '12%' }}>
            Religious Affiliation :
          </label>
          <p className="worksheet-text" style={{ width: '77%',marginLeft : "63px" }}>
            {person?.ReligiousAffiliation ? person?.ReligiousAffiliation : null}
          </p>
        </div>
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '100%' }}>
          <label className="worksheet-label" style={{ width: '17%' }}>
            Current Activities and Hobbies :
          </label>
          <p className="worksheet-text" style={{ width: '67%',marginLeft: "99px" }}>
            {person?.Hobbies ? person?.Hobbies : null}
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Personal;
