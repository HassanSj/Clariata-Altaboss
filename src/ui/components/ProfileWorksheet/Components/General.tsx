import React from 'react';
import { Grid } from '@material-ui/core';
import { Genders, RoleType } from '~/ui/constants/person';
import moment from 'moment';
import { Person } from '~/types/api/person';
import { PersonRelationshipType } from '~/ui/constants/api';

interface GeneralProps {
  person: Person;
  personData: any;
}

const requiredPhoneTypes = ['Cell', 'Home', 'Work', 'Fax'];

const General = ({ person, personData }: GeneralProps) => {
  const { phoneNumberTypes } = personData;
  let personTitle: any;
  Object.entries(PersonRelationshipType).filter(([key, value]) => {
    if (value === person?.PersonTitleID) {
      personTitle = key;
    }
  });
  return (
    <>
    <div style={{marginLeft: "-16px"}}>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '23%' }}>
            First Name :
          </label>
          <p className="worksheet-text" style={{ width: '77%', marginLeft: "31px"}}>
            {person?.FirstName ? person?.FirstName : null}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '25%',marginLeft: "-7px" }}>
            Middle Name :
          </label>
          <p style={{ width: '52%', marginLeft: "46px"}} className="worksheet-text">
            {person?.MiddleName ? person?.MiddleName : null}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '33%'}}>
          <label className="worksheet-label" style={{ width: '22%', marginLeft:"-18px" }}>
            Last Name :
          </label>
          <p style={{ width: '60%', marginLeft: "34px"  }} className="worksheet-text">
            {person?.LastName ? person?.LastName : null}
          </p>
        </div>
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '29%' }}>
            Preferred Name :
          </label>
          <p className="worksheet-text" style={{ width: '71%',marginLeft: "53px" }}>
            {person?.PreferredName ? person?.PreferredName : null}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '33%',marginLeft: "-8px"  }}>
          <label className="worksheet-label" style={{ width: '24%' }}>
            Contact Title :
          </label>
          <p style={{ width: '52%',marginLeft: "46px" }} className="worksheet-text">
            {personTitle ? personTitle : null}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '17%' }}>
            Gender :
          </label>
          <p style={{ width: '62%',marginLeft: "26px" }} className="worksheet-text">
            {person?.GenderID ? Genders.filter(g => g.value === person?.GenderID)[0].label : null}
          </p>
        </div>
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '100%' }}>
          <label className="worksheet-label" style={{ width: '5%' }}>
            Email :
          </label>
          <p className="worksheet-text" style={{ width: '89%',marginLeft: "18px" }}>
            {person?.EmailAddress ? person?.EmailAddress : null}
          </p>
        </div>
      </div>
      {personData?.phoneNumbers?.length > 0
        ? personData?.phoneNumbers?.map((phone: any) => {
            let filteredPhoneType = phoneNumberTypes?.filter((phnType: any) => {
              if (phone?.PhoneNumberTypeID === phnType?.PhoneNumberTypeID) {
                return phnType;
              }
            });
            console.log('Filtered Phone :', filteredPhoneType);
            return (
              <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
                <div className="worksheet-field-each" style={{ width: '60%' }}>
                  <label className="worksheet-label" style={{ width: '8%' }}>
                    Phone :
                  </label>
                  <p className="worksheet-text" style={{ width: '92%', marginLeft : "35px" }}>
                    {phone?.PhoneNumber ? phone?.PhoneNumber : null}
                  </p>
                </div>
                <div className="worksheet-field-each" style={{ width: '60%', marginLeft:"-5px" }}>
                  <input
                    type="checkbox"
                    checked={filteredPhoneType[0]?.Description === 'Mobile'}
                    disabled={true}
                    className="phone-checkbox"
                  ></input>
                  <label className="worksheet-label" style={{ marginRight: '20px' }}>
                    CELL
                  </label>
                  <input
                    type="checkbox"
                    checked={filteredPhoneType[0]?.Description === 'Home'}
                    disabled={true}
                    className="phone-checkbox"
                  ></input>
                  <label className="worksheet-label" style={{ marginRight: '20px' }}>
                    HOME
                  </label>
                  <input
                    type="checkbox"
                    checked={filteredPhoneType[0]?.Description === 'Work'}
                    disabled={true}
                    className="phone-checkbox"
                  ></input>
                  <label className="worksheet-label" style={{ marginRight: '20px' }}>
                    WORK
                  </label>
                  <input
                    type="checkbox"
                    checked={filteredPhoneType[0]?.Description === 'Fax'}
                    disabled={true}
                    className="phone-checkbox"
                  ></input>
                  <label className="worksheet-label" style={{ marginRight: '20px' }}>
                    FAX
                  </label>
                  <input
                    type="checkbox"
                    checked={filteredPhoneType[0]?.Description === 'Other'}
                    disabled={true}
                    className="phone-checkbox"
                  ></input>
                  <label className="worksheet-label" style={{ marginRight: '20px' }}>
                    OTHER
                  </label>
                </div>
              </div>
            );
          })
        : null}
       <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '28%' }}>
            Friendly Name :
          </label>
          <p className="worksheet-text" style={{ width: '72%' , marginLeft: "46px"}}>
            {/* Insert Data Here */}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '67%' }}>
          <label className="worksheet-label" style={{ width: '10%' }}>
            Address :
          </label>
          <p style={{ width: '373px',marginLeft: "25px" }} className="worksheet-text">
            {/* Insert Data Here */}
          </p>
        </div>
      </div>
      <div className="worksheet-field-row"style={{ width: '729px' , whiteSpace : "nowrap" }}>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '12%' }}>
            City :
          </label>
          <p className="worksheet-text" style={{ width: '88%', marginLeft: "13px" }}>
            {/* Insert Data Here */}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '15%' , marginLeft: "-2px" }}>
            State :
          </label>
          <p style={{ width: '85%',marginLeft: "15px" }} className="worksheet-text">
            {/* Insert Data Here */}
          </p>
        </div>
        <div className="worksheet-field-each" style={{ width: '33%' }}>
          <label className="worksheet-label" style={{ width: '10%' }}>
            Zip :
          </label>
          <p style={{ width: '170px' , marginLeft: "13px"}} className="worksheet-text">
            {/* Insert Data Here */}
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default General;
