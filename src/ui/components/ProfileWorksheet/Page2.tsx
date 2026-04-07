import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Person } from '~/types/api/person';
import usePersons from '~/ui/hooks/usePersons';
import Roles from './Components/Roles';
import Education from './Components/Education';
import Work from './Components/Work';
import General from './Components/General';
import Personal from './Components/Personal';
interface IProps {
  personData?: any;
}
const Page2 = ({ personData }: IProps) => {
  const { persons } = usePersons();
  const [person, setPerson] = useState<Person>();

  useEffect(() => {
    if (!personData.person) {
      return;
    }
    const reqPerson = persons?.filter(person => person.PersonID === Number(personData.person));
    if (reqPerson) {
      setPerson(reqPerson![0]);
      console.log("Person Data :", person)
    }
  });

  return (
    <>
      <div style={{ marginLeft: "-55px" , width : "176px"}}>
      <Grid container item spacing={1} style={{ marginBottom: '20px', marginLeft: '28px', marginTop: '10px' }}>
        <Grid item xs={12}>
          <div className="worksheet-headings">
            <p className="worksheet-heading-text">Work History</p>
          </div>
        </Grid>
      </Grid>
      <Work personData={personData} />
      <Grid container item spacing={1} style={{ marginBottom: '20px', marginLeft: '25px', marginTop: '10px' }}>
        <Grid item xs={12}>
          <div className="worksheet-headings">
            <p className="worksheet-heading-text">Education</p>
          </div>
        </Grid>
      </Grid>
      <Education personData={personData} />
      </div>
    </>
  );
};

export default Page2;
