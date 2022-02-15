import AppConfigJsonScheme from "./scheme/AppConfigJsonScheme";
import GoogleCredentialsJsonScheme from "./scheme/GoogleCredentialsJsonScheme";
import {FileHandle, open} from "fs/promises";
import {ConfigMode} from "./config.service";

export class ConfigFileLoader {
    
    public appConfig: AppConfigJsonScheme = null;
    public googleCredentials: GoogleCredentialsJsonScheme = null;

    /**
     *
     * @param mode
     */
    public async load(mode: ConfigMode) {
        const relBase = './'
        let appConfigJsonFilePath : string = relBase + 'config';

        appConfigJsonFilePath += mode === 'dev' ? '.dev' : '.prod';
        appConfigJsonFilePath += '.json';
        
        this.appConfig = await CD.readJsonFile<AppConfigJsonScheme>(appConfigJsonFilePath);
        this.googleCredentials = await CD.readJsonFile<GoogleCredentialsJsonScheme>(this.appConfig.googleOauth?.path);
        return this;
    }

    private static async readJsonFile<T=unknown>(path: string): Promise<T> {
        let fileHandle : FileHandle = undefined;
        try {
            fileHandle = await open(path, 'r');
            const buf = await fileHandle.readFile();
            return JSON.parse(buf.toString('utf-8'));
        } finally {
            await fileHandle?.close();
        }
    }
}
const CD = ConfigFileLoader;

export const configProvider = [
    {
        provide: 'CONFIG_LOADER',
        useFactory: async () => new ConfigFileLoader().load('dev')
    },
];