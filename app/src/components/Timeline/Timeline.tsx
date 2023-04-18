import React, { createContext, useContext, useEffect } from 'react';
import './timeline.css';
import useSchedule from '../../hooks/useSchedule';
import { DateTime, Duration } from 'luxon';

type Props = {
  style?: React.CSSProperties;
};

const scheduleContext = createContext([]);

const Timeline = ({ style }: Props) => {
  const schedule = useSchedule();
  const [selectedHour, setSelectedHour] = React.useState<number>(0);
  const [selectedMinute, setSelectedMinute] = React.useState<number>(0);
  const nbOfHours = Array.from(Array(24).keys());
  const nbOfMinutes = Array.from(Array(60).keys());
  const nbOfSeconds = Array.from(Array(60).keys());

  return (
    <scheduleContext.Provider value={schedule}>
      <div className="timeline" style={style}>
        <div className="timeline-hours timeline-row">
          {nbOfHours.map((hour) => (
            <Hour
              hour={hour}
              key={`hour-${hour}`}
              setSelectedHour={setSelectedHour}
              cursor={hour === selectedHour}
            />
          ))}
        </div>
        <div className="timeline-minutes timeline-row">
          {nbOfMinutes.map((minute) => (
            <Minute
              key={`minute-${minute}`}
              minute={minute}
              hour={selectedHour}
              setSelectedMinute={setSelectedMinute}
              cursor={minute === selectedMinute}
            />
          ))}
        </div>
        <div className="timeline-seconds timeline-row">
          {nbOfSeconds.map((second) => (
            <Second
              key={`second-${second}`}
              hour={selectedHour}
              minute={selectedMinute}
              second={second}
            />
          ))}
        </div>
        <p>
          {selectedHour}:{selectedMinute}
        </p>
      </div>
    </scheduleContext.Provider>
  );
};

type HourProps = {
  hour: number;
  cursor?: boolean;
  setSelectedHour: (hour: number) => void;
};

function Hour({ hour, cursor, setSelectedHour }: HourProps) {
  const schedule = useContext(scheduleContext);
  const [itemState, setItemState] = React.useState<boolean>(false);

  const getItemState: boolean = schedule.reduce((acc, item) => {
    const startTime = DateTime.fromISO(item.startTime);
    const duration = Duration.fromObject({
      seconds: item.duration || item.media.length,
    });
    const endTime = startTime.plus(duration);
    const currentHourStart = DateTime.fromObject({
      hour,
    });
    const currentHourEnd = DateTime.fromObject({
      hour: hour + 1,
    });
    if (
      (startTime >= currentHourStart && startTime <= currentHourEnd) ||
      (endTime >= currentHourStart && endTime <= currentHourEnd)
    ) {
      return true;
    }
    return acc;
  }, false);

  useEffect(() => {
    setItemState(getItemState);
  }, [schedule]);

  return (
    <div
      key={`hour-${hour}`}
      onClick={() => setSelectedHour(hour)}
      className={[
        'timeline-hour',
        'timeline-frame',
        ...[itemState ? ['timeline-selected'] : []],
        ...[cursor ? ['timeline-cursor'] : []],
      ].join(' ')}
    >
      {hour}
    </div>
  );
}

type MinuteProps = {
  hour: number;
  minute: number;
  setSelectedMinute: (minute: number) => void;
  cursor?: boolean;
};

function Minute({ hour, minute, setSelectedMinute, cursor }: MinuteProps) {
  const schedule = useContext(scheduleContext);
  const [itemState, setItemState] = React.useState<boolean>(false);

  const getItemState: boolean = schedule.reduce((acc, item) => {
    const startTime = DateTime.fromISO(item.startTime);
    const duration = Duration.fromObject({
      seconds: item.duration || item.media.length,
    });
    const endTime = startTime.plus(duration);
    const currentMinuteStart = DateTime.fromObject({
      hour,
      minute,
    });
    const currentMinuteEnd = DateTime.fromObject({
      hour,
      minute: minute + 1,
    });
    if (startTime < currentMinuteEnd || endTime >= currentMinuteStart) {
      return true;
    }
    return acc;
  }, false);

  useEffect(() => {
    setItemState(getItemState);
  }, [hour, minute]);

  return (
    <div
      key={`minute-${minute}`}
      onClick={() => setSelectedMinute(minute)}
      className={[
        'timeline-minute',
        'timeline-frame',
        ...[itemState ? ['timeline-selected'] : []],
        ...[cursor ? ['timeline-cursor'] : []],
      ].join(' ')}
    >
      {minute}
    </div>
  );
}

type SecondProps = {
  hour: number;
  minute: number;
  second: number;
};

function Second({ hour, minute, second }: SecondProps) {
  const schedule = useContext(scheduleContext);
  const [itemState, setItemState] = React.useState<boolean>(false);

  const getItemState: boolean = schedule.reduce((acc, item) => {
    const startTime = DateTime.fromISO(item.startTime);
    const duration = Duration.fromObject({
      second: item.duration || item.media.length,
    });
    const endTime = startTime.plus(duration);
    const currentTime = DateTime.fromObject({
      hour,
      minute,
      second,
    });
    if (currentTime >= startTime && currentTime <= endTime) {
      return true;
    }
    return acc;
  }, false);

  useEffect(() => {
    setItemState(getItemState);
  }, [hour, minute, second]);

  return (
    <div
      key={`second-${second}`}
      className={[
        'timeline-second',
        'timeline-frame',
        ...[itemState ? ['timeline-selected'] : []],
      ].join(' ')}
    >
      {second}
    </div>
  );
}

export default Timeline;
