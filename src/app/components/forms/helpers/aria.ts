
interface AriaInputProps {
  name: string;
  hasError: boolean;
  required: boolean;
}

export const ariaInputProps = ({
  name,
  hasError,
  required
}: AriaInputProps) => ({
  ...(hasError && { 'aria-errormessage': `${name}-error` }),
  ...(required && { 'aria-required': true })
});