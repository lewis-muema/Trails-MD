import React, { useState, useContext, useEffect } from 'react';
import {
  Chart, Line, Area, HorizontalAxis, VerticalAxis,
} from 'react-native-responsive-linechart';
import moment from 'moment';
import { Context as PaletteContext } from '../context/paletteContext';

const lineChart = ({ data, field }) => {
  const { state: { palette } } = useContext(PaletteContext);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [minY, setMinY] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const lbls = () => {
    const points = [];
    data.locations.forEach((point) => {
      points.push(moment(point.timestamp).format('hh:mma'));
    });
    setX(points);
  };
  const pnts = () => {
    const conversion = field === 'speed' ? 3.6 : 1;
    const points = [];
    let min = data.locations[0].coords[field];
    let max = data.locations[0].coords[field];
    data.locations.forEach((point, i) => {
      min = point.coords[field] < min ? point.coords[field] : min;
      max = point.coords[field] > max ? point.coords[field] : max;
      points.push({
        y: point.coords[field] * conversion,
        x: i,
      });
    });
    setMinY(parseInt(min, 10) * conversion);
    setMaxY((parseInt(max, 10) + 1.5) * conversion);
    setY(points);
  };
  useEffect(() => {
    lbls();
    pnts();
  }, []);
  return <Chart
            style={{ height: 200, width: '100%' }}
            data={y}
            padding={{
              left: 40, bottom: 20, right: 20, top: 20,
            }}
            yDomain={{ min: minY, max: maxY }}
            viewport={{ size: { width: data.locations.length / 2 } }}
          >
            <VerticalAxis
              tickCount={5}
              theme={{
                axis: { stroke: { color: palette.text, width: 2 } },
                ticks: { stroke: { color: palette.text, width: 2 } },
                labels: { label: { width: 5 }, formatter: v => `${v.toFixed(1)}` },
                grid: {
                  visible: false,
                },
              }}
            />
            <HorizontalAxis
              tickCount={10}
              theme={{
                axis: { stroke: { color: palette.text, width: 2 } },
                ticks: { stroke: { color: palette.text, width: 2 } },
                labels: { label: { rotation: 0 }, formatter: v => String(x[parseInt(v, 10)]) },
                grid: {
                  visible: false,
                },
              }}
            />
            <Line
              theme={{
                stroke: { color: palette.text, width: 2 },
              }}
              smoothing="cubic-spline"
            />
            <Area theme={{ gradient: { from: { color: palette.text, opacity: 0.4 }, to: { color: palette.text, opacity: 0.4 } } }} smoothing="cubic-spline" />
          </Chart>;
};

export default lineChart;
