
import { 
  DateConfig, 
  DateTimeConfig, 
  FieldRendererFunction, 
  FieldTypes, 
  FieldsetConfig, 
  InputConfig, 
  StripMeta 
} from "../types/fields";
import { DateInputField } from "./DateInputField";
import { DatetimeInputField } from "./DatetimeInputField";
import { FieldsetField } from "./FieldsetField";
import { InputField } from "./InputField";

export const renderers: Record<FieldTypes, FieldRendererFunction> = {
  [FieldTypes.Input]: (props) => <InputField {...(props as StripMeta<InputConfig>)} />,
  [FieldTypes.Fieldset]: (props) => <FieldsetField {...(props as StripMeta<FieldsetConfig>)} />,
  [FieldTypes.Date]: (props) => <DateInputField {...(props as StripMeta<DateConfig>)} />,
  [FieldTypes.DateTime]: (props) => <DatetimeInputField {...(props as StripMeta<DateTimeConfig>)} />
};
