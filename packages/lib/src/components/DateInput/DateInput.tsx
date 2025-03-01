import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import './DateInput.scss'
import clsx from 'clsx';
import { bem, formatDateForInput, parseDate } from "../../utils";

interface DateInputProps {
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
  readOnly?: boolean;
  value?: Date;
  onChange?: (v: Date) => void;
}
const b = bem("date-input");
export const DateInput = ({className, inputClassName, id, name, readOnly, value, onChange}: DateInputProps) => {
  const [inputValue, setInputValue] = useState(formatDateForInput(value));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(formatDateForInput(value));
  }, [value]);


  const validateAndFormat = (s: string): string | null => {
    const parsed = parseDate(s);
    if (!parsed) return "Invalid date format.";
    return null;
  }
  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const error = validateAndFormat(v);
    setError(error);

    if (!error) {
      const parsed = parseDate(v);
      if (parsed) {
        setInputValue(v);
        onChange?.(parsed);
      }
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputValue.trim() === "") {
      return;
    }
    const parsed = parseDate(inputValue);
    if (parsed) {
      // setInputValue(
      //   formatDate(parsed)
      // );
      //onChange?.(parsed);
    }
  };

  const handleToggleClick = () => {
    const dateInput = inputRef.current;
    if (dateInput) {
      if (typeof dateInput.showPicker === "function") {
        dateInput.showPicker();
      } else {
        // Fallback: focus the input (may not open the picker)
        dateInput.focus();
      }
    }
  }
  const handleArrowKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const cursorPos = e.currentTarget.selectionStart || 0;

    // if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    //   const s = e.key === "ArrowUp" ? 1 : -1;
    //   const newValue = {
    //     ...timeS,
    //     [field]: Math.max(0, timeS[field as "minutes" | "seconds"] + s),
    //   };
    //   setDate(toSeconds(newValue));
    //   setInputValue(
    //     `${String(newValue.minutes).padStart(2, "0")}:${String(newValue.seconds).padStart(2, "0")}`
    //   );
    //   onChange?.(toSeconds(newValue));

    //   e.preventDefault();
    //   setTimeout(() => {
    //     inputRef.current?.setSelectionRange(cursorPos, cursorPos);
    //   }, 0);
    // }
  };
  
  return (
    <div className={clsx(b(), className)}>
      <div className={b("input-container")}>
        <input
          className={clsx(b("input"), inputClassName)}
          value={inputValue}
          onChange={handleTextInputChange}
          onBlur={handleBlur}
          onKeyDown={handleArrowKey}
          placeholder="mm:ss"
          aria-label="Date in YY/mm/dd format"
          id={id}
          name={name}
          type='date'
          readOnly={readOnly}
          ref={inputRef}
        />
        {!readOnly && <button
          type="button"
          className={b("toggle-button")}
          onClick={handleToggleClick}
          aria-label="Toggle picker"
        >
          &#x1f4c5;
        </button>}
      </div>
    </div>
  )
}
export default DateInput