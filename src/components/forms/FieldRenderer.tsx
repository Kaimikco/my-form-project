import { useFormContext } from "react-hook-form";
import { evaluateConditions, FieldConditions } from "./helpers/conditions";
import { tv } from "tailwind-variants";
import { renderers } from "./components/renderers";
import { Fields } from "./types/fields";
import { useMemo } from "react";

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
export function FieldRenderer(field: Fields) {
  const { watch } = useFormContext();
  const renderer = renderers[field.renderer];

  if (!field.conditions) {
    return <div className={fieldRendererStyles()}>{renderer(field)}</div>;
  }

  const dependentFields: string[] = useMemo(
    () => field.conditions?.rules.map((condition) => condition.field) || [], 
    [field.conditions]
  );
  
  // Watch returns array of values when given array of field names
  const watchedValues = watch(dependentFields);
  
  // Convert back to object format for evaluateConditions
  const allValues = useMemo(() => {
    return dependentFields.reduce((acc, fieldName, index) => {
      acc[fieldName] = watchedValues[index];
      return acc;
    }, {} as Record<string, any>);
  }, [dependentFields, watchedValues]);

  const shouldRender = evaluateConditions(field.conditions, allValues);

  return <div className={fieldRendererStyles({ shouldRender, type: 'conditional' })}>{renderer(field)}</div>;
}

