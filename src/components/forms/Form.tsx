"use client";

import { useForm, FormProvider } from "react-hook-form";
import { SubmitButton } from "./components/SubmitButton";
import { 
  FormConfig,
} from "./types/form";
import { extractDefaults } from "./helpers/form";
import { FieldRenderer } from "./FieldRenderer";
import { useEffect, useMemo, useState } from "react";

export interface FormProps {
  config: FormConfig;
	onSubmit: (data: any) => void;
  className?: string;
}

export function Form({
  config,
  onSubmit,
  className = "",
}: FormProps) {

  const defaultValues = useMemo(() => extractDefaults(config.fields), [config]);

  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues
  });

  const [allValues, setAllValues] = useState({});

  useEffect(() => {
    const allValues = form.watch();
    setAllValues(allValues);
  }, [config])

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={className}
      >
        {config.fields.map((field) => <FieldRenderer key={field.name} {...field} />)}
        <SubmitButton className="w-full">Submit Form</SubmitButton>
      </form>
      {/* Debug section to show the config */}
      <div>
        <h3 className="text-lg font-bold mb-4">Form Config</h3>
        <pre className="text-xs bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(allValues, null, 2)}
        </pre>
      </div>
    </FormProvider>
  );
}