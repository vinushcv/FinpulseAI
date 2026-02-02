
import React, { useEffect, useRef } from 'react';

export const BubbleCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current) {
                // Using transform for better performance than top/left
                cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
            }
        };

        window.addEventListener('mousemove', moveCursor);
        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-8 h-8 border-2 border-blue-500 rounded-full pointer-events-none z-[9999] bg-blue-100/20 backdrop-blur-sm transition-transform duration-75 ease-out will-change-transform"
            style={{
                transform: 'translate3d(-100px, -100px, 0)', // Start off-screen
            }}
        />
    );
};
