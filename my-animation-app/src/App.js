import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Card from './components/Card';
import ListView from './components/ListView';
import { ReactComponent as CardSvg } from './assets/2606149_5629.svg'; // 作為 React 組件導入

// imageUrl 現在傳遞的是組件本身
const initialCardsData = [
  { id: 1, title: '毅力', ImageComponent: CardSvg },
  { id: 2, title: '樂觀', ImageComponent: CardSvg },
  { id: 3, title: '積極', ImageComponent: CardSvg },
  { id: 4, title: '韌性', ImageComponent: CardSvg },
];

function App() {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [visibleCardIds, setVisibleCardIds] = useState([]);
  const [currentView, setCurrentView] = useState('cards'); // 'cards' or 'list'
  const cardContainerRef = useRef(null); // Ref for the card container
  const [isTransitioningView, setIsTransitioningView] = useState(false); // New state to prevent race conditions

  useEffect(() => {
    const firstCardDelay = 50; // 第一張卡觸發延遲
    const otherCardsDelay = 250; // 其他三張卡觸發延遲 (50ms + 200ms)
    
    setCards(initialCardsData);
    const timeouts = [];

    // 觸發第一張卡 (假設 id 為 1 或 index 為 0 的卡)
    if (initialCardsData.length > 0) {
      const firstCardId = initialCardsData[0].id;
      timeouts.push(setTimeout(() => {
        setVisibleCardIds(prev => [...prev, firstCardId]);
      }, firstCardDelay));
    }

    // 觸發其他卡
    const otherCardIds = initialCardsData.slice(1).map(card => card.id);
    if (otherCardIds.length > 0) {
      timeouts.push(setTimeout(() => {
        setVisibleCardIds(prev => [...prev, ...otherCardIds]);
      }, otherCardsDelay));
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handleCardClick = (cardId) => {
    if (isTransitioningView) return;
    if (selectedCardId === null) {
      setSelectedCardId(cardId);
    } else if (selectedCardId === cardId) {
      setSelectedCardId(null);
    }
  };

  // *** TEMPORARY TEST: Trigger view change directly on selectedCardId change ***
  useEffect(() => {
    let viewChangeTimeoutId = null;

    const triggerViewChange = () => {
      if (isTransitioningView) return;
      setIsTransitioningView(true);
      console.log('App.js (Test): Starting delay before view change...');
      viewChangeTimeoutId = setTimeout(() => {
        console.log('App.js (Test): Delay finished, changing view to list.');
        // Ensure card is still selected before changing view
        if (selectedCardId !== null) { 
           setCurrentView('list');
        }
        setIsTransitioningView(false);
      }, 500); // Keep the 500ms delay for now
    };

    // If a card is selected and we are in cards view, trigger the change sequence
    if (selectedCardId !== null && currentView === 'cards' && !isTransitioningView) {
        console.log("App.js (Test): Card selected, triggering view change sequence.");
        triggerViewChange();
    }
    
    // Cleanup the timeout if the component unmounts or dependencies change
    return () => {
        clearTimeout(viewChangeTimeoutId);
        // Reset transitioning flag if effect cleans up before view change completes
        // This might happen if user quickly clicks back or another card
        if (isTransitioningView) {
           // We might need a more robust way if quick back-clicks cause issues
           // For now, let's assume the 500ms completes or gets cleared.
        }
    };

  }, [selectedCardId, currentView, isTransitioningView]); // Dependencies remain

  const handleBackToList = () => {
    setSelectedCardId(null);
    setCurrentView('cards');
    setIsTransitioningView(false);
  };

  return (
    <div className="App">
      <div className="App-header">
        {/* Conditionally render title based on view? Or keep it static? */}
        {currentView === 'cards' && <h1>動畫效果展示</h1>}
        {/* We might need a different header/title for the list view */} 
      </div>

      {currentView === 'cards' && (
          <div ref={cardContainerRef} className={`card-container ${selectedCardId ? 'center-mode' : ''}`}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`
                  card-wrapper 
                  initial-pos-${index % 4} 
                  ${visibleCardIds.includes(card.id) ? 'visible' : ''} 
                  ${selectedCardId === card.id ? 'contains-selected' : ''}
                  ${index === 0 ? 'is-first' : ''}
                `}
              >
                <Card
                  id={card.id}
                  title={card.title}
                  ImageComponent={card.ImageComponent}
                  isSelected={selectedCardId === card.id}
                  onClick={handleCardClick} // Pass the updated handler
                  isVisible={visibleCardIds.includes(card.id)}
                />
              </div>
            ))}
          </div>
      )}

      {currentView === 'list' && (
          <ListView onBack={handleBackToList} />
      )}

    </div>
  );
}

export default App;
