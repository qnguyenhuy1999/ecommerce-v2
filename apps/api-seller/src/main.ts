import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { ensureWorkspaceEnvFileLoaded } from '@ecom/config'

async function bootstrap() {
  ensureWorkspaceEnvFileLoaded()

  const [
    { AppModule },
    { getCorsOrigins, getSellerPort },
    { AllExceptionsFilter, ResponseInterceptor },
    { buildSwaggerDocument },
  ] = await Promise.all([
    import('./app.module'),
    import('@ecom/config'),
    import('@ecom/nestjs-core'),
    import('@ecom/nestjs-core/openapi'),
  ])

  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  app.use(cookieParser())

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  const document = buildSwaggerDocument(app, {
    title: 'Seller Center API',
    description: 'API for the multi-vendor marketplace Seller Center',
    version: '1.0',
    path: 'docs',
  })

  if (process.env.GENERATE_SWAGGER === 'true') {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const outputPath = path.join(process.cwd(), 'openapi', 'seller.json')
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
    logger.log(`OpenAPI schema generated at ${outputPath}`)
    await app.close()
    process.exit(0)
  }

  const port = getSellerPort()
  await app.listen(port)
  logger.log(`Seller API running on http://localhost:${port}`)
  logger.log(`Swagger docs at http://localhost:${port}/docs`)
}

void bootstrap()
