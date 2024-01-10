import {UserEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type UserRecordResults = [UserEntity[], FieldPacket[]];

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

    static async findAll(): Promise<UserEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `users` ORDER BY `createdAt` ASC") as UserRecordResults;

        return results.map(obj => new UserRecord(obj));
    }
}