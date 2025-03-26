import { useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import '../styles/Achievement.css';
import { useNavigate } from 'react-router-dom';

const Achievement = ({ onClose }) => {
  const navigate = useNavigate();
  // 所有数据计算集中到一个useMemo中
  const { 
    birthDate, 
    currentAge, 
    currentVersion, 
    nextVersion, 
    achievementTree, 
    redemptionCode 
  } = useMemo(() => {
    const birthDate = new Date(2003, 2, 28);
    const daysAlive = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24));
    const currentAge = Math.floor(daysAlive / 365);

    const versionMap = [
      { range: [0, 3], version: "婴儿α版", features: ["基础生命维持系统"] },
      { range: [4, 12], version: "少年β版", features: ["语言协议v1.0", "情感编译器"] },
      { range: [13, 19], version: "青少年RC版", features: ["逻辑引擎2.0", "社交模块"] },
      { range: [20, 35], version: "青年正式版", features: ["职业路径规划", "独立决策系统"] },
      { range: [36, 60], version: "稳定版", features: ["经验数据库", "多线程处理"] },
      { range: [61, 80], version: "终极版", features: ["智慧结晶压缩包"] }
    ];

    const currentVersion = versionMap.find(v => currentAge >= v.range[0] && currentAge <= v.range[1]);
    const nextVersion = versionMap.find(v => v.range[0] > currentAge);
    
    const achievementTree = [
      { name: "初级语言协议", age: 3, unlocked: currentAge >= 3 },
      { name: "情感编译器", age: 6, unlocked: currentAge >= 6 },
      { name: "逻辑引擎启动", age: 12, unlocked: currentAge >= 12 },
      { name: "哲学思考框架", age: 18, unlocked: currentAge >= 18 },
      { name: "量子快乐模块", age: 25, unlocked: currentAge >= 25 },
      { name: "时空感知系统", age: 40, unlocked: currentAge >= 40 }
    ];

    const redemptionCode = "BDAY2024-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return { 
      birthDate, 
      daysAlive, 
      currentAge, 
      currentVersion, 
      nextVersion, 
      achievementTree, 
      redemptionCode 
    };
  }, []);


  const showRedemptionCode = useCallback(() => {
    const fireFireworks = () => {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ['#00f3ff', '#ff00ff', '#00ff88', '#ffcc00'];
      
      const frame = () => {
        if (Date.now() > end) return;
        
        confetti({
          particleCount: 20,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        
        confetti({
          particleCount: 20,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
  
        requestAnimationFrame(frame);
      };
  
      // 中心大爆发
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        scalar: 1.2
      });
  
      frame();
    };
  
    // 执行烟花效果
    fireFireworks();
  
    // 显示兑换码弹窗
    Swal.fire({
      title: '🎁 生物燃料兑换码',
      html: `
        <div class="redemption-box">
          <div class="code-display glitch-bg">${redemptionCode}</div>
          <p class="hint-text">可在任意合作终端兑换神经愉悦剂</p>
        </div>
      `,
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0033 100%)',
      confirmButtonText: '确认接收',
      showCancelButton: true,
      cancelButtonText: '取消',
      focusConfirm: false,
      customClass: {
        confirmButton: 'cyber-confirm-btn',
        cancelButton: 'cyber-cancel-btn'
      },
      willClose: () => confetti.reset()
    }).then((result) => {
      if (result.isConfirmed) {
        // 点击确认后返回首页
        navigate('/');
      } else if (onClose) {
        // 取消或关闭弹窗时执行的回调
        onClose();
      }
    });
  }, [redemptionCode, onClose, navigate]); 

  // 显示成就弹窗
  const showAchievement = useCallback(() => {
    const htmlContent = `
      <div class="cyber-achievement">
        <div class="version-tracker">
          <div class="version-header">
            <span class="neon-cyan">当前版本</span>
            <span class="version-tag glitch-text">${currentVersion.version}</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" style="--progress: ${(currentAge / 80) * 100}%">
              <span class="progress-text">${currentAge}岁/${currentVersion.range[1]}岁</span>
            </div>
          </div>
          <div class="version-features">
            ${currentVersion.features.map(f => `<span class="feature-tag">✔️ ${f}</span>`).join('')}
          </div>
          ${nextVersion ? `
          <div class="next-version">
            <span class="neon-pink">下一版本: ${nextVersion.version} (${nextVersion.range[0]}+岁)</span>
          </div>` : ''}
        </div>

        <div class="skill-tree">
          <h3 class="neon-purple">神经协议解锁进度</h3>
          <div class="achievement-grid">
            ${achievementTree.map(a => `
              <div class="achievement-node ${a.unlocked ? 'unlocked' : 'locked'}">
                ${a.unlocked ? '✔️' : '🔒'} ${a.name}
                <span class="age-tag">${a.age}岁</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="achievement-meta">
          <p class="neon-text">在 ${birthDate.toLocaleDateString('zh-CN')} 启动人类体验计划</p>
          <p class="rarity-tag">稀有度: <span class="glitch-text">0.0001%</span> 用户达成</p>
        </div>
      </div>
    `;

    Swal.fire({
      title: '🎉 系统成就报告',
      html: htmlContent,
      width: '800px',
      background: '#000',
      confirmButtonText: '领取兑换码 →',
      showCloseButton: true,
      focusConfirm: false
    }).then((result) => {
      if (result.isConfirmed) showRedemptionCode();
      else if (onClose) onClose();
    });
  }, [
      currentVersion, 
      nextVersion,
      currentAge,
      achievementTree,
      birthDate,
      showRedemptionCode, 
      onClose
    ]);

  useEffect(() => {
    showAchievement();
  }, [showAchievement]);

  return null;
};

export default Achievement;