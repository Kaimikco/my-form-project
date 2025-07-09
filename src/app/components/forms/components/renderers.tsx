import { 
    DateConfig, 
    DateTimeConfig, 
    FieldRendererFunction, 
    FieldRendererTypes, 
    FieldsetConfig, 
    InputConfig, 
    StripMeta 
} from "../types/form";
import { DateInput } from "./DateInput";
import { DatetimeInput } from "./DatetimeInput";
import { Fieldset } from "./Fieldset";
import { Input } from "./Input";

export const renderers: Record<FieldRendererTypes, FieldRendererFunction> = {
  [FieldRendererTypes.Input]: (props) => <Input {...(props as StripMeta<InputConfig>)} />,
  [FieldRendererTypes.Fieldset]: (props) => <Fieldset {...(props as StripMeta<FieldsetConfig>)} />,
  [FieldRendererTypes.Date]: (props) => <DateInput {...(props as StripMeta<DateConfig>)} />,
  [FieldRendererTypes.DateTime]: (props) => <DatetimeInput {...(props as StripMeta<DateTimeConfig>)} />
};
