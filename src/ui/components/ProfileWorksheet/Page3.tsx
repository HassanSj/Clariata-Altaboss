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
const Page3 = ({ personData }: IProps) => {
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
     <div style={{ marginLeft: "-55px" , width : "715px"}}>
      <Roles personData={personData} />
      </div>
    </>
  );
};

export default Page3;
