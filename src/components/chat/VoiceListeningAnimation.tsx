"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type VoiceListeningAnimationProps = {
  isListening: boolean;
  isHi?: boolean;
};

const BRAND = "#8a231c";
const BRAND_LIGHT = "#c44a42";
const BRAND_DARK = "#6b1b15";
const BRAND_MID = "#d96a62";

type WaveConfig = {
  amplitude: number;
  frequency: number;
  phaseOffset: number;
  yOffset: number;
  strokeWidth: number;
  color: string;
  opacity: number;
};

const WAVES: WaveConfig[] = [
  {
    amplitude: 18,
    frequency: 2.4,
    phaseOffset: 0,
    yOffset: 0,
    strokeWidth: 2.4,
    color: BRAND,
    opacity: 0.95,
  },
  {
    amplitude: 14,
    frequency: 2.8,
    phaseOffset: 1.1,
    yOffset: -3,
    strokeWidth: 1.4,
    color: BRAND_LIGHT,
    opacity: 0.6,
  },
  {
    amplitude: 12,
    frequency: 3.2,
    phaseOffset: 2.2,
    yOffset: 4,
    strokeWidth: 1.2,
    color: BRAND_DARK,
    opacity: 0.55,
  },
  {
    amplitude: 15,
    frequency: 2.1,
    phaseOffset: 3.4,
    yOffset: -5,
    strokeWidth: 1.3,
    color: BRAND,
    opacity: 0.45,
  },
  {
    amplitude: 11,
    frequency: 3.6,
    phaseOffset: 4.6,
    yOffset: 2,
    strokeWidth: 1.1,
    color: BRAND_MID,
    opacity: 0.5,
  },
  {
    amplitude: 13,
    frequency: 2.6,
    phaseOffset: 5.8,
    yOffset: -2,
    strokeWidth: 1.2,
    color: BRAND_LIGHT,
    opacity: 0.4,
  },
];

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 56;

function buildWavePath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number,
  yOffset: number,
  level: number,
  segments = 120,
): string {
  const midY = height / 2 + yOffset;
  const amp = amplitude * (0.35 + level * 0.65);
  let d = "";

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = t * width;
    const envelope = Math.sin(t * Math.PI);
    const y =
      midY +
      amp * envelope * Math.sin(frequency * t * Math.PI * 2 + phase);
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  return d;
}

export default function VoiceListeningAnimation({
  isListening,
  isHi = false,
}: VoiceListeningAnimationProps) {
  const [level, setLevel] = useState(0.2);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isListening) {
      setLevel(0.2);
      setPhase(0);
      return;
    }

    let animationId = 0;
    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let cancelled = false;
    let fallbackPhase = 0;

    const runFallback = () => {
      const tick = () => {
        if (cancelled) {
          return;
        }
        fallbackPhase += 0.06;
        const wave =
          Math.sin(fallbackPhase) * 0.22 +
          Math.sin(fallbackPhase * 2.3) * 0.12;
        setLevel(Math.max(0.15, Math.min(1, 0.38 + wave)));
        setPhase(fallbackPhase);
        animationId = requestAnimationFrame(tick);
      };
      tick();
    };

    const setup = async () => {
      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        runFallback();
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          return;
        }

        audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.82;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let smoothLevel = 0.2;
        let animPhase = 0;

        const tick = () => {
          if (cancelled) {
            return;
          }

          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i += 1) {
            sum += dataArray[i];
          }
          const raw = sum / dataArray.length / 255;
          const target = Math.max(0.15, Math.min(1, raw * 2.6 + 0.1));
          smoothLevel += (target - smoothLevel) * 0.28;
          animPhase += 0.05 + smoothLevel * 0.08;

          setLevel(smoothLevel);
          setPhase(animPhase);
          animationId = requestAnimationFrame(tick);
        };

        tick();
      } catch {
        if (!cancelled) {
          runFallback();
        }
      }
    };

    void setup();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      stream?.getTracks().forEach((track) => track.stop());
      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close();
      }
    };
  }, [isListening]);

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          key="voice-listening"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="-mx-3 w-[calc(100%+1.5rem)] overflow-hidden sm:-mx-3"
          aria-live="polite"
          aria-label={isHi ? "सुन रहा है" : "Listening"}
        >
          <div className="relative flex w-full flex-col items-center justify-center bg-[#fdf5f4] py-4 dark:bg-[#2a1210]">
            <div className="flex h-14 w-full items-center justify-center">
              <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                width="100%"
                height={SVG_HEIGHT}
                preserveAspectRatio="none"
                aria-hidden="true"
                className="block w-full"
              >
                {WAVES.map((wave, index) => (
                  <path
                    key={index}
                    d={buildWavePath(
                      SVG_WIDTH,
                      SVG_HEIGHT,
                      wave.amplitude,
                      wave.frequency,
                      phase + wave.phaseOffset,
                      wave.yOffset,
                      level,
                    )}
                    fill="none"
                    stroke={wave.color}
                    strokeOpacity={wave.opacity}
                    strokeWidth={wave.strokeWidth}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            </div>

            <p className="mt-1 text-xs font-medium tracking-wide text-[#8a231c]/80 dark:text-[#f5d0cc]/90">
              {isHi ? "सुन रही हूँ..." : "Listening..."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
