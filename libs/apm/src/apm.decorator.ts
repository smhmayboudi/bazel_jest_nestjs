import {
  ExecutionContext,
  PipeTransform,
  Type,
  createParamDecorator,
} from "@nestjs/common";
import { MethodSignature, afterMethod, beforeMethod } from "kaop-ts";
import { getOrCreateApmInstance, getTokenName } from "./apm.util";

import { Span } from "./apm.module.interface";

export const ApmCurrentSpan: (
  ...dataOrPipes: (
    | string
    | PipeTransform<any, any>
    | Type<PipeTransform<any, any>>
  )[]
) => ParameterDecorator = createParamDecorator(
  (_data: unknown, _context: ExecutionContext) => {
    const apmInstance = getOrCreateApmInstance({});
    return apmInstance.currentSpan;
  }
);

export const ApmCurrentTraceparent: (
  ...dataOrPipes: (
    | string
    | PipeTransform<any, any>
    | Type<PipeTransform<any, any>>
  )[]
) => ParameterDecorator = createParamDecorator(
  (_data: unknown, _context: ExecutionContext) => {
    const apmInstance = getOrCreateApmInstance({});
    return apmInstance.currentTraceparent;
  }
);

export const ApmCurrentTransaction: (
  ...dataOrPipes: (
    | string
    | PipeTransform<any, any>
    | Type<PipeTransform<any, any>>
  )[]
) => ParameterDecorator = createParamDecorator(
  (_data: unknown, _context: ExecutionContext) => {
    const apmInstance = getOrCreateApmInstance({});
    return apmInstance.currentTransaction;
  }
);

let spans: { name: string; span: Span }[] = [];

export const ApmAfterMethod: MethodSignature<any, any> = afterMethod((meta) => {
  if (process.env.NODE_ENV) {
    return;
  }
  if (process.env.NODE_ENV === "test") {
    return;
  }
  const apmInstance = getOrCreateApmInstance({});
  if (!apmInstance.isStarted()) {
    return;
  }
  const tokenName = getTokenName(
    meta.target.constructor.name,
    meta.method.name
  );
  spans
    .filter((value) => value.name === tokenName)
    .forEach((value) => value.span.end());
  spans = spans.filter((value) => value.name !== tokenName);
});

export const ApmBeforeMethod: MethodSignature<any, any> = beforeMethod(
  (meta) => {
    if (process.env.NODE_ENV) {
      return;
    }
    if (process.env.NODE_ENV === "test") {
      return;
    }
    const apmInstance = getOrCreateApmInstance({});
    if (!apmInstance.isStarted()) {
      return;
    }
    const span = apmInstance.startSpan(
      meta.method.name,
      meta.target.constructor.name
    );
    if (span === null) {
      return;
    }
    spans = [
      ...spans,
      {
        name: getTokenName(meta.target.constructor.name, meta.method.name),
        span,
      },
    ];
  }
);
