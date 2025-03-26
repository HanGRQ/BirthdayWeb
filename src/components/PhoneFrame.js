import React from 'react';

const PhoneFrame = ({ children }) => {
  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="phone-content">{children}</div>
      <div className="phone-button"></div>
    </div>
  );
};

export default PhoneFrame;