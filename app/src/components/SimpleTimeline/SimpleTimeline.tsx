import React, { CSSProperties } from 'react';
import useSchedule from '../../hooks/useSchedule';

type SimpleTimelineProps = {
  style?: CSSProperties;
};

const SimpleTimeline = ({ style }: SimpleTimelineProps) => {
  const schedule = useSchedule();

  return (
    <div style={style}>
      {schedule.map((item) => (
        <div key={item.id}>
          <p>{item.startTime}</p>
          <p>{item?.media?.name || item?.epg?.title}</p>
        </div>
      ))}
    </div>
  );
};

export default SimpleTimeline;
