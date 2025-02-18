export class CategoryEntity{
    constructor(partial: Partial<CategoryEntity>) {
        Object.assign(this, partial);
    }

    id: number;
    name: string;
}