// src/components/ui/chart-utils.ts
import { createContext } from "react";

export const useChart = createContext<{
  config: Record<
    string,
    {
      label?: string;
      theme?: { light?: string; dark?: string };
      color?: string;
      icon?: React.ComponentType;
    }
  >;
}>({
  config: {},
});

export function getPayloadConfigFromPayload(
  config: Record<
    string,
    {
      label?: string;
      theme?: { light?: string; dark?: string };
      color?: string;
      icon?: React.ComponentType;
    }
  >,
  _payload: any,
  key: string
) {
  return config[key] || {};
}
