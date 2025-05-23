import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger('AuthMS-Main');

  //const app = await NestFactory.create(AppModule);    // Inicio comun API rest
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers
      }
    }
  );      //inicio como microservicio

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //await app.listen(envs.port);
  await app.listen();

  logger.log(`Auth Microservice running on port ${ envs.port }`);

}

bootstrap();
