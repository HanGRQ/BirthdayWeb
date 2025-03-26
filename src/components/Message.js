import React from 'react';

const Message = ({ text = "消息", time = "00:00", lang = "en" }) => {
  // 添加默认参数值，防止 props 为 undefined
  
  // 添加根据语言的不同样式
  const getLanguageClass = (language) => {
    const langClasses = {
      'en': 'lang-en',
      'fr': 'lang-fr',
      'zh': 'lang-zh',
      'jp': 'lang-jp',
      'ko': 'lang-ko',
      'de': 'lang-de',
      'es': 'lang-es',
      'ru': 'lang-ru'
    };
    
    return langClasses[language] || 'lang-en';
  };

  return (
    <div className={`message ${getLanguageClass(lang)}`}>
      <div className="message-time">{time}</div>
      <div className="message-content">{text}</div>
    </div>
  );
};

export default Message;