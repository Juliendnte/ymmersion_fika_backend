import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {forwardRef, Module} from '@nestjs/common';
import {EmailService} from './email.service';
import {join} from 'path';
import {ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {AuthModule} from "src/module/auth/auth.module";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        JwtModule.register({}),
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('EMAIL_HOST'),
                    secure: false,
                    auth: {
                        user: config.get('EMAIL_USER'),
                        pass: config.get('EMAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"No Reply" <${config.get('EMAIL_FROM')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {
}
