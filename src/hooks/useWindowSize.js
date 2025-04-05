import { useState, useEffect } from 'react';

const useWindowSize = () => {
   const [size, setSize] = useState({
      width: undefined,
      height: undefined,
   });

   useEffect(() => {
      const onResize = () => {
         setSize({
            width: window.innerWidth,
            height: window.innerHeight,
         });
      };

      window.addEventListener('resize', onResize);
      onResize(); // Set initial size

      return () => window.removeEventListener('resize', onResize);
   }, []);

   return size;
};

export default useWindowSize;
