import {
  ApmCurrentSpan,
  ApmCurrentTraceparent,
  ApmCurrentTransaction,
} from "./apm.decorator";
import { Span, Transaction } from "./apm.module.interface";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";

describe("ApmDecorator", () => {
  it("ApmCurrentSpan enhance component with apm current span", () => {
    class Test {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      test(@ApmCurrentSpan() _span: Span | null): void {}
    }
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, "test");
    const key = Object.keys(metadata)[0];
    expect(metadata[key].factory()).toBeNull();
  });

  it("ApmCurrentTraceparent enhance component with apm current traceparent", () => {
    class Test {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      test(@ApmCurrentTraceparent() _traceparent: string): void {}
    }
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, "test");
    const key = Object.keys(metadata)[0];
    expect(metadata[key].factory()).toBeNull();
  });

  it("ApmCurrentTransaction enhance component with apm current transaction", () => {
    class Test {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      test(@ApmCurrentTransaction() _transaction: Transaction): void {}
    }
    const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, "test");
    const key = Object.keys(metadata)[0];
    expect(metadata[key].factory()).toBeNull();
  });

  it.todo("ApmAfterMethod enhance instance with apm");
  it.todo("ApmBeforeMethod enhance method with apm");
});
