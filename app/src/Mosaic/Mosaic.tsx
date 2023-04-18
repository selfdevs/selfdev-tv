import React from 'react';
import './mosaic.styles.css';
import ObsClient from '../services/ObsClient';
import Panel from '../Panel/Panel';
import Preview from '../Preview/Preview';
import SimpleTimeline from '../SimpleTimeline/SimpleTimeline';

window.addEventListener('keypress', (e) => {
  switch (e.key) {
    case '1':
      ObsClient.switchToScene('slot1');
      break;
    case '2':
      ObsClient.switchToScene('slot2');
      break;
    case '3':
      ObsClient.switchToScene('slot3');
      break;
    case '4':
      ObsClient.switchToScene('slot4');
      break;
  }
});

const Mosaic = () => {
  return (
    <div id="mosaic-container">
      <Preview
        endpoint="program"
        style={{
          gridColumn: '3 / 5',
          gridRow: '1 / 3',
        }}
      />
      <Preview
        endpoint="fallback"
        style={{
          gridColumn: 1,
          gridRow: 1,
        }}
      />
      <Preview
        endpoint="schedule"
        style={{
          gridColumn: 2,
          gridRow: 1,
        }}
      />
      <Preview
        endpoint="slot1"
        style={{
          gridColumn: 1,
          gridRow: 2,
        }}
      />
      <Preview
        endpoint="slot2"
        style={{
          gridColumn: 2,
          gridRow: 2,
        }}
      />
      {/*<Timeline*/}
      {/*  style={{*/}
      {/*    gridColumn: '1 / 5',*/}
      {/*    gridRow: 3,*/}
      {/*  }}*/}
      <SimpleTimeline
        style={{
          gridColumn: '1 / 5',
          gridRow: 3,
        }}
      />
      <Panel
        style={{
          gridColumn: '1 / 5',
          gridRow: 4,
        }}
      />
    </div>
  );
};

export default Mosaic;
