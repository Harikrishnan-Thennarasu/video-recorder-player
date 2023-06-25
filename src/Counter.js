import { useEffect, useState } from 'react';

const useCountdown = () => {
    const [countDown, setCountDown] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDown + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [countDown]);
    return countDown;
};

export { useCountdown };
