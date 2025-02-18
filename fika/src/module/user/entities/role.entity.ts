export class RoleEntity {
    constructor(partial: Partial<RoleEntity>) {
        Object.assign(this, partial);
    }

    id: number;
    role: string;
}