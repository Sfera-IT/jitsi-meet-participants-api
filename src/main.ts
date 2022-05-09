import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import awsLambdaFastify from 'aws-lambda-fastify';
import { FastifyInstance, fastify } from 'fastify';

import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

const isLambda = !!(
  process.env.LAMBDA_TASK_ROOT ||
  process.env.AWS_EXECUTION_ENV ||
  process.env.AWS_SAM_LOCAL
);

let server;

async function bootstrap() {
  const instance: FastifyInstance = fastify();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    {
      logger: !isLambda ? new Logger() : console,
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  server = { app, instance, initialized: false };
  return server;
}

async function main() {
  const { app } = server || (await bootstrap());
  await app.listen(3000, '0.0.0.0');
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const { app, instance, initialized } = server || (await bootstrap());

  if (!initialized) {
    const proxy = awsLambdaFastify(instance);
    await app.init();
    server.initialized = true;
    server.proxy = proxy;
  }

  return server.proxy(event, context);
}

if (!isLambda) main();
