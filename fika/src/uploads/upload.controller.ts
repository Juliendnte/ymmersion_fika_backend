import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('uploads')
export class UploadController {

    @Post('/uploadImage')
    @UseInterceptors(FileInterceptor('file', {
        limits: {fileSize: Math.pow(1024, 2)}
    }))
    async uploadImage(@UploadedFile() file) {

        const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
        return {
            url: fileUrl
        }
    }
}