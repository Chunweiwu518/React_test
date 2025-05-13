import React from 'react';
import { motion } from 'framer-motion';
import './Card.css'; // 我們也需要創建對應的 CSS 檔案

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // 每個卡片延遲出現
      duration: 0.5,
    },
  }),
  selected: {
    scale: 1.1,
    backgroundColor: '#e0f2fe', // 假設的變色效果
    // 注意：移動到中央的效果通常由父組件控制佈局或使用 layoutId
    transition: { duration: 0.3 }
  },
  deselected: {
      scale: 1,
      backgroundColor: '#ffffff', // 恢復原色
      transition: { duration: 0.3 }
  }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
      opacity: 1,
      transition: {
          delay: 0.5, // 在卡片動畫後再出現內容
          duration: 0.5
      }
  }
}

const Card = ({ id, title, imageUrl, isSelected, onSelect }) => {
  return (
    <motion.div
      layoutId={`card-container-${id}`} // 為了平滑的移動動畫
      variants={cardVariants}
      initial="hidden"
      animate={isSelected ? "selected" : "visible"}
      exit="hidden" // 如果卡片會消失的話
      custom={id} // 將 id 傳遞給 variants 的 custom 函數
      onClick={() => onSelect(id)}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        overflow: 'hidden', // 確保內容在動畫過程中不溢出
        width: '200px', // 假設寬度
        textAlign: 'center'
      }}
      whileHover={{ scale: 1.05 }} // 添加懸停效果
    >
        {/* 內容的漸進顯示 */}
       <motion.div variants={contentVariants} initial="hidden" animate="visible">
            <h3>{title}</h3>
            {imageUrl && (
            <motion.img
                src={imageUrl}
                alt={title}
                style={{ width: '100%', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }} // 圖片比文字稍晚出現
            />
            )}
       </motion.div>
    </motion.div>
  );
};

export default Card; 