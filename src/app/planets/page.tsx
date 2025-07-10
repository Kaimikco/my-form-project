'use client'

import { Form } from "../components/forms/Form";
import { futureOnly } from "../components/forms/helpers/validation";
import { FieldTypes } from "../components/forms/types/fields";
import { FormConfig } from "../components/forms/types/form";

const defaultValues = {
  shortCode: "ABC",
  dateTime: "2025-12-17T17:35",
  price: "300"
}

const formConfig: FormConfig = {
  fields: [
    {
      renderer: FieldTypes.Input,
      name: "pipelineShortCode",
      label: "Pipeline short code",
      type: "text",
      defaultValue: defaultValues.shortCode,
      validation: {
        required: "Short code is required",
        minLength: {
          value: 1,
          message: "Minimum length is 1"
        },
        maxLength: {
          value: 3,
          message: "Short code should have a maximum of 3 characters"
        }
      }
    },
    {
      renderer: FieldTypes.DateTime,
      name: "pipelineStartTime",
      label: "Pipeline start time",
      validation: {
        required: "Pipeline start time is required",
        validate: {
          futureOnly: futureOnly({ 
            message: "Pipeline start date must be in the future"
          })
        }
      }
    },
    {
      renderer: FieldTypes.Input,
      name: "price",
      label: "Price",
      type: "text",
      defaultValue: defaultValues.price,
      transform: {
        display: (value) => value ? `$${value}` : '',
        storage: (value) => parseFloat(value.replace('$', '')) || null
      },
      validation: {
        required: "Price is required"
      }
    },
    {
      renderer: FieldTypes.Input,
      name: "conditionalField",
      label: "Conditional Field",
      type: "text",
      defaultValue: defaultValues.shortCode,
      conditions: {
        rules: [
          { field: "pipelineShortCode", type: 'not', value: "ABC" },
          { field: "pipelineStartTime", type: 'hasValue', value: true }
        ],
        logic: "OR"
      },
      validation: {
        validate: (value: any, formValues: Record<string, string>) => {
          console.log(value, formValues);
          const compareValue = formValues["pipelineShortCode"];

          if (value !== compareValue) {
            return "Values Pipeline short code and Conditional Field must match!"
          } else {
            return true;
          }

        }
      }
    },    
  ]
};

export default function Page() {
  const onSubmit = (data: any) => {
    console.log("✅ Form submission received:", data);
    alert(`Form submitted successfully with data: ${JSON.stringify(data)}`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Config-Based Form</h2>
          <Form
            config={formConfig}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  )
}