export interface UserEntity {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date;
    slug: string;
}