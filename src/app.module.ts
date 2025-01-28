import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { ResourceService } from './resource/resource.service';

@Module({
  imports: [ConfigModule.forRoot({})],
  controllers: [AppController, ProjectsController],
  providers: [AppService, ProjectsService, ResourceService],
})
export class AppModule {}
