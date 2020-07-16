import { Agent, ApmModuleOptions } from "./apm.module.interface";

import apm from "elastic-apm-node";

let apmInstance: Agent | undefined;

export function getOrCreateApmInstance(
  options: ApmModuleOptions,
  isTest = false
): Agent {
  if (apmInstance === undefined || isTest) {
    apmInstance = (apm.start(options) as unknown) as Agent;
  }
  return apmInstance;
}

export function getTokenName(targetName: string, methodName: string): string {
  return `${targetName}_${methodName}`;
}

export function makeDefaultOptions(
  options?: ApmModuleOptions
): ApmModuleOptions {
  return {
    ...options,
  };
}
