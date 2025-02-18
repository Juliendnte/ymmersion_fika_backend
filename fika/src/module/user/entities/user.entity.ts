import {RoleEntity} from "src/module/user/entities/role.entity";

export class UserEntity {
    constructor({Role, ...data}: Partial<UserEntity>) {
        Object.assign(this, data);
        if (Role) {
            this.Role = new RoleEntity(Role);
        }
    }

    uid: string;
    name: string;
    email: string;
    imagePath: string;
    createdAt: Date;
    updatedAt: Date;
    Role: RoleEntity
}