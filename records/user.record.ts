import {UserEntity} from "../types";
import {ValidationError} from "../utils/errors";

export class UserRecord implements UserEntity {
    public id: string;
    public email: string;
    public password: string;
    public createdAt: Date;

    constructor(obj: UserEntity) {
        if (!obj.email || !obj.email.includes('@')) {
            throw new ValidationError('Należy podać właściwy adres email zawierający "@".');
        }

        if (!obj.password || obj.password.length < 6) {
            throw new ValidationError('Należy podać hasło o długości min. 6 znaków.');
        }

        this.id = obj.id;
        this.email = obj.email;
        this.password = obj.password;
        this.createdAt = obj.createdAt;
    }
}