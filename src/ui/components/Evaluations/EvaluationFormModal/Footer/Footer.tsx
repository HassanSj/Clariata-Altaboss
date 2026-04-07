import React from 'react';

function Footer() {
  return (
    <>
      <h3 style={{ color: '#173e68', marginLeft: '15px' }}>Composite Score:</h3>
      <p style={{color: '#173e68', marginLeft: '15px'}}>MLP candidate if score is 7 or higher. <br/>Traditional financial planning candidate if score is less than 7.</p>
    </>
  );
}

export default Footer;
