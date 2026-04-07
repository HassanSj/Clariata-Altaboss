import React from 'react';
import img from '../../../../../../public/images/reports/Profile.png';
interface IProps {
  familyName : string
}
export default function Header({familyName}:IProps) {
  return (
    <div>
      {/* <span> */}
      
        <img src={img} style={{ width: ' auto', height: ' 26px', marginBottom: ' -48px', marginLeft: ' -30px' }}></img>
        <h2 style={{ color: '#173e68', marginLeft: '20px', fontSize: '17px' }}>CLIENT EVALUATION</h2>
        <h2
          style={{ marginLeft: '325px', fontSize: '13px', marginTop: '-37px', color: '#173e68', whiteSpace: 'nowrap' }}
        >
          FAMILY NAME: <span style={{ textDecoration: 'underline' }}>{familyName}</span>
        </h2>
      {/* </span> */}
    </div>
  );
}
