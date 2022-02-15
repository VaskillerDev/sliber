import { Module } from '@nestjs/common';
import {ConfigService} from "./config.service";
import {configProvider} from "./config.provider";

@Module({
    providers: [...configProvider, ConfigService],
    exports: [ConfigService]
})
export class ConfigModule {
}
