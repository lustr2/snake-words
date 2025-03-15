import React, { forwardRef, useState } from "react";
import { keyboardLayout } from '../../data/Data';

interface OneLetterProps {
    value: string;
    status?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    onSpecKey?: (key: string) => void;
    ref: React.RefObject<HTMLInputElement>;
}

const OneLetter = forwardRef<HTMLInputElement, OneLetterProps>(( { value, status, onChange, onClick, onSpecKey }, ref ) => {
    const [chValue, setChValue] = useState<string>(value);


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//       console.log('Oneletter - handleChangeInput: ' + e.target.value); 
       e.target.value = e.target.value.toUpperCase();
       e.preventDefault();
       if (keyboardLayout.some((row) => row.includes(e.target.value))) {
//         console.log('OneLetter - stisten povoleny znak');
       } else {
        if (e.target.value === 'Delete') {
            console.log("Oneletter - stisten " + e.target.value);
            e.preventDefault();
        }
        console.log('OneLetter - zde return ' + e.target.value );
        return;
       }
       setChValue(value);
       if (onChange ) {
        onChange(e);
       }
    }

    const handleClick = () => {
//       console.log('Oneletter - zmena fokusu na:' + ref); 
       if (onClick) {
        onClick();
       }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
//        console.log("Oneletter - Stisten: " + e.key);
        if (e.key === 'Tab') {
            console.log("Oneletter - Volame onSpecKey " + e.key);
            e.preventDefault();
            if (onSpecKey) {
                onSpecKey('Tab');  
            }
        }
        if (e.key === 'delete') {
            console.log("Oneletter - Volame onSpecKey " + e.key);
            e.preventDefault();
            if (onSpecKey) {
                onSpecKey('Delete');  
            }
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {  
            console.log("Oneletter - Stisknuto " + e.key);
            e.preventDefault();
            setChValue('');  // Vymaže aktuální hodnotu inputu
            if (onChange) {
                const newEvent = new Event('input', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>;
                Object.defineProperty(newEvent, 'target', {
                    writable: true,
                    value: { ...HTMLInputElement, value: '' }
                });
                onChange(newEvent);
            }
        }
    }

    return (
        <>
            <input
                className={status === undefined ? "input-field" : `input-field-${status}`}  
                type='text' 
                maxLength={1} 
                value={(value !== chValue) ? value: chValue}
                onChange={handleChangeInput}
                ref={ref}
                onClick={handleClick}
                onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent)}
                title="Enter a single letter"
            /> 
        </>
    );
});

export default OneLetter;
