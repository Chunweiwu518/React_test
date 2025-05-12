import React, { useState } from 'react';
import './App.css';
// 引入我們即將創建的 Card 組件
// import Card from './Card'; 
// 引入 framer-motion
import { motion, AnimatePresence } from 'framer-motion';

// 模擬卡片數據 (之後可以替換成真實內容)
const cardData = [
  { id: 1, title: '毅力' },
  { id: 2, title: '樂觀' },
  { id: 3, title: '積極' },
  { id: 4, title: '執著' },
];

function App() {
  // selectedId 狀態用來追蹤被選中的卡片 ID，null 代表沒有卡片被選中
  const [selectedId, setSelectedId] = useState(null);

  // 根據 selectedId 找到被選中的卡片數據
  const selectedCard = cardData.find(card => card.id === selectedId);

  return (
    <div className="App">
      <header className="App-header">
        <h1>歡迎進駐 匠心幾何世界</h1>
        <p>靜下心，抽取專屬心靈卡牌</p>
      </header>
      
      {/* 卡片容器 */}
      <motion.div className="card-container">
        {cardData.map(card => (
          // 之後會用真實的 Card 組件替換 motion.div
          <motion.div
            key={card.id}
            className="card-placeholder" // 暫時使用 placeholder 樣式
            layoutId={`card-container-${card.id}`} // 為了佈局動畫
            onClick={() => setSelectedId(card.id)} // 點擊時設置 selectedId
            style={{ cursor: 'pointer' }} // 提示可以點擊
          >
            <motion.h5>{card.title}</motion.h5>
            {/* 這裡可以放卡片圖案的 SVG 或佔位符 */}
          </motion.div>
        ))}
      </motion.div>

      {/* 使用 AnimatePresence 來處理選中卡片出現/消失的動畫 */}
      <AnimatePresence>
        {selectedId && selectedCard && (
          // 當有卡片被選中時，顯示放大的卡片視圖 (modal)
          <motion.div
            className="card-selected-backdrop" // 背景遮罩
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)} // 點擊背景關閉
          >
            <motion.div
              className="card-selected-content" // 放大的卡片容器
              layoutId={`card-container-${selectedId}`} // 與列表中的卡片對應
              // 防止點擊卡片內容本身也觸發背景的關閉事件
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.h2>{selectedCard.title}</motion.h2>
              {/* 這裡可以放更詳細的內容或動畫 */}
              <motion.button onClick={() => setSelectedId(null)}>關閉</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
