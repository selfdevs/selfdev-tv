import React from 'react';
import useSchedule from '../hooks/useSchedule';

const SimpleTimeline = ({ style }) => {
  const schedule = useSchedule();
  return (
    <div style={style}>
      {schedule.map((item) => (
        <div key={item.id}>
          <p>{item.startTime}</p>
          <p>{item.media.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SimpleTimeline;
