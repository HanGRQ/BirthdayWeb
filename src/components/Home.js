import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneFrame from './PhoneFrame';
import StatusBar from './StatusBar';
import Message from './Message';
import '../styles/Home.css';

// 内置消息数组，防止导入失败
const defaultMessages = [
  { text: "Happy Birthday! 🎮", lang: "en" },
  { text: "Joyeux Anniversaire! 💣", lang: "fr" },
  { text: "生日快乐！🎉", lang: "zh" },
  { text: "お誕生日おめでとう！🎂", lang: "jp" },
  { text: "생일 축하해! 🎈", lang: "ko" },
  { text: "Alles Gute zum Geburtstag! 🎁", lang: "de" },
  { text: "¡Feliz cumpleaños! 🎊", lang: "es" },
  { text: "С Днем Рождения! 🎯", lang: "ru" },
  { text: "Buon compleanno! 🎭", lang: "it" },
  { text: "Hyvää syntymäpäivää! 🎨", lang: "fi" },
  { text: "破壳日快乐！🎮", lang: "zh" },
  { text: "Many happy returns of the day! 🎲", lang: "en" },
  { text: "生辰快乐! 🎭", lang: "zh" },
  { text: "Gelukkige verjaardag! 🎪", lang: "nl" },
  { text: "Have a blast on your special day! 🚀", lang: "en" },
  { text: "又老一岁啦！💰", lang: "zh" },
  { text: "Wishing you the best birthday ever! 🏆", lang: "en" },
  { text: "祝你生日快乐，心想事成! 🎯", lang: "zh" },
  { text: "Que tous tes souhaits se réalisent! 💎", lang: "fr" },
  { text: "May your day be filled with joy! 🎪", lang: "en" }
];

const Home = () => {
  const [messageList, setMessageList] = useState([]);
  const [isHacking, setIsHacking] = useState(false);
  const navigate = useNavigate();

  // 自动滚动消息效果
  useEffect(() => {
    // 只有在未开始黑客攻击时才显示自动滚动消息
    if (!isHacking) {
      // 生成初始消息
      const initialMessages = [];
      for (let i = 0; i < 10; i++) {
        const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
        const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
        const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        
        initialMessages.push({
          id: `auto-${i}`,
          text: randomMessage.text,
          lang: randomMessage.lang,
          time: `${hours}:${minutes}`
        });
      }
      setMessageList(initialMessages);

      // 每隔一段时间添加新消息
      const interval = setInterval(() => {
        if (!isHacking) {
          const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
          const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
          const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
          
          // 添加新消息并保持最多10条
          setMessageList(prev => [
            {
              id: `auto-${Date.now()}`,
              text: randomMessage.text,
              lang: randomMessage.lang,
              time: `${hours}:${minutes}`
            },
            ...prev.slice(0, 9)
          ]);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isHacking]);

  // 生成随机短信
  const generateMessages = () => {
    const newMessages = [];
    for (let i = 0; i < 99; i++) {
      const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
      const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
      const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      
      newMessages.push({
        id: i,
        text: randomMessage.text,
        lang: randomMessage.lang,
        time: `${hours}:${minutes}`
      });
    }
    return newMessages;
  };

  // 开始"黑客"攻击
  const startHacking = () => {
    setIsHacking(true);
    const generatedMessages = generateMessages();
    
    // 分批显示消息，增加动画效果
    let counter = 0;
    const interval = setInterval(() => {
      if (counter < generatedMessages.length) {
        setMessageList(prev => [generatedMessages[counter], ...prev.slice(0, 19)]);
        counter++;
        
        // 播放通知声音
        try {
          const audio = new Audio('/assets/audio/cyber-notification.mp3');
          audio.volume = 0.2;
          audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (error) {
          console.log('Audio playback not supported');
        }
      }
      
      // 当所有消息显示完后，导航到游戏页面
      if (counter >= generatedMessages.length) {
        clearInterval(interval);
        setTimeout(() => navigate('/game'), 2000);
      }
    }, 50);
  };

  return (
    <div className="home-container cyber-bg">
      <PhoneFrame>
        <StatusBar />

        <div className="message-container auto-scrolling">
          {messageList.map((msg, index) => (
            msg ? (
              <Message 
                key={msg.id || index}
                text={msg.text || "消息加载中..."}
                time={msg.time || "00:00"}
                lang={msg.lang || "en"}
              />
            ) : null
          ))}
        </div>
        
        {!isHacking && (
          <button 
            className="neon-button hack-button"
            onClick={startHacking}
          >
            ▶ 破解系统
          </button>
        )}
        
        {isHacking && (
          <div className="hacking-progress">
            <div className="progress-bar">
              <div className="progress" style={{width: `${(messageList.length / 99) * 100}%`}}></div>
            </div>
            <p className="glitch-text">系统入侵中... {messageList.length}%</p>
          </div>
        )}
      </PhoneFrame>
    </div>
  );
};

export default Home;