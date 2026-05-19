import { useEffect } from '@wordpress/element';
import type { Dispatch, RefObject, SetStateAction } from 'react';

export type IconType = 'dashicon' | 'fontawesome';

const FONT_AWESOME_PREFIXES = ['fa ', 'fab ', 'fas ', 'far ', 'fal ', 'fad ', 'fat '];

export const getIconType = (value: string): IconType => {
    if (typeof value !== 'string') {
        return 'dashicon';
    }
    if (FONT_AWESOME_PREFIXES.some((prefix) => value.startsWith(prefix))) {
        return 'fontawesome';
    }
    return 'dashicon';
};

export const useOutsideAlerter = (
    ref: RefObject<HTMLElement>,
    iconRef: RefObject<HTMLElement>,
    setVal: Dispatch<SetStateAction<boolean>>
): void => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (ref.current && target && !ref.current.contains(target)) {
                if (iconRef.current && iconRef.current.contains(target)) {
                    setVal(true);
                } else {
                    setVal(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, iconRef, setVal]);
};

export const dashiconHandler = (icon: string): string => {
    if (!icon) {
        return '';
    }
    return icon.replace(/^dashicons-/, '');
};
