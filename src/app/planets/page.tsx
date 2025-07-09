'use client'

import { z } from "zod/v4";
import { Form } from "../components/forms/Form";
import { FieldRendererTypes, FormConfig } from "../components/forms/types/form";
import { validators } from "../components/forms/helpers/validators";

const formConfig: FormConfig = {
  fields: [
    {
      renderer: FieldRendererTypes.Input,
      name: "pipelineShortcode",
      label: "Pipeline short code",
      type: "text",
      validator: z.string().min(1, "Short code is required").max(3, "Short code should have a maximum of 5 characters")
    },
    {
      renderer: FieldRendererTypes.DateTime,
      name: "pipelineStartTime",
      label: "Pipeline start time",
      validator: validators.futureOnly({
        message: "Pipeline start time must be in the future"
      })
    }
  ]
};

export default function Page() {
  const onSubmit = (data: any) => {
    console.log("✅ Form submission received:", data);
    alert(`Hello ${data.defaultValueTest}! Form submitted successfully.`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="">
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