// StatusBar.js - 手机状态栏组件
import React, { useState, useEffect } from 'react';

const StatusBar = () => {
  const [time, setTime] = useState('');
  const battery = 99; // 改为常量，不需要状态
  
  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="time">{time}</span>
      </div>
      <div className="status-right">
        <span className="signal">📶 5G</span>
        <span className="battery">{battery}% 🔋</span>
      </div>
    </div>
  );
};

export default StatusBar;