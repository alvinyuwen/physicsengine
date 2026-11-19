import React, { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';

interface GraphPanelProps {
  data: { x: number[]; y: number[] };
  label: string;
  color?: string;
  height?: number;
}

export const GraphPanel: React.FC<GraphPanelProps> = ({
  data,
  label,
  color = '#22D3EE',
  height = 140,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const opts: uPlot.Options = {
      width: containerRef.current.clientWidth,
      height,
      series: [
        {},
        {
          label,
          stroke: color,
          width: 2,
        },
      ],
      axes: [
        { stroke: '#8EA0B8', grid: { stroke: 'rgba(255,255,255,0.06)' } },
        { stroke: '#8EA0B8', grid: { stroke: 'rgba(255,255,255,0.06)' } },
      ],
      cursor: { show: true },
      legend: { show: false },
    };
    const u = new uPlot(opts, [data.x, data.y], containerRef.current);
    plotRef.current = u;
    return () => u.destroy();
  }, []);

  useEffect(() => {
    plotRef.current?.setData([data.x, data.y]);
  }, [data]);

  return <div ref={containerRef} className="w-full" />;
};
