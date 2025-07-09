import { Input, InputProps } from "./Input";

export interface DateInputProps extends Omit<InputProps, 'type'> {}

export function DateInput(props: DateInputProps) {
    return(
        <Input type="date" {...props}/>
    )
}