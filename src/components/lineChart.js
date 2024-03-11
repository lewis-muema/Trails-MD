import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import {
  Chart, Line, Area, HorizontalAxis, VerticalAxis, Tooltip,
} from 'react-native-responsive-linechart';
import moment from 'moment';
import { Context as PaletteContext } from '../context/paletteContext';
import { Context as locationContext } from '../context/locationContext';

const lineChart = ({ data, field }) => {
  const { state: { palette } } = useContext(PaletteContext);
  const { state: { progress } } = useContext(locationContext);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [minY, setMinY] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const lineChartRef = useRef(null);
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
  useEffect(() => {
    if (lineChartRef.current && progress < y.length) {
      lineChartRef.current.setTooltipIndex(progress);
    }
  }, [progress]);
  return <Chart
            style={{ height: 200, width: '100%' }}
            data={y}
            padding={{
              left: 40, bottom: 20, right: 20, top: 20,
            }}
            yDomain={{ min: minY, max: maxY }}
            xDomain={{ min: 0, max: data?.locations?.length }}
            viewport={{ size: { width: data.locations.length } }}
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
              tickCount={5}
              theme={{
                axis: { stroke: { color: palette.text, width: 2 } },
                ticks: { stroke: { color: palette.text, width: 2 } },
                labels: { label: { rotation: 0 }, formatter: v => (x[parseInt(v, 10)] ? String(x[parseInt(v, 10)]) : '') },
                grid: {
                  visible: false,
                },
              }}
            />
            <Line
              ref={lineChartRef}
              tooltipComponent={<Tooltip theme={{
                formatter: ({ y }) => y.toFixed(field === 'speed' ? 2 : 1),
                shape: {
                  width: 60,
                  height: 20,
                  color: palette.text,
                },
                label: {
                  color: palette.background,
                  fontSize: 12,
                  fontWeight: 700,
                  opacity: 1,
                },
              }} />}
              theme={{
                stroke: { color: palette.text, width: 2 },
                scatter: {
                  selected: {
                    color: palette.text, width: 6, height: 6, rx: 6,
                  },
                },
              }}
              smoothing="cubic-spline"
            />
            <Area theme={{ gradient: { from: { color: palette.text, opacity: 0.4 }, to: { color: palette.text, opacity: 0.4 } } }} smoothing="cubic-spline" />
          </Chart>;
};

export default lineChart;
