import { useState, useEffect, useRef } from 'react';

const TypingText = ({ 
  phrases = ['Texto por defecto'], 
  typingSpeed = 150, 
  deletingSpeed = 75,
  pauseTime = 2000,
  className = 'text-4xl font-bold' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const speedRef = useRef(typingSpeed);

  useEffect(() => {
    const animateText = () => {
      const currentPhrase = phrases[currentIndex];
      
      if (isDeleting) {
        // Borrando
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        speedRef.current = deletingSpeed;
      } else {
        // Escribiendo
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        speedRef.current = typingSpeed;
      }
      
      // Controlar transiciones
      if (!isDeleting && displayedText === currentPhrase) {
        // Pausa al completar
        speedRef.current = pauseTime;
        setIsDeleting(true);
      } else if (isDeleting && displayedText === '') {
        // Cambiar a siguiente frase
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        speedRef.current = typingSpeed;
      }
    };
    
    const timer = setTimeout(animateText, speedRef.current);
    return () => clearTimeout(timer);
  }, [displayedText, currentIndex, isDeleting, phrases]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypingText;