import { Controller, Get} from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';

@Controller('api/role')
export class RoleController {

    @Get('')
    getList(): Object {
        return [
            {id: Role.USER, name: Role.USER},
            {id: Role.EDITOR, name: Role.EDITOR},
            {id: Role.ADMIN, name: Role.ADMIN},
        ];
    }
}