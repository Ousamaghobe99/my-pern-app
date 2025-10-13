import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useState } from "react";

function ModernDatePicker({ value, onChange, disabledDates }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <style>{`
          .rdp {
            --rdp-accent-color: hsl(var(--primary));
            --rdp-accent-background-color: hsl(var(--primary));
            margin: 0;
          }
          .rdp-months {
            display: flex;
          }
          .rdp-month {
            margin: 0;
          }
          .rdp-month_caption {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            position: relative;
          }
          .rdp-nav {
            display: flex;
            align-items: center;
          }
          .rdp-button_previous,
          .rdp-button_next {
            position: absolute;
            width: 28px;
            height: 28px;
            padding: 0;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0.5;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .rdp-button_previous:hover,
          .rdp-button_next:hover {
            opacity: 1;
          }
          .rdp-button_previous {
            left: 4px;
          }
          .rdp-button_next {
            right: 4px;
          }
          .rdp-month_grid {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          .rdp-weekday {
            width: 36px;
            height: 36px;
            text-align: center;
            font-size: 0.8rem;
            color: hsl(var(--muted-foreground));
          }
          .rdp-week {
            display: flex;
            margin-top: 4px;
          }
          .rdp-day {
            width: 36px;
            height: 36px;
            padding: 0;
            text-align: center;
          }
          .rdp-day_button {
            width: 36px;
            height: 36px;
            padding: 0;
            border: none;
            background: transparent;
            cursor: pointer;
            border-radius: 6px;
            font-size: 0.875rem;
          }
          .rdp-day_button:hover:not(.rdp-disabled) {
            background-color: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
          }
          .rdp-selected .rdp-day_button {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
          }
          .rdp-today:not(.rdp-selected) .rdp-day_button {
            background-color: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
          }
          .rdp-outside {
            opacity: 0.5;
          }
          .rdp-disabled .rdp-day_button {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (!date) return;
            const d = new Date(date);
            d.setHours(23, 59, 59, 999);
            onChange(d.toISOString());
            setOpen(false);
          }}
          disabled={disabledDates}
          showOutsideDays
          components={{
            Chevron: ({ orientation }) => {
              if (orientation === "left") {
                return <ChevronLeft className="h-4 w-4" />;
              }
              return <ChevronRight className="h-4 w-4" />;
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default ModernDatePicker;