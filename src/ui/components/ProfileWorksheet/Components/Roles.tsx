import React from 'react';
import { Grid } from '@material-ui/core';
import { RoleType } from '~/ui/constants/person';

interface RoleProps {
  personData: any;
}

const Roles = ({ personData }: RoleProps) => {
  return (
    <Grid container item spacing={1} style={{ marginBottom: '20px', marginLeft: '25px', marginTop: '10px' }}>
      <Grid item xs={12}>
        <div className="worksheet-headings">
          <p className="worksheet-heading-text">Roles</p>
        </div>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '10px' }}>
        <p className="role-types-heading">TYPES:</p>
      </Grid>
      <Grid item xs={2}>
        <ul className="roles-list"style={{marginLeft: "-14px", width:"400px"}}>
          <li>Executor</li>
          <li>Co-Executor</li>
          <li>Success Executor</li>
          <li>Trustee</li>
          <li>Co-Trustee</li>
        </ul>
      </Grid>
      <Grid item xs={3}>
        <ul className="roles-list" style={{marginLeft: "71px", width:"400px"}}>
          <li>Success Trustee</li>
          <li>Power of Attorney</li>
          <li>Successor POA</li>
          <li>Double Health Care POA</li>
          <li>Co-POA</li>
        </ul>
      </Grid>
      <Grid item xs={3}>
        <ul className="roles-list" style={{marginLeft: "146px" , width:"400px"}}>
          <li>Guardian</li>
          <li>Guardian in Will</li>
          <li>Pet Guardian</li>
          <li>Pet Guardian in Will</li>
          <li>Other</li>
        </ul>
      </Grid>
      <Grid item xs={12} style={{marginLeft:"-20px"}}>
        <tr style={{ backgroundColor: '#000000'}}>
          <th
            style={{
              backgroundColor: '#e6f1f2',
              borderTop: 'thin solid #72c6c7',
              borderBottom: 'thin solid #72c6c7',
              borderLeft: 'thin solid #72c6c7',
              padding: '10px',
              width: '25%',
            }}
          >
            Role:
          </th>
          <th
            style={{
              backgroundColor: '#e6f1f2',
              borderTop: 'thin solid #72c6c7',
              borderBottom: 'thin solid #72c6c7',
              borderLeft: 'thin solid #72c6c7',
              padding: '10px',
              width: '25%',
            }}
          >
            For:
          </th>
          <th
            style={{
              backgroundColor: '#e6f1f2',
              borderTop: 'thin solid #72c6c7',
              borderBottom: 'thin solid #72c6c7',
              borderLeft: 'thin solid #72c6c7',
              padding: '10px',
              width: '40%',
            }}
          >
            Additional Information:
          </th>
          <th
            style={{
              backgroundColor: '#e6f1f2',
              borderTop: 'thin solid #72c6c7',
              borderBottom: 'thin solid #72c6c7',
              borderLeft: 'thin solid #72c6c7',
              borderRight: 'thin solid #72c6c7',
              padding: '10px',
              width: '10%',
              whiteSpace: 'nowrap'
            }}
          >
            Aware of Role ?
          </th>
        </tr>
        {personData?.roles?.map((item: any, i: number) => {
          if (item === undefined) return;
          let roleName: any;
          Object.entries(RoleType).filter(([key, value]) => {
            console.log('Key :', key, 'Value :', value);
            if (key === item?.Role) {
              roleName = value;
            }
            if (value === item?.Role) {
              roleName = key;
            }
          });
          roleName = roleName.split('_').join(' ').toLowerCase();
          return (
            <>
              <tr style={{ backgroundColor: '#E7EBF0' }}>
                <td
                  style={{
                    textAlign: 'center',
                    borderBottom: 'thin solid #72c6c7',
                    borderLeft: 'thin solid #72c6c7',
                    padding: '10px',
                    backgroundColor: 'rgb(255 ,255,255)',
                    color: '#1a3f69',
                    fontWeight: 'bold',
                  }}
                  key={i}
                >
                  {roleName}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    borderBottom: 'thin solid #72c6c7',
                    borderLeft: 'thin solid #72c6c7',
                    padding: '10px',
                    backgroundColor: 'rgb(255 ,255,255)',
                    color: '#1a3f69',
                    fontWeight: 'bold',
                  }}
                  key={i}
                >
                  {item?.ForPerson}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    borderBottom: 'thin solid #72c6c7',
                    borderLeft: 'thin solid #72c6c7',
                    padding: '10px',
                    backgroundColor: 'rgb(255 ,255,255)',
                    color: '#1a3f69',
                    fontWeight: 'bold',
                  }}
                  key={i}
                >
                  {item?.AdditionalInformation}
                </td>
                <td
                  style={{
                    textAlign: 'center',
                    borderBottom: 'thin solid #72c6c7',
                    borderLeft: 'thin solid #72c6c7',
                    borderRight: 'thin solid #72c6c7',
                    padding: '10px',
                    backgroundColor: 'rgb(255 ,255,255)',
                    color: '#1a3f69',
                    fontWeight: 'bold',
                  }}
                  key={i}
                >
                  Yes No
                </td>
              </tr>
            </>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default Roles;
