import {UserEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';
import {slugify} from "../utils/slugify";

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
    public id: string;
    public email: string;
    public password: string;
    public createdAt: Date;
    public slug: string;

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
        this.slug = obj.slug;
    }

    static async findAll(): Promise<UserEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `users` ORDER BY `createdAt` ASC") as UserRecordResults;

        return results.map(obj => new UserRecord(obj));
    }

    static async getOne(id: string): Promise<UserRecord | null> {
        const [results] = await pool.execute("SELECT * from `users` WHERE `id` = :id", {
            id,
        }) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    static async getEmail(email: string): Promise<UserEntity | null> {
        const [results] = await pool.execute("SELECT * from `users` WHERE `email` = :email", {
            email,
        }) as UserRecordResults;

        return results.length === 0 ? null : {
            id: results[0].id,
            email: results[0].email,
            password: results[0].password,
            createdAt: results[0].createdAt,
            slug: results[0].slug,
        };
    }

    async insert(): Promise<void> {
        if (!this.id || !this.createdAt) {
            this.id = uuid();
            this.createdAt = new Date();

        } else {
            throw new Error('Użytkownik o podanym emailu już istnieje.');
        }

        const [results] = await pool.execute("SELECT `slug` FROM `users`") as UserRecordResults;
        const existingSlugs = results.map((row: any) => row.slug);

        this.slug = slugify(this.slug || this.email, existingSlugs);


        await pool.execute("INSERT INTO `users`(`id`, `email`, `password`, `createdAt`, `slug`) VALUES(:id, :email, :password, :createdAt, :slug)", this);
    }
}
