import React from 'react';
import { motion } from 'framer-motion';
import './Card.css'; // 我們也需要創建對應的 CSS 檔案

const Card = ({ id, title, onSelect, layoutId }) => {
  return (
    <motion.div
      className="card"
      layoutId={layoutId} // 使用從 App.js 傳來的 layoutId
      onClick={() => onSelect(id)} // 點擊時觸發從 App.js 傳來的函數
      // Framer Motion 的 hover 效果可以和 CSS 的 :hover 效果疊加或選擇其一
      // whileHover={{ y: -5, scale:1.03 }} // Framer Motion 驅動的 hover
      transition={{ duration: 0.2, ease: "easeOut" }} // 可以為 layout 動畫和其他過渡指定
    >
      {/* 這裡可以放 SVG 動畫 */}
      <div className="card-pattern-placeholder"></div> 
      <motion.h5>{title}</motion.h5>
    </motion.div>
  );
};

export default Card; 