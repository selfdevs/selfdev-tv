import React from 'react';
import './mosaic.styles.css';
import Panel from '../Panel/Panel';
import Preview from '../Preview/Preview';
import SimpleTimeline from '../../SimpleTimeline/SimpleTimeline';

function Mosaic() {
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
}

export default Mosaic;
