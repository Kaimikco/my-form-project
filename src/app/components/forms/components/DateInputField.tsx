import { InputField, InputFieldProps } from "./InputField";

export interface DateInputFieldProps extends Omit<InputFieldProps, 'type'> {}

export function DateInputField(props: DateInputFieldProps) {
    return(
        <InputField type="date" {...props}/>
    )
}