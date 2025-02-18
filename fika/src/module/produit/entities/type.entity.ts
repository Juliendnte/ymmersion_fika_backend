export class TypeEntity {
    constructor(partial: Partial<TypeEntity>) {
        Object.assign(this, partial);
    }

    id: string;
    name: string;
}