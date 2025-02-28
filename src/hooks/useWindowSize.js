import { useState, useEffect } from 'react';

const useWindowSize = () => {
   const [size, setSize] = useState({
      width: undefined,
      height: undefined,
   });

   useEffect(() => {
      const handleResize = () => {
         setSize({
            width: window.innerWidth,
            height: window.innerHeight,
         });
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial size

      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return size;
};

export default useWindowSize;
