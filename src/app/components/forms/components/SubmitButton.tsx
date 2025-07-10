import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

// Simple Submit Button
interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
}

export function SubmitButton({ children, className = "" }: SubmitButtonProps) {
  const { formState: { isSubmitting } } = useFormContext();

  return (
    <div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${className}
        `.trim()}
      >
        {isSubmitting ? "Submitting..." : children}
      </button>
    </div>
  );
}