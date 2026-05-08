import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request } from 'express';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import { AUDIT_LOG_KEY, type AuditLogMetadata } from '../decorators/audit-log.decorator';
import type { AdminSessionData } from '../../auth/decorators/current-admin.decorator';

interface RequestWithAdmin extends Request {
  admin?: AdminSessionData;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const metadata = this.reflector.get<AuditLogMetadata>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    const admin = request.admin;

    if (!admin) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((result) => {
        const entityId = this.extractEntityId(metadata, context, result);
        const extractedMetadata = metadata.metadataExtractor
          ? metadata.metadataExtractor(result, request.body)
          : undefined;

        this.auditLogService.log({
          adminId: admin.adminId,
          action: metadata.action as unknown as import('@ecom/database').AuditActionType,
          entityType: metadata.entityType,
          entityId,
          metadata: extractedMetadata,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }

  private extractEntityId(
    metadata: AuditLogMetadata,
    context: ExecutionContext,
    result: unknown,
  ): string | undefined {
    // Extract from route params (e.g., @Param('id'))
    if (metadata.entityIdParam) {
      const request = context.switchToHttp().getRequest();
      return request.params[metadata.entityIdParam];
    }

    // Extract from result using path (e.g., 'data.id' or 'id')
    if (metadata.entityIdPath) {
      const path = metadata.entityIdPath.split('.');
      let value: unknown = result;
      for (const key of path) {
        value = (value as Record<string, unknown>)?.[key];
      }
      return typeof value === 'string' ? value : undefined;
    }

    return undefined;
  }
}
