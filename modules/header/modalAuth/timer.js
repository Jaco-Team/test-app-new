import { useEffect } from 'react';
import { useHeaderStoreNew } from '@/components/store';
import Typography from '@mui/material/Typography';

export default function Timer() {
  const [toTime, timer, setTimer] = useHeaderStoreNew((state) => [state?.toTime, state?.timer, state?.setTimer]);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        const time = timer - 1;
        setTimer(time);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [setTimer, timer]);

  return (
    <div className="loginTimer">
      <Typography component="span">{toTime(timer)}</Typography>
    </div>
  );
}
