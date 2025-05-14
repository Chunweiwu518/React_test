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
    // Only allow selecting a card if none is currently selected
    // Or allow clicking the selected card to deselect (will prevent view change)
    if (selectedCardId === null) {
        setSelectedCardId(cardId);
    } else if (selectedCardId === cardId) {
        setSelectedCardId(null); // Deselect
    }
    // If a card is already selected, clicking another card does nothing for now
  };

  // Effect to handle view transition after centering animation
  useEffect(() => {
    let timeoutId = null;
    const cardWrapper = selectedCardId ? cardContainerRef.current?.querySelector('.card-wrapper.contains-selected') : null;

    // Define the handler here so it can be added and removed with the same reference
    const handleTransitionEnd = (event) => {
      console.log(`App.js: transitionend event. Target: ${event.target.className}, Property: ${event.propertyName}, Current selectedCardId: ${selectedCardId}, currentView: ${currentView}`);
      // Ensure the event is from the cardWrapper we are listening to, for the transform property,
      // and we are still in 'cards' view with a card selected.
      if (event.target === cardWrapper && event.propertyName.includes('transform') && selectedCardId !== null && currentView === 'cards') {
        console.log('App.js: Correct transform transitionend condition met. Changing view to list.');
        clearTimeout(timeoutId); // Clear the fallback timeout
        setCurrentView('list');
        // Manually remove listener to ensure it only acts once for this specific condition
        if (cardWrapper) { // Check cardWrapper again before removing listener
            cardWrapper.removeEventListener('transitionend', handleTransitionEnd);
        }
      } else {
        console.log('App.js: transitionend condition NOT met or view already changed.');
      }
    };

    if (cardWrapper && currentView === 'cards') { 
      console.log("App.js: Attaching transitionend listener to:", cardWrapper, "for selectedCardId:", selectedCardId);
      cardWrapper.addEventListener('transitionend', handleTransitionEnd);

      // Fallback timeout, slightly longer
      timeoutId = setTimeout(() => {
        if (selectedCardId !== null && currentView === 'cards') {
          console.warn(`App.js: Fallback timeout for selectedCardId: ${selectedCardId}. Forcing view change.`);
          setCurrentView('list');
          if (cardWrapper) { // Clean up listener on fallback too
            cardWrapper.removeEventListener('transitionend', handleTransitionEnd);
          }
        }
      }, 4000); // Increased timeout to 4 seconds

      return () => {
        console.log("App.js: useEffect cleanup for selectedCardId:", selectedCardId, "- removing listener and timeout.");
        if (cardWrapper) {
            cardWrapper.removeEventListener('transitionend', handleTransitionEnd);
        }
        clearTimeout(timeoutId);
      };
    } else if (cardWrapper && currentView !== 'cards') {
        console.log("App.js: View is not 'cards', ensuring listener is not active on", cardWrapper);
        if (cardWrapper) { cardWrapper.removeEventListener('transitionend', handleTransitionEnd); }
        clearTimeout(timeoutId); 
    } else if (!cardWrapper) {
        clearTimeout(timeoutId);
    }
  }, [selectedCardId, currentView]);

  const handleBackToList = () => {
      setSelectedCardId(null); // Deselect card
      setCurrentView('cards'); // Switch view back to cards
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
