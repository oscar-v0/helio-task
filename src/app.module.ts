import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthMiddleware } from './auth/UserAuthMiddleware';
import { UserPrincipal } from './auth/UserPrincipal';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { ResourceService } from './resource/resource.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [AppController, ProjectsController],
  providers: [AppService, ProjectsService, ResourceService, UserPrincipal, UsersService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
