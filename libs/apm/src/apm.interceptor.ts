import * as fastify from "fastify";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";

import { ApmService } from "./apm.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  constructor(private readonly apmService: ApmService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response> {
    const http = context.switchToHttp();
    const request = http.getRequest<
      fastify.FastifyRequest & {
        user: {
          sub: string;
        };
      }
    >();
    if (this.apmService.isStarted()) {
      this.apmService.setUserContext({
        id: request.user.sub,
      });
    }
    return next.handle().pipe(
      tap(undefined, (error) => {
        if (this.apmService.isStarted()) {
          this.apmService.captureError(error);
        }
      })
    );
  }
}
