import { useEffect, useState } from "react";

function TimeRemaining({ timestamp }:{timestamp: number}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    tick();
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  function calculateTimeLeft() {
    const difference = +new Date(timestamp * 1000) - +new Date();
    let timeLeft = {};
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
  
    return timeLeft;
  }
  

  function tick() {
    setTimeLeft(calculateTimeLeft());
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    return (
      <span key={interval}>
        {timeLeft[interval]}:{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
}

export default TimeRemaining;
