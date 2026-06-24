import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InputProps } from "../types";
import { useCallback, useMemo, useState } from "react";

function SelectedBadges({
  values,
  options,
  onToggle,
}: {
  values: string[];
  options: { value: string; label: string }[];
  onToggle: (val: string) => void;
}) {
  if (values.length === 0) {
    return <span className="text-muted-foreground">Select...</span>;
  }

  return (
    <>
      {values.map((val: string) => {
        const option = options.find(
          (opt: { value: string; label: string }) => opt.value === val,
        );
        return (
          <Badge key={val} variant="outline" className="text-xs">
            {option?.label || val}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(val);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}
    </>
  );
}

export function MultiSelectInput({
  field,
  config,
  handlers,
  invalid,
}: InputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const value = useMemo(() => field.value ?? [], [field.value]);
  const { options = [] } = config;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setSearch("");
    setOpen(newOpen);
  };

  // Фильтрация опций по поиску
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [options, search]);

  // Переключение выбранного значения
  const toggleValue = useCallback(
    (selected: string) => {
      const newValue = value.includes(selected)
        ? value.filter((v: string) => v !== selected)
        : [...value, selected];
      field.onChange(newValue);
    },
    [value, field],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          aria-expanded={open}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-between min-h-2 h-auto py-1.5 font-normal",
            invalid && "border-destructive ring-destructive",
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            <SelectedBadges
              values={value}
              options={options}
              onToggle={toggleValue}
            />
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            onValueChange={(val) => {
              setSearch(val);
              handlers?.onInputChange?.(val);
            }}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => toggleValue(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
