import { get } from "react-hook-form";

// Define rule types as string literals first
type RuleType = 
  | "equals"
  | "not" 
  | "oneOf"
  | "hasValue"
  | "contains"
  | "containsAll"
  | "containsAny"
  | "arrayLength"
  | "arrayLengthMin"
  | "arrayLengthMax"
  | "isEmpty";

// Type-safe rule handler function
type ConditionalRuleHandler = (value: any, ruleValue: any) => boolean;

// TypeScript will enforce that all RuleType values are implemented
const ruleHandlers: Record<RuleType, ConditionalRuleHandler> = {
  // Simple comparisons
  equals: (value: any, ruleValue: any) => {
    if (Array.isArray(value) && Array.isArray(ruleValue)) {
      return JSON.stringify(value.sort()) === JSON.stringify(ruleValue.sort());
    }
    return value === ruleValue;
  },
  
  not: (value: any, ruleValue: any) => {
    if (Array.isArray(value) && Array.isArray(ruleValue)) {
      return JSON.stringify(value.sort()) !== JSON.stringify(ruleValue.sort());
    }
    if (Array.isArray(value)) {
      return !value.includes(ruleValue);
    }
    return value !== ruleValue;
  },
  
  oneOf: (value: any, ruleValue: any[]) => {
    if (Array.isArray(value)) {
      return value.some(item => ruleValue.includes(item));
    }
    return ruleValue.includes(value);
  },
  
  hasValue: (value: any, ruleValue: boolean) => {
    if (Array.isArray(value)) {
      return ruleValue ? value.length > 0 : value.length === 0;
    }
    return ruleValue ? !!value : !value;
  },
  
  // Array-specific rules
  contains: (value: any, ruleValue: any) => 
    Array.isArray(value) && value.includes(ruleValue),
  
  containsAll: (value: any, ruleValue: any[]) => 
    Array.isArray(value) && ruleValue.every(item => value.includes(item)),
  
  containsAny: (value: any, ruleValue: any[]) => 
    Array.isArray(value) && ruleValue.some(item => value.includes(item)),
  
  arrayLength: (value: any, ruleValue: number) => 
    Array.isArray(value) && value.length === ruleValue,
  
  arrayLengthMin: (value: any, ruleValue: number) => 
    Array.isArray(value) && value.length >= ruleValue,
  
  arrayLengthMax: (value: any, ruleValue: number) => 
    Array.isArray(value) && value.length <= ruleValue,
  
  isEmpty: (value: any, ruleValue: boolean) => {
    if (Array.isArray(value)) {
      return ruleValue ? value.length === 0 : value.length > 0;
    }
    return ruleValue ? !value : !!value;
  }
};

// Type-safe discriminated union for conditional rules
export type ConditionalRule = 
  | { field: string; type: "equals"; value: any }
  | { field: string; type: "not"; value: any }
  | { field: string; type: "oneOf"; value: any[] }
  | { field: string; type: "hasValue"; value: boolean }
  | { field: string; type: "contains"; value: any }
  | { field: string; type: "containsAll"; value: any[] }
  | { field: string; type: "containsAny"; value: any[] }
  | { field: string; type: "arrayLength"; value: number }
  | { field: string; type: "arrayLengthMin"; value: number }
  | { field: string; type: "arrayLengthMax"; value: number }
  | { field: string; type: "isEmpty"; value: boolean }

export interface FieldConditions {
  rules: ConditionalRule[];
  logic?: "AND" | "OR";
}

export interface FieldConditions {
  rules: ConditionalRule[];
  logic?: "AND" | "OR";
}

export const evaluateRule = (rule: ConditionalRule, allValues: Record<string, any>): boolean => {
  const fieldValue = get(allValues, rule.field);
  
  // Handle typed rules
  const handler = ruleHandlers[rule.type];
  if (!handler) {
    console.warn(`Unknown rule type: ${rule.type}`);
    return false;
  }
  
  return handler(fieldValue, rule.value);
};

export const evaluateConditions = (conditions: FieldConditions, allValues: Record<string, any>): boolean => {
  const { rules, logic = "AND" } = conditions;
  
  if (logic === "OR") {
    return rules.some(rule => evaluateRule(rule, allValues));
  } else {
    return rules.every(rule => evaluateRule(rule, allValues));
  }
};