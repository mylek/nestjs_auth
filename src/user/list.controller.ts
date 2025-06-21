import { Controller, Get } from '@nestjs/common';

@Controller('api/list')
export class ListController {
    @Get('list')
    async list() {
        
    }

    @Get('getList')
    async getList() {
        return [
            {
                "id": 1,
                "username": 'test',
                "email": "test@o2.pl"
            }
        ];
    }
}
