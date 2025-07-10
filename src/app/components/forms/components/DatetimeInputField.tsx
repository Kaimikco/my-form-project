import { InputField } from "./InputField";
import { InputFieldProps } from "./InputField";

export interface DatetimeInputFieldProps extends Omit<InputFieldProps, 'type'> {}

export function DatetimeInputField(props: DatetimeInputFieldProps) {
    return(
        <InputField type="datetime-local" {...props}/>
    )
}