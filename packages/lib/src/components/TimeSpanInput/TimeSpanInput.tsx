import "./TimeSpanInput.css";
import React, { useState, ChangeEvent, KeyboardEvent, useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { formatTime, toSeconds, splitTime } from "./utils/format-time";

const b = "time-span-input";

type TimeSpanInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  inputClassName?: string;
  step?: number;
};

export const TimeSpanInput: React.FC<TimeSpanInputProps> = ({
  value = 0,
  onChange,
  className,
  inputClassName,
  step = 2,
}) => {
  const [time, setTime] = useState(value);
  const [inputValue, setInputValue] = useState(formatTime(value));
  const [pickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);  

  const timeS = useMemo(() => splitTime(time), [time]);
  useEffect(() => {
    setTime(value);
    setInputValue(formatTime(value));
  }, [value]);

  // Parse implicit seconds if no colon
  const parseInput = (value: string): { minutes: number; seconds: number } | null => {
    const colonRegex = /^(\d{1,2}):([0-5]?\d)$/; // "mm:ss"
    const secondsOnlyRegex = /^\d+$/; // "ss"

    if (colonRegex.test(value)) {
      const [minutes, seconds] = value.split(":").map(Number);
      return { minutes, seconds };
    } else if (secondsOnlyRegex.test(value)) {
      const totalSeconds = parseInt(value, 10);
      return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
      };
    }
    return null;
  };

  const validateAndFormat = (value: string): string | null => {
    const parsed = parseInput(value);
    if (!parsed) return "Invalid format. Use mm:ss or seconds.";
    if (parsed.seconds > 59) return "Seconds must be between 0 and 59.";
    if (parsed.minutes > 599) return "Minutes must be between 0 and 599.";
    return null;
  };

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const error = validateAndFormat(value);
    setError(error);

    if (!error) {
      const parsed = parseInput(value)!;
      setTime(toSeconds(parsed));
      //onChange?.(toSeconds(parsed));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() === "") return;
    const parsed = parseInput(inputValue);
    if (parsed) {
      setInputValue(
        `${String(parsed.minutes).padStart(2, "0")}:${String(parsed.seconds).padStart(2, "0")}`
      );
      onChange?.(toSeconds(parsed));
    }
  };

  const handleArrowKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const cursorPos = e.currentTarget.selectionStart || 0;
    const field = cursorPos < 3 ? "minutes" : "seconds";

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const s = e.key === "ArrowUp" ? 1 : -1;
      const newValue = {
        ...timeS,
        [field]: Math.max(0, timeS[field as "minutes" | "seconds"] + s * step),
      };
      setTime(toSeconds(newValue));
      setInputValue(
        `${String(newValue.minutes).padStart(2, "0")}:${String(newValue.seconds).padStart(2, "0")}`
      );
      onChange?.(toSeconds(newValue));

      e.preventDefault();
      setTimeout(() => {
        inputRef.current?.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    }
  };

  const handlePickerChange = (field: "minutes" | "seconds") => (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = { ...timeS, [field]: parseInt(e.target.value, 10) };
    setTime(toSeconds(newValue));
    setInputValue(
      `${String(newValue.minutes).padStart(2, "0")}:${String(newValue.seconds).padStart(2, "0")}`
    );
    onChange?.(toSeconds(newValue));
  };

  return (
    <div className={clsx(b, className)}>
      <div className={"time-span-input__input-container"}>
        <input
          ref={inputRef}
          className={clsx("time-span-input__input", inputClassName)}
          value={inputValue}
          onChange={handleTextInputChange}
          onBlur={handleBlur}
          onKeyDown={handleArrowKey}
          placeholder="mm:ss"
          aria-label="Time in mm:ss format"
        />
        <button
          type="button"
          className={"time-span-input__toggle-button"}
          onClick={() => setPickerVisible(!pickerVisible)}
          aria-label="Toggle picker"
        >
          &#128339;
        </button>
      </div>
      {error && <div className={"time-span-input__error"}>{error}</div>}
      {pickerVisible && (
        <div className={"time-span-input__picker"}>
          <select
            className={"time-span-input__select"}
            value={timeS.minutes}
            onChange={handlePickerChange("minutes")}
          >
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <select
            className={"time-span-input__select"}
            value={timeS.seconds}
            onChange={handlePickerChange("seconds")}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TimeSpanInput;
