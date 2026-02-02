
import React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(({ className, min, max, step, value, onValueChange, ...props }, ref) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onValueChange(parseFloat(e.target.value))}
            className={cn(
                "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Slider.displayName = "Slider";

export { Slider };
