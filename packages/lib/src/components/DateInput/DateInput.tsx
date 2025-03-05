import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './DateInput.scss'
import clsx from 'clsx';
import { formatDateForInput, parseDate } from "../../utils";
import { bem } from '../../utils/bem';

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
  const [isPickerVisible, setPickerVisible] = useState(false);

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

  const handleToggleClick = () => {
    const dateInput = inputRef.current;
    if (dateInput && !isPickerVisible) {
      if (typeof dateInput.showPicker === "function") {
        dateInput.showPicker();
      } else {
        dateInput.focus();
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