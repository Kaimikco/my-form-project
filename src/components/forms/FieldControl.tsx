import { useFormContext, Controller, ControllerRenderProps, UseFormRegisterReturn } from "react-hook-form";
import { ReactNode, useMemo } from "react";
import { FieldBase } from "./types/fields";
import { applyFieldTransforms } from "./helpers/form";

export type FieldControlProps = Pick<FieldBase, 'name' | 'validation' | 'transform'> & {
  children: (props: ControllerRenderProps | UseFormRegisterReturn) => ReactNode;
}

/**
 * Responsible for rendering a generic form control e.g InputField as Controlled / Uncontrolled
 */
export function FieldControl({ name, validation, transform, children }: FieldControlProps) {
  const { register, control } = useFormContext();
  
  // Determine if field should use a controller by checking a. if transform prop exists b. if any custom validate rules match the cross-field pattern.
  const needsController = useMemo(() => {
    if (transform) return true;
    
    if (validation?.validate) {

      if (typeof validation.validate === 'function') {
        return validation.validate.length > 1;
      }

      return Object.values(validation.validate).some(fn => fn.length > 1);
    }
    
    return false;
  }, [transform, validation]);

  if (needsController) {
    return (
      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => {
          // apply custom transforms
          const { value, onChange } = applyFieldTransforms(field, transform);
          
          return <>
            {children({
                name: field.name,
                value: value || '',
                onChange: onChange,
                onBlur: field.onBlur,
                ref: field.ref
            })}
          </>
        }}
      />
    );
  } else {
    return children(register(name, validation));
  }
}