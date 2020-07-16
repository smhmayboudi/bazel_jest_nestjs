import { IncomingMessage, ServerResponse } from "http";
import { ModuleMetadata, Type } from "@nestjs/common/interfaces";

import AwsLambda from "aws-lambda";
import Connect from "connect";

export type ApmModuleOptions = AgentConfigOptions;

export interface ApmOptionsFactory {
  createApmOptions(): Promise<ApmModuleOptions> | ApmModuleOptions;
}
export interface ApmModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<ApmOptionsFactory>;
  useExisting?: Type<ApmOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<ApmModuleOptions> | ApmModuleOptions;
}
export interface Agent {
  // Configuration
  start(options?: AgentConfigOptions): Agent;
  isStarted(): boolean;
  setFramework(options: {
    name?: string;
    version?: string;
    overwrite?: boolean;
  }): void;
  addPatch(modules: string | string[], handler: string | PatchHandler): void;
  removePatch(modules: string | string[], handler: string | PatchHandler): void;
  clearPatches(modules: string | string[]): void;
  // Data collection hooks
  middleware: { connect(): Connect.ErrorHandleFunction };
  lambda(handler: AwsLambda.Handler): AwsLambda.Handler;
  lambda(type: string, handler: AwsLambda.Handler): AwsLambda.Handler;
  handleUncaughtExceptions(fn?: (err: Error) => void): void;
  // Errors
  captureError(
    err: Error | string | ParameterizedMessageObject,
    callback?: CaptureErrorCallback
  ): void;
  captureError(
    err: Error | string | ParameterizedMessageObject,
    options?: CaptureErrorOptions,
    callback?: CaptureErrorCallback
  ): void;
  // Distributed Tracing
  currentTraceparent: string | null;
  // Transactions
  startTransaction(
    name?: string | null,
    options?: TransactionOptions
  ): Transaction | null;
  startTransaction(
    name: string | null,
    type: string | null,
    options?: TransactionOptions
  ): Transaction | null;
  startTransaction(
    name: string | null,
    type: string | null,
    subtype: string | null,
    options?: TransactionOptions
  ): Transaction | null;
  startTransaction(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: TransactionOptions
  ): Transaction | null;
  setTransactionName(name: string): void;
  endTransaction(result?: string | number, endTime?: number): void;
  currentTransaction: Transaction | null;
  // Spans
  startSpan(name?: string | null, options?: SpanOptions): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    options?: SpanOptions
  ): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    options?: SpanOptions
  ): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: SpanOptions
  ): Span | null;
  currentSpan: Span | null;
  // Context
  setLabel(name: string, value: LabelValue): boolean;
  addLabels(labels: Labels): boolean;
  setUserContext(user: UserObject): void;
  setCustomContext(custom: object): void;
  // Transport
  addFilter(fn: FilterFn): void;
  addErrorFilter(fn: FilterFn): void;
  addSpanFilter(fn: FilterFn): void;
  addTransactionFilter(fn: FilterFn): void;
  flush(callback?: Function): void;
  destroy(): void;
  // Utils
  logger: Logger;
}
export interface GenericSpan {
  type: string | null;
  subtype: string | null;
  action: string | null;
  traceparent: string;
  setType(
    type?: string | null,
    subtype?: string | null,
    action?: string | null
  ): void;
  setLabel(name: string, value: LabelValue): boolean;
  addLabels(labels: Labels): boolean;
}
export interface Transaction extends GenericSpan {
  name: string;
  result: string | number;
  startSpan(name?: string | null, options?: SpanOptions): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    options?: SpanOptions
  ): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    options?: SpanOptions
  ): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: SpanOptions
  ): Span | null;
  ensureParentId(): string;
  end(result?: string | number | null, endTime?: number): void;
}
export interface Span extends GenericSpan {
  transaction: Transaction;
  name: string;
  end(endTime?: number): void;
}
export interface AgentConfigOptions {
  abortedErrorThreshold?: string;
  active?: boolean;
  addPatch?: KeyValueConfig;
  apiRequestSize?: string;
  apiRequestTime?: string;
  asyncHooks?: boolean;
  captureBody?: CaptureBody;
  captureErrorLogStackTraces?: CaptureErrorLogStackTraces;
  captureExceptions?: boolean;
  captureHeaders?: boolean;
  captureSpanStackTraces?: boolean;
  centralConfig?: boolean;
  containerId?: string;
  disableInstrumentations?: string | string[];
  environment?: string;
  errorMessageMaxLength?: string;
  errorOnAbortedRequests?: boolean;
  filterHttpHeaders?: boolean;
  frameworkName?: string;
  frameworkVersion?: string;
  globalLabels?: KeyValueConfig;
  hostname?: string;
  ignoreUrls?: (string | RegExp)[];
  ignoreUserAgents?: (string | RegExp)[];
  instrument?: boolean;
  instrumentIncomingHTTPRequests?: boolean;
  kubernetesNamespace?: string;
  kubernetesNodeName?: string;
  kubernetesPodName?: string;
  kubernetesPodUID?: string;
  logLevel?: LogLevel;
  logUncaughtExceptions?: boolean;
  logger?: Logger;
  metricsInterval?: string;
  payloadLogFile?: string;
  secretToken?: string;
  serverCaCertFile?: string;
  serverTimeout?: string;
  serverUrl?: string;
  serviceName?: string;
  serviceVersion?: string;
  sourceLinesErrorAppFrames?: number;
  sourceLinesErrorLibraryFrames?: number;
  sourceLinesSpanAppFrames?: number;
  sourceLinesSpanLibraryFrames?: number;
  stackTraceLimit?: number;
  transactionMaxSpans?: number;
  transactionSampleRate?: number;
  usePathAsTransactionName?: boolean;
  verifyServerCert?: boolean;
}
export interface CaptureErrorOptions {
  request?: IncomingMessage;
  response?: ServerResponse;
  timestamp?: number;
  handled?: boolean;
  user?: UserObject;
  labels?: Labels;
  tags?: Labels;
  custom?: object;
  message?: string;
}
export interface Labels {
  [key: string]: LabelValue;
}
export interface UserObject {
  id?: string | number;
  username?: string;
  email?: string;
}
export interface ParameterizedMessageObject {
  message: string;
  params: unknown[];
}
export interface Logger {
  fatal(msg: string, ...args: unknown[]): void;
  fatal(obj: {}, msg?: string, ...args: unknown[]): void;
  error(msg: string, ...args: unknown[]): void;
  error(obj: {}, msg?: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;
  warn(obj: {}, msg?: string, ...args: unknown[]): void;
  info(msg: string, ...args: unknown[]): void;
  info(obj: {}, msg?: string, ...args: unknown[]): void;
  debug(msg: string, ...args: unknown[]): void;
  debug(obj: {}, msg?: string, ...args: unknown[]): void;
  trace(msg: string, ...args: unknown[]): void;
  trace(obj: {}, msg?: string, ...args: unknown[]): void;
  [propName: string]: unknown;
}
export interface TransactionOptions {
  startTime?: number;
  childOf?: Transaction | Span | string;
}
export interface SpanOptions {
  childOf?: Transaction | Span | string;
}
export type CaptureBody = "off" | "errors" | "transactions" | "all";
export type CaptureErrorLogStackTraces = "never" | "messages" | "always";
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
export type CaptureErrorCallback = (err: Error | null, id: string) => void;
export type FilterFn = (payload: Payload) => Payload | boolean | void;
export type LabelValue = string | number | boolean | null | undefined;
export type KeyValueConfig = string | Labels | LabelValue[][];
export type Payload = { [propName: string]: unknown };
export type PatchHandler = (
  exports: unknown,
  agent: Agent,
  options: PatchOptions
) => any;

export interface PatchOptions {
  version: string | undefined;
  enabled: boolean;
}
export interface Taggable {
  setLabel(name: string, value: LabelValue): boolean;
  addLabels(labels: Labels): boolean;
}
export interface StartSpanFn {
  startSpan(name?: string | null, options?: SpanOptions): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    options?: SpanOptions
  ): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    options?: SpanOptions
  ): Span | null;
  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: SpanOptions
  ): Span | null;
}
