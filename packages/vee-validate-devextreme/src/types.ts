export interface FieldContext {
  field: string;
  value: unknown;
  form: Record<string, unknown>;
  rule?: {
    name: string;
    params?: Record<string, unknown> | unknown[];
  };
}

export type ValidationMessageGenerator = (ctx: FieldContext) => string;
