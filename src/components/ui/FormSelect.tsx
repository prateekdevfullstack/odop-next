"use client";

import * as React from "react";
import { Select } from "radix-ui";

export type FormSelectOption = { value: string; label: string };

type FormSelectProps = {
  id?: string;
  name: string;
  options: FormSelectOption[];
  placeholder: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
  triggerId?: string;
};

export default function FormSelect({
  id,
  name,
  options,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  hasError,
  triggerId,
}: FormSelectProps) {
  return (
    <Select.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <Select.Trigger
        id={triggerId ?? id}
        className={`form-input form-select-trigger${hasError ? " has-error" : ""}`}
        aria-label={placeholder}
      >
        <span className="form-select-value">
          <Select.Value placeholder={placeholder} />
        </span>
        <Select.Icon className="form-select-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 4.5L6 8.5l4-4"
              stroke="#718096"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="form-select-content"
        >
          <Select.ScrollUpButton className="form-select-scroll">▲</Select.ScrollUpButton>
          <Select.Viewport className="form-select-viewport">
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value} className="form-select-item">
                <Select.ItemText>{o.label}</Select.ItemText>
                <Select.ItemIndicator className="form-select-item-indicator">✓</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="form-select-scroll">▼</Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
