"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"

const MultiCombobox = React.forwardRef<
  HTMLButtonElement,
  {
    options: { value: string; label: string }[]
    value?: string[]
    onChange: (value: string[]) => void
    onInputChange?: (value: string) => void
    onCreateOption?: (inputValue: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    creatable?: boolean
  }
>(
  (
    { options, value = [], onChange, onInputChange, onCreateOption, placeholder = "Select...", disabled = false, className, creatable = false },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
      if (!open) {
        setInputValue("")
      }
    }, [open])

    const handleSelect = (selectedValue: string) => {
      if (value.includes(selectedValue)) {
        onChange(value.filter(v => v !== selectedValue))
      } else {
        onChange([...value, selectedValue])
      }
    }

    const handleRemove = (removedValue: string) => {
      onChange(value.filter(v => v !== removedValue))
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-auto", className)}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length > 0 ? (
                value.map((val) => {
                  const option = options.find(opt => opt.value === val)
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {option?.label || val}
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(val)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.stopPropagation()
                            handleRemove(val)
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." onValueChange={(value) => { setInputValue(value); onInputChange?.(value); }} />
            <CommandList>
              {creatable && inputValue.trim() && !options.some(opt => opt.value.toLowerCase() === inputValue.toLowerCase()) && (
                <CommandItem
                  value={inputValue}
                  onSelect={() => {
                    onCreateOption?.(inputValue.trim())
                    onChange([...value, inputValue.trim()])
                    setInputValue("")
                    setOpen(false)
                  }}
                >
                  {`Create "${inputValue}"`}
                </CommandItem>
              )}
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label || option.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiCombobox.displayName = "MultiCombobox"

export { MultiCombobox }