import { Input } from "./Input";
import { InputProps } from "./Input";

export interface DatetimeInputProps extends Omit<InputProps, 'type'> {}

export function DatetimeInput(props: DatetimeInputProps) {
    return(
        <Input type="datetime-local" {...props}/>
    )
}