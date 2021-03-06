import { EnvironmentLoader } from "@mscs/environment";
import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./Module/Application/ApplicationModule";
import { ENVIRONMENT, joinToPackageDirectory } from "./Meta";
import { Logger } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

const DEFAULT_PORT = 80;

async function bootstrap() {
    const environmentLoader = new EnvironmentLoader(ENVIRONMENT);
    await environmentLoader.loadEnvironment(joinToPackageDirectory(".env"));

    const APP_PORT: number = ENVIRONMENT.has("APP_PORT") ? parseInt(ENVIRONMENT.get("APP_PORT"), 10) : DEFAULT_PORT;
    ENVIRONMENT.set("APP_PORT", APP_PORT.toString());

    return APP_PORT;
}

async function runtime(APP_PORT: number) {
    const fastify = new FastifyAdapter();
    const application = await NestFactory.create<NestFastifyApplication>(ApplicationModule, fastify, {
        logger: ["log", "error", "warn", "debug", "verbose"],
    });

    application.useStaticAssets({
        root: joinToPackageDirectory("public"),
        prefix: "/",
    });

    application.setViewEngine({
        engine: {
            twig: require("twig"),
        },
        templates: joinToPackageDirectory("templates"),
    });

    await application.listen(APP_PORT, '0.0.0.0', (error, address) => {
        if (error) {
            throw error;
        }

        (new Logger("Runtime")).log(`Application listen to: ${address}/${ENVIRONMENT.get("APP_IP")}:${APP_PORT}`);
    });
}

bootstrap()
    .then(runtime)
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
