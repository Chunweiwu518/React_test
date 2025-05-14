import React, { useState, useEffect, useRef } from 'react';
import './ListView.css';

const listItemsData = [
  "無懼未來的自己",
  "勇於挑戰的自己",
  "珍惜每天的自己"
];

const ListView = ({ onBack }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, entry, banner-visible, list-visible
  const bannerRef = useRef(null); // Ref for the banner to get its height

  // Animation Sequence Controller
  useEffect(() => {
    // 1. Start entry animation for the container
    const entryTimer = setTimeout(() => {
      setAnimationPhase('entry'); 
    }, 50); // Small delay to ensure CSS is ready

    // 2. After entry, show the banner capsule
    const bannerTimer = setTimeout(() => {
        setAnimationPhase('banner-visible');
    }, 600); // Corresponds to container fade-in (0.5s) + small buffer

    // 3. After banner is visible, start dropdown
    const listTimer = setTimeout(() => {
        setAnimationPhase('list-visible');
    }, 1100); // Banner visible starts at 600ms, give it 500ms to appear before dropdown

    return () => {
        clearTimeout(entryTimer);
        clearTimeout(bannerTimer);
        clearTimeout(listTimer);
    };
  }, []); // Run only once on mount

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
    // TODO: Maybe trigger something else on select?
  };

  return (
    <div className={`list-view-container phase-${animationPhase}`}>
        {/* Initial text fades in with container */}
        <div className="initial-prompt-text">
            步行在異世界的走廊, 您想成為的樣貌是？
        </div>

        {/* The banner/list element */}
        {/* Apply phase class ALSO to banner for specific phase styling */}
        <div ref={bannerRef} className={`list-banner phase-${animationPhase}`}>
            {/* Optional: Add capsule elements here if needed */}
            {/* <div className="capsule-decor left">...</div> */}
            {/* <div className="capsule-decor right">...</div> */}
            <div className="list-content-wrapper"> {/* Added wrapper for content fade */} 
                <div className="list-title">PLAY ON WITH</div>
                <div className="list-items">
                    {listItemsData.map((item, index) => (
                        <div 
                            key={index}
                            className={`list-item ${selectedItemIndex === index ? 'selected' : ''}`}
                            onClick={() => handleItemClick(index)}
                            style={{ transitionDelay: `${index * 0.1}s` }} // Staggered delay for fade-in
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            {/* TODO: Add a back button? Maybe integrated into the design */}
        </div>
    </div>
  );
};

export default ListView; 