import { useEffect } from '@wordpress/element';

/**
 * Get icon type from attribute value
 */
export const getIconType = (value) => {
    if (value && value.includes('fa-')) {
        return 'fontawesome'
    }

    return 'dashicon'
}


/**
 * handle outside click
 * @param {*} ref 
 * @param {*} setVal 
 */
export const useOutsideAlerter = (ref, iconRef, setVal) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (iconRef.current && iconRef.current.contains(event.target)) {
                    setVal(true)
                }
                else {
                    setVal(false);
                }
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
}

/**
 * dashiconHandler
 * @param {string} icon 
 * @returns string
 */
export const dashiconHandler = (icon) => {
    if (!icon) {
        return ''
    }
    return icon.replace(/^dashicons-/, "");
}