declare module "react-date-range" {
  import type { ComponentType } from "react";

  export interface RangeSelection {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface DateRangeChangeItem {
    selection: RangeSelection;
  }

  export interface DateRangeProps {
    editableDateInputs?: boolean;
    onChange?: (item: DateRangeChangeItem) => void;
    moveRangeOnFirstSelection?: boolean;
    ranges: RangeSelection[];
    showMonthAndYearPickers?: boolean;
  }

  export const DateRange: ComponentType<DateRangeProps>;
}
