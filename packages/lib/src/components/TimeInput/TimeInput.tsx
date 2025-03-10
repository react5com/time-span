import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './TimeInput.scss'
import clsx from 'clsx';
import { formatTimeForInput, parseFullTime } from "../../utils";
import { bem } from '../../utils/bem';

interface TimeInputProps {
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
  readOnly?: boolean;
  value?: number | string;
  onChange?: (v: number) => void;
}
const b = bem("time-input");
export const TimeInput = ({className, inputClassName, id, name, readOnly, value, onChange}: TimeInputProps) => {
  const [inputValue, setInputValue] = useState(formatTimeForInput(value));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    setInputValue(formatTimeForInput(value));
  }, [value]);

  const validateAndFormat = (s: string): string | null => {
    const parsed = parseFullTime(s);
    if (!parsed) return "Invalid date format.";
    return null;
  }
  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const error = validateAndFormat(v);
    setError(error);
    if (!error) {
      const parsed = parseFullTime(v);
      if (parsed) {
        setInputValue(v);
        onChange?.(parsed);
      }
    }
  };

  const handleToggleClick = () => {
    const timeInput = inputRef.current;
    if (timeInput && !isPickerVisible) {
      if (typeof timeInput.showPicker === "function") {
        timeInput.showPicker();
      } else {
        timeInput.focus();
      }
    }
    setPickerVisible(!isPickerVisible);
  }
  return (
    <div className={clsx(b(), className)}>
      <div className={b("input-container")}>
        <input
          className={clsx(b("input"), inputClassName)}
          value={inputValue}
          onChange={handleTextInputChange}
          placeholder="hh:mm:ss"
          aria-label="Time in hh:mm:ss format"
          id={id}
          name={name}
          type='time'
          readOnly={readOnly}
          ref={inputRef}
        />
        {!readOnly && <button
          type="button"
          className={b("toggle-button")}
          onClick={handleToggleClick}
          aria-label="Toggle picker"
        >
          &#128339;
        </button>}
      </div>
    </div>
  )
}
export default TimeInput