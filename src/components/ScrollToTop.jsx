import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const appContainer = document.querySelector('.App');
    if (appContainer) {
      appContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
