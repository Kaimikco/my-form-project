import { Fields, TransformConfig } from "../types/fields";

export function extractDefaults(config: Fields[]) {
  const obj: Record<string, unknown> = {};
  config.forEach((field) => {
    if (field.defaultValue !== undefined) {
      obj[field.name] = field.defaultValue;
    }

    // recurse for grouped fields
    if ("fields" in field) Object.assign(obj, extractDefaults(field.fields));
  });
  return obj;
}

export function applyFieldTransforms(field: any, transform?: TransformConfig) {
  if (!transform) {
    return {
      value: field.value || '',
      onChange: field.onChange
    };
  }

  const displayValue = transform.display ? transform.display(field.value) : field.value;
  
  const handleChange = (e: any) => {
    const value = e.target ? e.target.value : e;
    const transformedValue = transform.storage ? transform.storage(value) : value;
    field.onChange(transformedValue);
  };

  return {
    value: displayValue || '',
    onChange: handleChange
  };
}