import { Module } from '@nestjs/common';
import {OauthController} from "./oauth.controller";
import {ConfigModule} from "../config/config.module";
import {ConfigService} from "../config/config.service";

@Module({
    imports: [ConfigModule],
    controllers: [OauthController]
})
export class OauthModule {
    constructor(private readonly configService: ConfigService) {
    }
}
