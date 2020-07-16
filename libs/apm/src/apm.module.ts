import { APM_INSTANCE_TOKEN, APM_MODULE_OPTIONS } from "./apm.constant";
import {
  Agent,
  ApmModuleAsyncOptions,
  ApmModuleOptions,
  ApmOptionsFactory,
} from "./apm.module.interface";
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { getOrCreateApmInstance, makeDefaultOptions } from "./apm.util";

import { APP_INTERCEPTOR } from "@nestjs/core";
import { ApmInterceptor } from "./apm.interceptor";
import { ApmService } from "./apm.service";

@Global()
@Module({
  providers: [
    ApmService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApmInterceptor,
    },
  ],
})
export class ApmModule {
  private static createAsyncOptionsProvider(
    options: ApmModuleAsyncOptions
  ): Provider<Promise<ApmModuleOptions> | ApmModuleOptions> {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: APM_MODULE_OPTIONS,
        useFactory: async (...args): Promise<ApmModuleOptions> =>
          makeDefaultOptions(
            options.useFactory && (await options.useFactory(args))
          ),
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<ApmOptionsFactory>,
    ];
    return {
      inject,
      provide: APM_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: ApmOptionsFactory
      ): Promise<ApmModuleOptions> =>
        makeDefaultOptions(await optionsFactory.createApmOptions()),
    };
  }

  private static createAsyncProviders(
    options: ApmModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<ApmOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  static register(options?: ApmModuleOptions): DynamicModule {
    const opts = makeDefaultOptions(options);
    const apmInstanceProvider: Provider<Agent> = {
      provide: APM_INSTANCE_TOKEN,
      useValue: getOrCreateApmInstance(opts),
    };
    return {
      module: ApmModule,
      providers: [apmInstanceProvider],
    };
  }

  static registerAsync(options: ApmModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const apmInstanceProvider: Provider<Agent> = {
      inject: [APM_MODULE_OPTIONS],
      provide: APM_INSTANCE_TOKEN,
      useFactory: (options: ApmModuleOptions) =>
        getOrCreateApmInstance(options),
    };
    return {
      imports: options.imports,
      module: ApmModule,
      providers: [...asyncProviders, apmInstanceProvider],
    };
  }
}
