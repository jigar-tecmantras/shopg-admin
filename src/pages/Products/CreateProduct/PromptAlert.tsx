// import {useEffect} from 'react';
// import {useNavigate} from 'react-router-dom';

// function Prompt(when: any): any {
//   const navigate = useNavigate();
//   //   const [isBlocking, setIsBlocking] = useState(false);
//   const message = 'abcd';
//   useEffect(() => {
//     console.log(when, 'when');
//     // eslint-disable-next-line eqeqeq
//     if (when == '0') {
//       return;
//     }

//     const handleBeforeUnload: any = (event: BeforeUnloadEvent) => {
//       event.preventDefault();
//       event.returnValue = message; // Standard for most browsers
//     };

//     // eslint-disable-next-line eqeqeq
//     if (when != '0') {
//       window.addEventListener('beforeunload', handleBeforeUnload);

//       return () => {
//         window.removeEventListener('beforeunload', handleBeforeUnload);
//       };
//     }
//   }, [when, message]);

//   // Handle blocking navigation
//   const handleNavigate = (nextLocation: string): any => {
//     // eslint-disable-next-line eqeqeq
//     if (when != '0' && !window.confirm(message)) {
//       return;
//     }
//     navigate(nextLocation); // If confirmed, proceed with navigation
//   };

//   return handleNavigate;
// }

// export default Prompt;
import React, {useEffect} from 'react';

const AlertBeforeLeave: any = () => {
  useEffect(() => {
    const handleBeforeUnload: any = (event: any) => {
      event.preventDefault();
      event.returnValue = ''; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return <div>Try leaving the page.</div>;
};

export default AlertBeforeLeave;
