import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useState } from "react";

export default function InlineDatePicker({ value, onChange, disabledDates }) {
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

      <PopoverContent className="w-auto p-0" align="start">
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <style>{`
            .rdp-root { --rdp-accent-color: hsl(var(--primary)); --rdp-accent-background-color: hsl(var(--primary)); margin: 0; padding: 12px; }
            .rdp-month_caption { display: flex; justify-content: center; align-items: center; height: 40px; position: relative; margin-bottom: 8px; }
            .rdp-caption_label { font-weight: 500; font-size: 0.875rem; }
            .rdp-nav { display: flex; align-items: center; gap: 4px; }
            .rdp-button_previous, .rdp-button_next { position: absolute; width: 28px; height: 28px; padding: 0; background: transparent; border: none; cursor: pointer; opacity: 0.5; display: inline-flex; align-items: center; justify-content: center; transition: opacity 0.2s; }
            .rdp-button_previous:hover, .rdp-button_next:hover { opacity: 1; }
            .rdp-button_previous { left: 4px; }
            .rdp-button_next { right: 4px; }
            .rdp-month_grid { width: 100%; border-collapse: collapse; }
            .rdp-weekdays { display: flex; }
            .rdp-weekday { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: hsl(var(--muted-foreground)); font-weight: normal; }
            .rdp-week { display: flex; margin-top: 4px; }
            .rdp-day { width: 36px; height: 36px; padding: 0; }
            .rdp-day_button { width: 36px; height: 36px; padding: 0; border: none; background: transparent; cursor: pointer; border-radius: 6px; font-size: 0.875rem; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; pointer-events: auto; }
            .rdp-day_button:hover:not([disabled]) { background-color: hsl(var(--accent)); color: hsl(var(--accent-foreground)); }
            .rdp-day.rdp-selected .rdp-day_button { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); font-weight: 500; }
            .rdp-day.rdp-today:not(.rdp-selected) .rdp-day_button { background-color: hsl(var(--accent)); color: hsl(var(--accent-foreground)); font-weight: 500; }
            .rdp-day.rdp-outside { opacity: 0.5; }
            .rdp-day_button[disabled] { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
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
                const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                return <Icon className="h-4 w-4" />;
              },
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
