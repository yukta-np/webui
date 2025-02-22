import { useMediaQuery } from 'react-responsive';

export default function useMobile() {
   return useMediaQuery({ maxWidth: 768 });
}

