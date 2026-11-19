import React, { useState, useEffect, useRef } from 'react';
import { SimLayout } from './ui/SimLayout';
import { Slider } from './ui/Slider';
import { EquationPanel } from './ui/EquationPanel';
import { GraphPanel } from './ui/GraphPanel';
import { ViewPresets, ViewPreset } from './ui/ViewPresets';
import { GlassPanel } from './ui/GlassPanel';
import { chargedParticle, ChargedParticleState } from './sims/chargedParticle';
import { DEFAULT_TIMESTEP } from './core/constants';

export const App: React.FC = () => {
  const sim = chargedParticle;

  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(sim.params.map((p) => [p.name, p.default]))
  );
  const [state, setState] = useState<ChargedParticleState>(() => sim.initState(params));
  const [running, setRunning] = useState(true);
  const [view, setView] = useState<ViewPreset>('iso');

  // Fixed timestep accumulator
  const accumulator = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    if (!running) return;
    let raf: number;

    const loop = (now: number) => {
      const delta = Math.min((now - lastTime.current) / 1000, 0.1); // clamp
      lastTime.current = now;
      accumulator.current += delta;

      let s = state;
      while (accumulator.current >= DEFAULT_TIMESTEP) {
        s = sim.step(s, params, DEFAULT_TIMESTEP);
        accumulator.current -= DEFAULT_TIMESTEP;
      }
      setState(s);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, params, state]);

  const reset = () => {
    setState(sim.initState(params));
    accumulator.current = 0;
    lastTime.current = performance.now();
  };

  const equations = sim.equations(state, params);
  const graph = sim.graphs(state, params);

  return (
    <SimLayout
      title={sim.title}
      level={sim.levels[0]}
      scene={<sim.Scene state={state} params={params} />}
      onBack={() => {}}
      topRight={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-pill bg-white/10 px-3 py-1 text-xs"
          >
            {running ? 'Pause' : 'Play'}
          </button>
          <button onClick={reset} className="rounded-pill bg-white/10 px-3 py-1 text-xs">
            Reset
          </button>
        </div>
      }
      left={
        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-lg italic text-text-primary">Controls</h2>
          {sim.params.map((p) => (
            <Slider
              key={p.name}
              label={p.name}
              symbol={p.symbol}
              unit={p.unit}
              value={params[p.name]}
              min={p.min}
              max={p.max}
              step={p.step}
              log={p.log}
              onChange={(v) => setParams((prev) => ({ ...prev, [p.name]: v }))}
              onReset={() => setParams((prev) => ({ ...prev, [p.name]: p.default }))}
            />
          ))}
        </div>
      }
      right={
        <div className="flex flex-col gap-4">
          <EquationPanel
            symbolic={equations[0].symbolic}
            substituted={equations[0].substituted}
            result={equations[0].result}
            title="Live equation"
          />
          <GraphPanel data={graph.data} label={graph.label} />
          <div className="text-sm text-text-secondary">
            <h4 className="font-serif italic text-text-primary">Prediction</h4>
            <p className="mt-1">{sim.predictionPrompts[0].question}</p>
            <details className="mt-1">
              <summary className="cursor-pointer text-accent-cyan">Show answer</summary>
              <p className="mt-1">{sim.predictionPrompts[0].answer}</p>
            </details>
          </div>
        </div>
      }
      bottom={
        <div className="text-xs text-text-muted">
          Timeline scrubber placeholder — linked graph in right panel updates live.
        </div>
      }
      topRight={
        <ViewPresets active={view} onChange={setView} />
      }
    />
  );
};
