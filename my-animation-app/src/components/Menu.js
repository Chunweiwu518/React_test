import React, { useState, useEffect, useRef } from 'react';
import './Menu.css';

const Menu = ({ items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const itemRefs = useRef([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onSelect(item); // 通知父組件選中的項目
    setIsOpen(false);
  };

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items]);

  useEffect(() => {
    if (isOpen) {
      setVisibleItems([]);
      let delay = 0;
      items.forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, item.id]);
        }, delay);
        delay += 100; // 每個項目延遲 100ms 出現
      });
    } else {
      // 清除可見項目，以便下次打開時重新執行動畫
      //setVisibleItems([]);
    }
  }, [isOpen, items]);

  return (
    <div className="menu-container">
      <button onClick={toggleMenu} className="menu-button">
        {selectedItem ? selectedItem.label : '選擇項目'}
      </button>
      <ul className={`menu-list ${isOpen ? 'open' : ''}`}>
        {items.map((item, index) => (
          <li
            key={item.id}
            ref={el => itemRefs.current[index] = el}
            className={`menu-item ${selectedItem && selectedItem.id === item.id ? 'selected' : ''} ${visibleItems.includes(item.id) ? 'visible' : ''}`}
            onClick={() => handleItemClick(item)}
            style={{ transitionDelay: `${index * 0.05}s` }} // CSS transition delay for staggered appearance
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu; 