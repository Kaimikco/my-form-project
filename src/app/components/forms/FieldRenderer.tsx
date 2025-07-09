import { useFormContext } from "react-hook-form";
import { evaluateConditions } from "./helpers/conditions";
import { tv } from "tailwind-variants";
import { FieldTypes } from "./types/form";
import { renderers } from "./components/renderers";

const fieldRendererStyles = tv({
  base: "mb-4 last:mb-0",
  variants: {
    type: {
      conditional: "hidden",      
    },
    shouldRender: {
      true: "block"
    }
  }
})

/**
 * Manages the rendering of each form component and has responsibility for
 * conditional logic and other form meta systems.
 */
export function FieldRenderer(field: FieldTypes) {
  const { watch } = useFormContext();
  const renderer = renderers[field.renderer];

  console.log(field);

  if (!field.conditions) {
    return <div className={fieldRendererStyles()}>{renderer(field)}</div>;
  }

  const allValues = watch();
  const shouldRender = evaluateConditions(field.conditions, allValues);

  return <div className={fieldRendererStyles({ shouldRender, type: 'conditional' })}>{renderer(field)}</div>;
}