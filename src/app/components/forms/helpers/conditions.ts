import { get } from "react-hook-form";

// New conditional rendering interfaces
export interface ConditionalRule {
  field: string;
  equals?: any;
  oneOf?: any[];
  hasValue?: boolean;
  not?: any;
  custom?: (value: any) => boolean;
}

export interface FieldConditions {
  rules: ConditionalRule[];
  logic?: "AND" | "OR";
}

export const evaluateRule = (rule: ConditionalRule, allValues: Record<string, any>): boolean => {

  const value = get(allValues, rule.field);
  
  if (rule.custom) {
    return rule.custom(value);
  }

  if (rule.equals !== undefined) return value === rule.equals;
  if (rule.oneOf) return rule.oneOf.includes(value);
  if (rule.hasValue !== undefined) return rule.hasValue ? !!value : !value;
  if (rule.not !== undefined) return value !== rule.not;
  
  return false;
};

export const evaluateConditions = (conditions: FieldConditions, allValues: Record<string, any>): boolean => {
  const { rules, logic = "AND" } = conditions;
  
  if (logic === "OR") {
    return rules.some(rule => evaluateRule(rule, allValues));
  } else {
    return rules.every(rule => evaluateRule(rule, allValues));
  }
};