"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ApprenticeSprite,
  BeatSprite,
  GuideSprite,
  type BeatKind,
} from "@/components/GameSprites";

const beats: Array<{ id: BeatKind; name: string; frequency: number }> = [
  { id: "heart", name: "Heart", frequency: 220 },
  { id: "seed", name: "Sprout", frequency: 293.66 },
  { id: "orb", name: "Water", frequency: 392 },
  { id: "shell", name: "Shell", frequency: 523.25 },
];

const patterns: BeatKind[][] = [
  ["heart", "heart", "seed"],
  ["orb", "shell", "orb"],
  ["seed", "heart", "shell", "heart"],
  ["shell", "orb", "seed", "orb"],
];

type Phase = "welcome" | "demo" | "input" | "success" | "complete";

const dialogue: Record<Phase, string> = {
  welcome: "The heartwood remembers every rhythm. Shall we wake it?",
  demo: "Listen first. Let each little spirit have its turn.",
  input: "Your turn, Rill. Give the pattern back to me.",
  success: "Exactly! A beat is just a promise that returns.",
  complete: "The grove is awake. You listened before you played.",
};

export function BeatPatternGame() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [round, setRound] = useState(0);
  const [playerInput, setPlayerInput] = useState<BeatKind[]>([]);
  const [activeBeat, setActiveBeat] = useState<BeatKind | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [message, setMessage] = useState("Meet Pip and learn your first rhythm.");
  const [muted, setMuted] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const playTone = useCallback(
    (beat: BeatKind, duration = 0.18) => {
      if (muted) {
        return;
      }

      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      void context.resume();

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const frequency =
        beats.find((candidate) => candidate.id === beat)?.frequency ?? 220;

      oscillator.type = beat === "shell" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + duration,
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.02);
    },
    [muted],
  );

  const showPattern = useCallback(() => {
    clearTimers();
    setPlayerInput([]);
    setPhase("demo");
    setMessage(`Listen: ${patterns[round]?.length ?? 0} beats.`);

    const pattern = patterns[round] ?? patterns[0];
    pattern?.forEach((beat, index) => {
      const onTimer = window.setTimeout(() => {
        setActiveBeat(beat);
        setActiveStep(index);
        playTone(beat, 0.22);
      }, 450 + index * 650);
      const offTimer = window.setTimeout(() => {
        setActiveBeat(null);
        setActiveStep(null);
      }, 790 + index * 650);
      timers.current.push(onTimer, offTimer);
    });

    const inputTimer = window.setTimeout(
      () => {
        setActiveBeat(null);
        setActiveStep(null);
        setPhase("input");
        setMessage("Your turn. Use the objects or keys 1–4.");
      },
      650 + pattern.length * 650,
    );
    timers.current.push(inputTimer);
  }, [clearTimers, playTone, round]);

  const chooseBeat = useCallback(
    (beat: BeatKind) => {
      if (phase !== "input") {
        return;
      }

      const pattern = patterns[round] ?? patterns[0];
      const expected = pattern?.[playerInput.length];
      playTone(beat);
      setActiveBeat(beat);
      const offTimer = window.setTimeout(() => setActiveBeat(null), 180);
      timers.current.push(offTimer);

      if (beat !== expected) {
        setPlayerInput([]);
        setMessage("That changed the rhythm. Start your reply again.");
        return;
      }

      const nextInput = [...playerInput, beat];
      setPlayerInput(nextInput);
      setMessage(
        nextInput.length === pattern?.length
          ? "Pattern complete."
          : `${nextInput.length} of ${pattern?.length ?? 0} beats.`,
      );

      if (nextInput.length === pattern?.length) {
        const successTimer = window.setTimeout(() => {
          setPhase(round === patterns.length - 1 ? "complete" : "success");
          setMessage(
            round === patterns.length - 1
              ? "You woke the heartwood!"
              : "The grove learned your rhythm.",
          );
        }, 380);
        timers.current.push(successTimer);
      }
    },
    [phase, playTone, playerInput, round],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      const beat = beats[Number(event.key) - 1]?.id;
      if (beat) {
        chooseBeat(beat);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chooseBeat]);

  const nextRound = () => {
    clearTimers();
    setRound((current) => current + 1);
    setPlayerInput([]);
    setPhase("welcome");
    setMessage("A new pattern stirs in the grove.");
  };

  const restart = () => {
    clearTimers();
    setRound(0);
    setPlayerInput([]);
    setActiveBeat(null);
    setActiveStep(null);
    setPhase("welcome");
    setMessage("Meet Pip and learn your first rhythm.");
  };

  const pattern = patterns[round] ?? patterns[0];

  return (
    <main className="beat-game-shell">
      <div className="beat-game-haze" />
      <section className="beat-game" aria-labelledby="game-title">
        <header className="game-topbar">
          <div>
            <p className="game-kicker">The listening grove · First lesson</p>
            <h1 id="game-title">Echo the Heartwood</h1>
          </div>
          <button
            className="sound-toggle"
            type="button"
            aria-pressed={muted}
            onClick={() => setMuted((current) => !current)}
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
        </header>

        <div className="round-track" aria-label={`Lesson ${round + 1} of 4`}>
          {patterns.map((_, index) => (
            <span
              className={index <= round ? "round-dot round-dot-active" : "round-dot"}
              key={index}
            />
          ))}
        </div>

        <div className="grove-stage">
          <div className="forest-light forest-light-one" />
          <div className="forest-light forest-light-two" />
          <div className="character character-apprentice">
            <ApprenticeSprite className="character-sprite" />
            <span>Rill</span>
          </div>

          <div className="dialogue-card">
            <p className="speaker">Pip, keeper of echoes</p>
            <p>{dialogue[phase]}</p>
          </div>

          <div className="character character-guide">
            <GuideSprite className="character-sprite guide-float" />
            <span>Pip</span>
          </div>
        </div>

        <section className="lesson-board" aria-label="Beat pattern">
          <div className="pattern-row" aria-label="Pattern progress">
            {pattern?.map((beat, index) => {
              const filledBeat =
                phase === "demo" && activeStep === index
                  ? beat
                  : playerInput[index];
              return (
                <span
                  className={filledBeat ? "pattern-slot pattern-slot-filled" : "pattern-slot"}
                  key={`${round}-${index}`}
                >
                  {filledBeat ? (
                    <BeatSprite beat={filledBeat} className="slot-sprite" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
              );
            })}
          </div>

          <p className="game-status" aria-live="polite">
            {message}
          </p>

          <div className="beat-palette">
            {beats.map((beat, index) => (
              <button
                className={
                  activeBeat === beat.id
                    ? `beat-button beat-${beat.id} beat-button-active`
                    : `beat-button beat-${beat.id}`
                }
                disabled={phase !== "input"}
                key={beat.id}
                type="button"
                onClick={() => chooseBeat(beat.id)}
              >
                <BeatSprite beat={beat.id} className="beat-sprite" />
                <span className="beat-name">{beat.name}</span>
                <kbd>{index + 1}</kbd>
              </button>
            ))}
          </div>

          <div className="game-actions">
            {(phase === "welcome" || phase === "input") && (
              <button className="primary-action" type="button" onClick={showPattern}>
                {phase === "welcome" ? "Hear the pattern" : "Hear it again"}
              </button>
            )}
            {phase === "success" && (
              <button className="primary-action" type="button" onClick={nextRound}>
                Try the next pattern
              </button>
            )}
            {phase === "complete" && (
              <button className="primary-action" type="button" onClick={restart}>
                Play from the beginning
              </button>
            )}
            <p>Listen, remember, then answer. There is no timer.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
