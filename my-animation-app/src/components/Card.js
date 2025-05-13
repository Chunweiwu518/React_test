import React, { useEffect, useRef } from 'react';
import Vivus from 'vivus';
import './Card.css';

// 接收 ImageComponent 作為 prop
const Card = ({ id, title, ImageComponent, isSelected, onClick, isVisible }) => {
  const svgContainerRef = useRef(null); // Ref for the container div
  const vivusInstance = useRef(null); // Ref to store vivus instance

  useEffect(() => {
    const svgElement = svgContainerRef.current?.querySelector('svg');

    // 只有在 isVisible 且 SVG 存在，且 Vivus 實例尚未建立時才執行
    if (isVisible && svgElement && !vivusInstance.current) {
      console.log("Card.js: Conditions met, attempting to animate SVG for card", id);

      const animationDelay = 1400; // 維持延遲
      const timer = setTimeout(() => {
        // 再次檢查 svgElement 是否仍然存在 (以防萬一)
        if (svgContainerRef.current?.querySelector('svg')) {
            try {
              console.log("Card.js: Initializing Vivus for card", id);
              vivusInstance.current = new Vivus(
                svgElement,
                {
                  duration: 800,
                  type: 'oneByOne',
                  start: 'manual',
                },
                () => {
                  console.log("Card.js: Vivus animation finished for card", id);
                }
              );
              if (vivusInstance.current) {
                // Vivus is initialized, paths are set to "undrawn".
                // Now make the SVG visible then play.
                svgElement.style.opacity = '1'; 
                vivusInstance.current.play();
                console.log("Card.js: Vivus initialized, SVG made visible, and play() called for card", id);
              } else {
                   console.error("Card.js: Vivus instance is null after init for card " + id);
              }
            } catch (error) {
              console.error("Card.js: Error initializing or playing Vivus for card " + id + ":", error);
            }
        } else {
            console.warn("Card.js: SVG element disappeared before Vivus init for card", id);
        }
      }, animationDelay);

      // 返回清除函數，用於清除計時器和 Vivus 實例
      return () => {
        clearTimeout(timer);
        if (vivusInstance.current) {
          vivusInstance.current.destroy(); // 使用 destroy 徹底清理
          vivusInstance.current = null; // 將 ref 設回 null
          console.log("Card.js: Vivus instance destroyed for card", id);
        }
      };
    } else if (!isVisible && vivusInstance.current) {
      // 如果組件變為不可見且 Vivus 實例存在，則重置/銷毀它
      vivusInstance.current.destroy(); // 或 reset() 如果你希望保留元素狀態
      vivusInstance.current = null;
      console.log("Card.js: Vivus instance destroyed due to isVisible false for card", id);
    }
  }, [isVisible, id, ImageComponent]); // 添加 ImageComponent 作為依賴，以防 SVG 內容變化

  // Cleanup on unmount (這個 useEffect 可能可以合併到上面，但分開也清晰)
  useEffect(() => {
    return () => {
      if (vivusInstance.current) {
        vivusInstance.current.destroy(); // 確保卸載時銷毀
        vivusInstance.current = null;
        console.log("Card.js: Vivus instance destroyed on unmount for card", id);
      }
    };
  }, [id]); // 依賴 id 保持不變

  return (
    <div
      className={`card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick && onClick(id)}
    >
      {/* Render the SVG component inside a div with ref */}
      <div ref={svgContainerRef} className="card-image">
        {ImageComponent && <ImageComponent />} 
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
      </div>
    </div>
  );
};

export default Card; 