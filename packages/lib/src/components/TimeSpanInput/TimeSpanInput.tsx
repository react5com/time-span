import "./TimeSpanInput.scss";
import { useState, ChangeEvent, KeyboardEvent, useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { formatTimeSpan, toSeconds, splitTime } from "../../utils/format-time";
import { bem } from "../../utils/bem";

type TimeSpanInputProps = {
  id?: string;
  name?: string;
  readOnly?: boolean;
  value?: number | string;
  onChange?: (value: number) => void;
  className?: string;
  inputClassName?: string;
  step?: number;
};

const b = bem("time-span-input");
export const TimeSpanInput = ({
  id,
  name,
  readOnly = false,
  value = 0,
  onChange,
  className,
  inputClassName,
  step = 2,
}: TimeSpanInputProps) => {
  if (!value) value = 0;
  const [time, setTime] = useState(value);
  const [inputValue, setInputValue] = useState(formatTimeSpan(value));
  const [pickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef: any = useRef(null);
  const dropdownRef: any = useRef(null);

  const timeS = useMemo(() => splitTime(time), [time]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target)
        && !pickerRef.current?.contains(event.target)) {
        setPickerVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setTime(value);
    setInputValue(formatTimeSpan(value));
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

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputValue.trim() === "") {
      return;
    }
    const parsed = parseInput(inputValue);
    if (parsed) {
      const v = toSeconds(parsed);
      setInputValue(formatTimeSpan(v));
      onChange?.(v);
    }
  };

  const handleArrowKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const cursorPos = e.currentTarget.selectionStart || 0;
    const field = cursorPos < 3 ? "minutes" : "seconds";

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const s = e.key === "ArrowUp" ? 1 : -1;
      const isSeconds = field === "seconds";
      const newValue = {
        ...timeS,
        [field]: timeS[field as "minutes" | "seconds"] + s * (isSeconds ? step : 1),
      };
      let v = toSeconds(newValue);
      if (v < 0) v = 0;
      setInputValue(formatTimeSpan(v));
      setTime(v);
      onChange?.(v);

      e.preventDefault();
      setTimeout(() => {
        inputRef.current?.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    }
  };

  const handlePickerChange = (field: "minutes" | "seconds") => (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = { ...timeS, [field]: parseInt(e.target.value, 10) };
    const v = toSeconds(newValue);
    setInputValue(formatTimeSpan(v));
    setTime(v);
    onChange?.(v);
  };

  return (
    <div className={clsx(b(), className)}>
      <div className={b("input-container")}>
        <input
          ref={inputRef}
          className={clsx(b("input"), inputClassName)}
          value={inputValue}
          onChange={handleTextInputChange}
          onBlur={handleBlur}
          onKeyDown={handleArrowKey}
          placeholder="mm:ss"
          aria-label="Time in mm:ss format"
          id={id}
          name={name}
          readOnly={readOnly}
        />
        {!readOnly && <button
          ref={pickerRef}
          type="button"
          className={b("toggle-button")}
          onClick={() => setPickerVisible((prev) => !prev)}
          aria-label="Toggle picker"
        >
          &#128339;
        </button>}
      </div>
      {error && <div className={b("error")}>{error}</div>}
      {pickerVisible && (
        <div className={b("picker")} ref={dropdownRef}>
          <select
            className={b("select")}
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
            className={b("select")}
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
