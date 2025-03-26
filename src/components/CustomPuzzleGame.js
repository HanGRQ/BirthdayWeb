import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';

const CustomPuzzleGame = () => {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [containerSize, setContainerSize] = useState(300);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [key, setKey] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef(null);
  const clickSoundRef = useRef(null);
  const successSoundRef = useRef(null);
  const bgMusicRef = useRef(null);

  // 设置拼图大小 (3x3)
  const rows = 3;
  const columns = 3;

  // 图片路径
  const imageUrl = '/assets/images/friend-photo.jpg';
  // 音效路径
  const clickSoundUrl = '/assets/audio/cyber-click.mp3';
  const successSoundUrl = '/assets/audio/cyber-success.mp3';
  const bgMusicUrl = '/assets/audio/CyberwayRiders.mp3';

  // 预加载图片和音频
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
    
    // 预加载音效
    const loadAudio = () => {
      try {
        clickSoundRef.current = new Audio(clickSoundUrl);
        successSoundRef.current = new Audio(successSoundUrl);
        bgMusicRef.current = new Audio(bgMusicUrl);
        
        // 配置背景音乐
        if (bgMusicRef.current) {
          bgMusicRef.current.loop = true;
          bgMusicRef.current.volume = 0.3;
        }
        
        setAudioLoaded(true);
      } catch (e) {
        console.error('音频加载错误:', e);
        setAudioLoaded(true); // 出错时也继续游戏
      }
    };
    
    loadAudio();
    
    // 清理函数
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (clickSoundRef.current) {
        clickSoundRef.current = null;
      }
      if (successSoundRef.current) {
        successSoundRef.current = null;
      }
    };
  }, []);

  // 切换背景音乐
  const toggleMusic = useCallback(() => {
    if (!bgMusicRef.current) return;
    
    if (musicPlaying) {
      bgMusicRef.current.pause();
    } else {
      bgMusicRef.current.play().catch(e => {
        console.warn('背景音乐播放失败:', e);
      });
    }
    
    setMusicPlaying(!musicPlaying);
  }, [musicPlaying]);

  // 播放点击音效
  const playClickSound = useCallback(() => {
    if (clickSoundRef.current && audioLoaded) {
      try {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play().catch(e => console.warn('音频播放失败:', e));
      } catch (e) {
        console.warn('播放点击音效失败:', e);
      }
    }
  }, [audioLoaded]);

  // 播放成功音效
  const playSuccessSound = useCallback(() => {
    if (successSoundRef.current && audioLoaded) {
      try {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current.play().catch(e => console.warn('音频播放失败:', e));
      } catch (e) {
        console.warn('播放成功音效失败:', e);
      }
    }
  }, [audioLoaded]);

  // 容器大小计算
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const size = Math.min(clientWidth, 400);
      setContainerSize(size);
    }
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  // 打乱拼图
  const shufflePieces = useCallback(() => {
    console.log('打乱拼图开始');
    setKey(prev => prev + 1);
    setPieces(prev => {
      if (!prev || prev.length === 0) {
        console.warn('尝试打乱空的拼图');
        return prev;
      }
      
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i].currentRow, shuffled[j].currentRow] = [shuffled[j].currentRow, shuffled[i].currentRow];
        [shuffled[i].currentCol, shuffled[j].currentCol] = [shuffled[j].currentCol, shuffled[i].currentCol];
      }
      
      return shuffled;
    });
    setSolved(false);
    playClickSound();
  }, [playClickSound]);

  // 初始化拼图
  const initializePuzzle = useCallback(() => {
    console.log('初始化拼图开始', containerSize, rows, columns);
    
    if (containerSize <= 0) {
      console.warn('容器大小无效', containerSize);
      return;
    }
    
    const pieceWidth = containerSize / columns;
    const pieceHeight = containerSize / rows;
    const newPieces = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        newPieces.push({
          id: row * columns + col,
          correctRow: row,
          correctCol: col,
          currentRow: row,
          currentCol: col,
          width: pieceWidth,
          height: pieceHeight
        });
      }
    }
    
    setPieces(newPieces);
    
    // 确保在设置完碎片后再打乱
    setTimeout(() => {
      shufflePieces();
      setInitialized(true);
    }, 300);
  }, [containerSize, rows, columns, shufflePieces]);

  // 处理游戏完成，跳转到成就页面
  const handleGameComplete = useCallback(() => {
    console.log('游戏完成，准备跳转到成就页面');
    
    // 播放成功音效
    playSuccessSound();
    
    // 延迟跳转到成就页面
    setTimeout(() => {
      // 如果背景音乐正在播放，停止它
      if (bgMusicRef.current && musicPlaying) {
        bgMusicRef.current.pause();
      }
      console.log('跳转到achievement页面');
      navigate('/achievement');
    }, 1500);
  }, [navigate, playSuccessSound, musicPlaying]);

  // 检查拼图完成
  const checkIfSolved = useCallback((currentPieces) => {
    console.log('检查拼图是否完成');
    const isSolved = currentPieces.every(piece => 
      piece.currentRow === piece.correctRow && 
      piece.currentCol === piece.correctCol
    );
    
    console.log('拼图完成状态:', isSolved);
    
    if (isSolved && !solved) {
      setSolved(true);
      handleGameComplete();
    }
  }, [handleGameComplete, solved]);

  // 处理拼图点击
  const handlePieceClick = useCallback((piece) => {
    if (solved) return;

    playClickSound();

    if (selectedPiece === null) {
      setSelectedPiece(piece.id);
    } else {
      const newPieces = [...pieces];
      const piece1 = newPieces.find(p => p.id === selectedPiece);
      const piece2 = newPieces.find(p => p.id === piece.id);
      
      if (!piece1 || !piece2) {
        setSelectedPiece(null);
        return;
      }

      [piece1.currentRow, piece2.currentRow] = [piece2.currentRow, piece1.currentRow];
      [piece1.currentCol, piece2.currentCol] = [piece2.currentCol, piece1.currentCol];

      setPieces(newPieces);
      setSelectedPiece(null);
      checkIfSolved(newPieces);
    }
  }, [selectedPiece, pieces, solved, checkIfSolved, playClickSound]);

  // 初始化游戏
  useEffect(() => {
    if (containerSize > 0 && imageLoaded && !initialized) {
      initializePuzzle();
    }
  }, [containerSize, imageLoaded, initialized, initializePuzzle]);

  if (!imageLoaded) {
    return <div className="loading">加载图片中...</div>;
  }

  return (
    <div className="puzzle-container">
      <div className="puzzle-game-wrapper">
        <div className="puzzle-game" ref={containerRef}>
          {/* 赛博朋克标题 */}
          <div className="cyber-title-container">
            <h2 className="cyber-title">最后关卡</h2>
            <p className="cyber-subtitle">解锁生日礼物</p>
          </div>
          
          <div 
            className="puzzle-board cyber-puzzle"
            style={{
              width: `${containerSize}px`,
              height: `${containerSize}px`
            }}
          >
            {pieces.map(piece => (
              <div
                key={`${piece.id}-${key}`}
                className={`puzzle-piece ${selectedPiece === piece.id ? 'selected' : ''}`}
                style={{
                  width: `${piece.width}px`,
                  height: `${piece.height}px`,
                  left: `${piece.currentCol * piece.width}px`,
                  top: `${piece.currentRow * piece.height}px`,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${containerSize}px ${containerSize}px`,
                  backgroundPosition: `-${piece.correctCol * piece.width}px -${piece.correctRow * piece.height}px`,
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handlePieceClick(piece)}
              />
            ))}
          </div>
          
          <button 
            className="shuffle-button neon-button"
            onClick={shufflePieces}
          >
            重新打乱
          </button>
        </div>
      </div>
      
      {/* 音乐控制按钮 */}
      <div 
        className={`music-control ${musicPlaying ? 'playing' : ''}`} 
        onClick={toggleMusic}
        title={musicPlaying ? '暂停音乐' : '播放音乐'}
      >
        <span className="music-icon">
          {musicPlaying ? '♪' : '♫'}
        </span>
      </div>
    </div>
  );
};

export default CustomPuzzleGame;