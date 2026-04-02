import * as React from "react";
import {
  FormFieldContextValue,
  FormItemContextValue,
} from "./form-context.types";

export const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

export const FormItemContext =
  React.createContext<FormItemContextValue | null>(null);

export type { FormFieldContextValue, FormItemContextValue };