import { tv } from "tailwind-variants";
import { FieldBase, FieldTypes } from "../types/form";
import { FieldRenderer } from "../FieldRenderer";

export type FieldsetProps = FieldBase & {
	fields: FieldTypes[];
}

const groupedInputStyles = tv({
	base: "border-2 pr-4 pb-4 pl-4 rounded-md",
	slots: {
		legend: "p-2 block text-sm font-medium text-gray-700",
	}
})

const { legend, base } = groupedInputStyles()

export function Fieldset({
  fields,
  label
}: FieldsetProps) {

  return (
    <fieldset className={base()}>
      <legend className={legend()}>{label}</legend>
      <div>
        {fields.map((field) => <FieldRenderer key={field.name} {...field} />)}
      </div>
    </fieldset>
  );
}