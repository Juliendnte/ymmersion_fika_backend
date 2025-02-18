import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/module/auth/auth.service';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR } from 'src/common/constants/error.constants';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private mailerService: MailerService,
  ) {}

  public async sendResetPasswordLink(user: User): Promise<void> {
    const token = this.authService.generateResetToken({ userId: user.uid });
    await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        resetToken: token,
      },
    });

    const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;

    return this.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      template: './forgot-password',
      context: {
        name: user.name,
        url,
      },
    });
  }

  private async sendMail(options: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(options);
      this.logger.log(`Email sent out to ${options.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${error.message}`,
      );
      throw new Error(ERROR.EmailError.message);
    }
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.authService.validateToken(token);

      if (typeof payload === 'object' && 'userId' in payload) {
        return await this.prismaService.user.findUnique({
          where: { uid: payload.userId },
        });
      }
      throw new BadRequestException();
    } catch (error) {
      throw new BadRequestException(ERROR.InvalidToken);
    }
  }
}
