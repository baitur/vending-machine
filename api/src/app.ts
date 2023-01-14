import 'reflect-metadata';
import { fixAliases } from './utils/aliases';
import express from 'express';
import { appConfig } from '@base/config/app';
import { Container } from 'typedi';
import { createConnection, useContainer as dbContainer } from 'typeorm';
import { getMetadataArgsStorage, useContainer as routerContainer, useExpressServer } from 'routing-controllers';
import { Container as typeormContainer } from 'typeorm-typedi-extensions';
import bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';

fixAliases(__dirname);

export class App {
  private app: express.Application = express();
  private port: Number = appConfig.port;

  public constructor() {
    this.initApp().then(r => {
    });
  }

  private async initApp() {
    routerContainer(Container);
    dbContainer(typeormContainer);

    try {
      await createConnection();
    } catch (error) {
      console.log('Error while opening the DB: ', error);
    }

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    useExpressServer(this.app, {
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false,
      routePrefix: '/api',
      controllers: [__dirname + '/api/controllers/**/*Controller{.ts,.js}'],
      middlewares: [__dirname + '/api/middlewares/**/*{.ts,.js}'],
    });

    this.enableSwagger();

    const server = require('http').Server(this.app);
    server.listen(this.port,
      () => console.log(`Server listening at http://localhost:${this.port}`));
  }

  private enableSwagger() {
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage,
      { routePrefix: '/api' },
      {
        components: {
          schemas,
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        info: {
          description: 'Vending Machine API',
          title: 'API Documentation',
          version: '1.0.0',
          contact: {
            name: 'Yerlan Baiturinov',
            email: 'baitur.erlan@gmail.com',
          },
        },
      },
    );

    this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
  }

}

new App();
