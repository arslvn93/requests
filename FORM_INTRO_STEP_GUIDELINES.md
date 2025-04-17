# Form Introduction Step Guidelines

This document outlines the standard structure, styling, and functionality for the introduction step components used in various forms (e.g., Listing Ad, Giveaway, Video Edit Request). Adhering to these guidelines ensures consistency across the application.

## Core Structure & Order

The intro step component should follow this general JSX structure:

```jsx
import React, { useEffect } from 'react';
import { /* Relevant Icons */, ArrowRight, CornerDownLeft, CheckCircle, AlertTriangle } from 'lucide-react';

interface IntroStepProps {
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const FormIntroStep: React.FC<IntroStepProps> = ({ onNext, onValidationChange }) => {

  // --- Functionality ---
  const handleStart = () => { onNext(); };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') { onNext(); }
  };

  useEffect(() => {
    // Set validation to true (intro steps are always valid)
    onValidationChange(true);

    // Focus the container for keyboard navigation
    const container = document.getElementById('intro-step-container'); // Use a unique ID per form
    if (container) {
      container.focus();
    }
  }, [onValidationChange]);

  // --- JSX Structure ---
  return (
    <div
      id="intro-step-container" // Unique ID per form (e.g., 'listing-intro-step-container')
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 pb-8 pt-16 focus:outline-none animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make focusable
    >
      {/* 1. Icon */}
      <div className="flex justify-center mb-8">
        {/* Replace with appropriate Lucide icon */}
        <YourFormIcon className="w-16 h-16 text-blue-400" />
      </div>

      {/* 2. Main Heading */}
      <div className="space-y-2 mb-8"> {/* Container for heading elements */}
        <h1 className="text-4xl font-bold text-white/90 leading-tight">
          Main Form Title <br />
          <span className="inline-block bg-blue-600/40 text-blue-100 px-4 py-1 rounded-lg mt-2 shadow-md">Catchy Subtitle!</span>
        </h1>
      </div>

      {/* 3. Optimal Results Alert */}
      <div className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-300/90 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 max-w-xl mx-auto">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm text-left">
          <strong>For Optimal Results:</strong> Please take a few minutes to complete this form with as much detail as possible.
        </p>
      </div>

      {/* 4. Description Paragraph */}
      <p className="text-base text-white/70 max-w-xl mx-auto mb-8">
        Brief description explaining the purpose of the form and why providing details is important.
      </p>

      {/* 5. Information Section(s) */}
      {/* Use grid for 2 columns if needed, otherwise stack vertically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 text-left">
        {/* Example Info Box 1 (e.g., What to Expect) */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white/90 mb-3">Section Title 1:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /><span>Detail point 1.</span></li>
            {/* ... more points */}
          </ul>
        </div>

        {/* Example Info Box 2 (e.g., Important Notes) */}
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
           <h3 className="text-lg font-semibold text-white/90 mb-3">Section Title 2:</h3>
           <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" /><span>Important note 1.</span></li>
              {/* ... more points */}
           </ul>
        </div>
      </div>
      {/* OR for single info box: */}
      {/*
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 max-w-xl mx-auto mb-8 text-left">
         <h3 className="text-lg font-semibold text-white/90 mb-3">Section Title:</h3>
         <ul className="space-y-2 text-sm text-white/70"> ... </ul>
      </div>
      */}


      {/* 6. Start Button */}
      <button
        onClick={handleStart}
        className="bg-blue-500/90 hover:bg-blue-500 text-white font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 group"
      >
        Start {/* Or "Start Request", etc. */}
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* 7. Enter Key Hint */}
      <div className="text-xs text-white/50 mt-3 flex items-center gap-2">
        <span>press Enter</span>
        <CornerDownLeft className="w-3 h-3" />
        {/* Optional: Add estimated time */}
        {/* <span className="mx-1">|</span> */}
        {/* <span>Takes X+ minutes</span> */}
      </div>
    </div>
  );
};

export default FormIntroStep;
```

## Key Styling Classes

-   **Main Container (`div#intro-step-container`):**
    -   `flex flex-col items-center justify-center`: Centers content vertically and horizontally.
    -   `min-h-[calc(100vh-10rem)]`: Ensures minimum height, pushing content down from the top (adjust `10rem` if header/nav height changes).
    -   `text-center`: Centers text by default.
    -   `px-4 pb-8 pt-16`: Provides standard padding (especially `pt-16` for top spacing).
    -   `focus:outline-none`: Removes default focus ring.
    -   `animate-fade-in`: (Optional but recommended) Adds a subtle fade-in effect.
-   **Heading (`h1`):** `text-4xl font-bold text-white/90 leading-tight`. Use `span` with `inline-block bg-blue-600/40 text-blue-100 px-4 py-1 rounded-lg mt-2 shadow-md` for the subtitle effect.
-   **Optimal Results Alert (`div`):** `bg-yellow-900/30 border border-yellow-600/50 text-yellow-300/90 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 max-w-xl mx-auto`. Uses `AlertTriangle` icon.
-   **Description (`p`):** `text-base text-white/70 max-w-xl mx-auto mb-8`.
-   **Info Boxes (`div`):** `bg-gray-800/50 p-4 rounded-lg border border-gray-700/50`. Use `grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8 text-left` for the two-column layout. Use `CheckCircle` (green) or `AlertTriangle` (yellow) for list item icons.
-   **Start Button (`button`):** `bg-blue-500/90 hover:bg-blue-500 text-white font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 group`. Includes `ArrowRight` icon with hover effect.
-   **Enter Hint (`div`):** `text-xs text-white/50 mt-3 flex items-center gap-2`. Includes `CornerDownLeft` icon.

## Required Functionality

-   **Props:** Must accept `onNext: () => void` and `onValidationChange: (isValid: boolean) => void`.
-   **Validation:** Call `onValidationChange(true)` within a `useEffect` hook, as the intro step is always valid to proceed from.
-   **Focus Management:** Within the `useEffect`, get the main container `div` by its unique ID and call `.focus()` on it. Ensure the `div` has `tabIndex={-1}`.
-   **Enter Key Handling:** Add an `onKeyDown` handler to the main container `div` that calls `onNext()` if `event.key === 'Enter'`.
-   **Start Button:** The main button should call `onNext()` via its `onClick` handler.

By following these guidelines, new form introduction steps will maintain a consistent look, feel, and behavior.