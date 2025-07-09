import {
    FieldRendererTypes, 
    FieldTypes, 
    FormConfig, 
} from "../types/form";
import { z } from "zod/v4";

export const generateSchema = (config: FormConfig) => {
  const { fields, crossFieldValidations } = config;
  const shape: Record<string, z.ZodType<any>> = {};

  const processFields = (fields: FieldTypes[]) => {
    fields.forEach((field) => {
      if (field.renderer === FieldRendererTypes.Fieldset) {
        if (field.validator) {
          shape[field.name] = field.validator;
        } else {
          processFields(field.fields);
        }
      } else if (field.validator) {
        shape[field.name] = field.validator;
      }
    });
  };

  processFields(fields);

  const baseSchema = z.object(shape);

  if (!crossFieldValidations || crossFieldValidations.length === 0) {
    return baseSchema;
  }

  // use super refine to add schema level validation
  return baseSchema.superRefine((data, ctx) => {
    crossFieldValidations!.forEach((validation) => {
      if (!validation.validate(data)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validation.message,
          path: validation.errorPath
        });
      }
    });
  });
};

export function extractDefaults(config: FieldTypes[]) {
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