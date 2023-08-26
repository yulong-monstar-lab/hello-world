import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MsExtraExternalIdGuard } from './auth/guards/ms-extra-external-id.guard';
import { AppLogger } from './shared/logger/logger.service';
import { ReqContext } from './shared/request-context/req-context.decorator';
import { RequestContext } from './shared/request-context/request-context.dto';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
  ) {
    this.logger.setContext(AppController.name);
  }
  @UseGuards(MsExtraExternalIdGuard)
  @Get()
  getHello(@ReqContext() ctx: RequestContext): string {
    this.logger.log(ctx, 'Hello world from App controller');

    return this.appService.getHello(ctx);
  }
}
