# Listing Form Step Component Guidelines (Detailed)

This document outlines the structure, styling, and best practices for creating or modifying step components within the listing form. Adhering to these guidelines ensures visual consistency, maintainability, and a predictable user experience.

## I. Component Structure (React/TSX)

1.  **Root Element:**
    *   Top-level element: `div` with `className="space-y-6"`.

2.  **Header:**
    *   Use a parent `div` with `className="flex items-center gap-3"`.
    *   Inside this div, place the step icon (`lucide-react` component, `className="w-8 h-8 text-blue-400"`).
    *   Next to the icon, place another `div` containing:
        *   The `h2` title (`className="text-2xl font-bold text-white/90"`).
        *   The `p` subtitle (`className="text-white/60"`).

3.  **Form Element:**
    *   Wrap all interactive content (questions, inputs, buttons) within `<form onSubmit={handleSubmit} className="space-y-6">`.
    *   Implement `handleSubmit` (see Section III).

4.  **Question Blocks:**
    *   Group each distinct question (label + input/options) within a `div` using `className="space-y-3"`. This provides consistent vertical spacing.

## II. Styling and Elements - Input Types

1.  **Question Labels:**
    *   Always use `<p className="text-white/90">`.
    *   Place it *inside* the question block `div` (`space-y-3`).
    *   Do *not* add margin classes (e.g., `mb-3`) directly to the label.
    *   Provide explicit labels; don't rely solely on placeholders.

2.  **Standard Text Inputs (`input type="text/email/tel/url/date/number"`):**
    *   **Wrapper:** `div` with `className="glass-card flex items-center gap-3 p-4 transition-all duration-200 ${focusedField === 'fieldName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}"`.
    *   **Icon:** Include relevant `lucide-react` icon (`className="w-6 h-6 text-blue-400"`).
    *   **Input:** `input` with `className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"`. Include `type`, `value`, `onChange`, `onFocus`, `onBlur`, `placeholder`.

3.  **Textareas (`textarea`):**
    *   **Wrapper:** `div` with `className="glass-card flex items-start gap-3 p-4 transition-all duration-200 ${focusedField === 'fieldName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}"`. (Note: `items-start`)
    *   **Icon:** Include relevant `lucide-react` icon (`className="w-6 h-6 text-blue-400 mt-1"`). (Note: `mt-1` for alignment)
    *   **Textarea:** `textarea` with `className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"`. Include `value`, `onChange`, `onFocus`, `onBlur`, `placeholder`, `rows`.

4.  **Yes/No Buttons (Binary Choice):**
    *   **Container:** `div` with `className="flex gap-4"`.
    *   **Button:** `<button type="button">`.
    *   **Classes:** `flex-1 p-3 rounded-xl text-center transition-all duration-200`.
    *   **Selected State:** `${value.fieldName === 'yes' ? 'bg-blue-500 text-white' : 'glass-card text-white/90 hover:border-blue-400'}` (adjust value check as needed).

5.  **Icon Selection Buttons (Single Choice - e.g., Ad Objective, Emotion):**
    *   **Container:** `div` with `className="grid grid-cols-X sm:grid-cols-Y gap-4"` (adjust cols as needed).
    *   **Button:** `<button type="button">`.
    *   **Classes:** `glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200` (adjust padding/gap if needed).
    *   **Selected State:** `${value.fieldName === optionValue ? 'border-blue-400 bg-blue-400/10' : ''}`.
    *   **Content:** Icon (`w-8 h-8 text-blue-400`) and Label (`span className="text-white/90 font-medium text-center text-sm"`).

6.  **Icon/Text Selection Buttons (Multiple Choice - e.g., Amenities, Highlights):**
    *   **Container:** `div` with `className="grid grid-cols-X sm:grid-cols-Y gap-4"` (adjust cols).
    *   **Button:** `<button type="button">`.
    *   **Classes:** `glass-card p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 relative` (adjust padding/gap/layout). Add `relative` if using checkmark overlay.
    *   **Selected State:** `${value.fieldName.includes(optionValue) ? 'border-blue-400 bg-blue-400/10' : ''}`.
    *   **Content:** Icon (optional), Label (`span className="text-white/90 text-sm font-medium text-center"`).
    *   **Checkmark Overlay (Optional):** `{value.fieldName.includes(optionValue) && (<Check className="absolute top-2 right-2 w-5 h-5 text-blue-400" />)}`.

7.  **Selection with "Other" + Text Input (e.g., Amenities):**
    *   Implement using pattern #6 above for predefined options.
    *   Add an "Other" button styled similarly (e.g., using `Plus` icon).
    *   Conditionally render a standard text input (pattern #2) below the grid when the "Other" button is selected: `{showOtherInput && (<div className="glass-card...">...</div>)}`.
    *   Manage the `showOtherInput` state based on whether `'other'` is in the selected array. Clear the `otherAmenity` text field when "Other" is deselected.

8.  **Number Selection Buttons (Circular - e.g., Bed/Bath):**
    *   **Container:** `div` with `className="flex flex-wrap gap-3"`.
    *   **Button:** `<button type="button">`.
    *   **Classes:** `relative w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200`.
    *   **Selected State:** `${value.fieldName === optionValue ? 'bg-blue-500 text-white border-2 border-blue-400' : 'glass-card hover:border-blue-400'}`.
    *   **Content:** Icon (`w-4 h-4 mb-0.5 text-blue-400`) and Number (`span className="text-sm font-medium"`).

9.  **File Upload / Photo Grid (Specific to `PhotosMediaStep`):**
    *   Uses a hidden `input type="file"` triggered by a visible button.
    *   Displays previews using `URL.createObjectURL()`.
    *   Implements drag-and-drop reordering.
    *   Uses overlay buttons for actions (Remove, Set Featured). This complex pattern requires careful state management and specific styling; refer to `PhotosMediaStep.tsx` as the primary example.

10. **"Next" Button:**
    *   Use `<button type="submit">`.
    *   Apply exact classes: `w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed`.
    *   Always include `disabled={!isValid()}`.

## III. State and Logic

1.  **`focusedField` State:** Maintain `useState<string | null>(null)` for input focus styling.
2.  **`isValid` Function:** Implement step-specific validation. Return `true` or `false`.
    *   **Optional Steps:** For steps where input is not required (e.g., Property Upgrades, Neighborhood Info), the `isValid` function should simply `return true;`. The "Next" button will still have `disabled={!isValid()}` but will always be enabled.
3.  **`handleSubmit` Function:** Create `handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (isValid()) onNext(); };` and pass to `<form onSubmit={...}>`. *Correction:* Per Rule I.3, always use `<form>` and `type="submit"` for consistency, even for optional steps.

## IV. Best Practices

*   **Clarity:** Clear, concise labels and placeholders.
*   **Grouping:** Logical grouping within question blocks (`space-y-3`).
*   **Responsiveness:** Use `sm:`, `md:` prefixes for grids and layouts.
*   **Accessibility:** Consider ARIA attributes (e.g., `aria-label` for icon-only buttons).
*   **Code Comments:** Add comments explaining complex logic or non-obvious styling choices.