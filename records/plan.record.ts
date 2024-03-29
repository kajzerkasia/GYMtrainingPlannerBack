import {PlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';
import {slugify} from "../utils/slugify";


type PlanRecordResults = [PlanEntity[], FieldPacket[]];

export class PlanRecord implements PlanEntity {
    public id: string;
    public name: string;
    public slug: string;
    public createdAt: Date;
    public userId: string;

    constructor(obj: PlanEntity, existingSlugs: string[] = []) {
        if (!obj.name || obj.name.length > 50) {
            throw new ValidationError('Należy podać nazwę planu treningowego o długości max. 50 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.slug = slugify(obj.slug || obj.name, existingSlugs);
        this.createdAt = obj.createdAt;
        this.userId = obj.userId;
    }

    static async findAll(): Promise<PlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans_list` ORDER BY `createdAt` ASC") as PlanRecordResults;

        return results.map(obj => new PlanRecord(obj));
    }

    static async findAllWithUserId(userId: string): Promise<PlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans_list` WHERE `userId` = :userId ORDER BY `createdAt` ASC", {
            userId,
        }) as PlanRecordResults;

        return results.map(obj => new PlanRecord(obj));
    }

    static async findAllWithSlug(slug: string): Promise<PlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans_list` WHERE `slug` = :slug ORDER BY `createdAt` ASC", {
            slug,
        }) as PlanRecordResults;

        return results.map(obj => new PlanRecord(obj));
    }

    static async getOne(id: string): Promise<PlanRecord | null> {
        const [results] = await pool.execute("SELECT * from `plans_list` WHERE `id` = :id", {
            id,
        }) as PlanRecordResults;
        return results.length === 0 ? null : new PlanRecord(results[0]);
    }

    async insert(): Promise<void> {
        if (!this.id || !this.createdAt) {
            this.id = uuid();
            this.createdAt = new Date();

        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        if (!this.slug) {
            const [results] = await pool.execute("SELECT `slug` FROM `plans_list`") as PlanRecordResults;
            const existingSlugs = results.map((row: any) => row.slug);

            this.slug = slugify(this.slug || this.name, existingSlugs);
        }

        await pool.execute("INSERT INTO `plans_list`(`id`, `name`, `slug`, `createdAt`, `userId`) VALUES(:id, :name, :slug, :createdAt, :userId)", this);
        await pool.execute("INSERT INTO `plan_details`(`id`, `length`, `frequency`, `schedule`, `planId`) VALUES(:id, NULL, NULL, NULL, :planId)", { id: uuid(), planId: this.id });
    }

    async update() {

        const [rows] = await pool.execute("SELECT `slug` FROM `plans_list`") as PlanRecordResults;
        const existingSlugs = rows.map(row => row.slug as string);
        const newSlug = slugify(this.slug || this.name, existingSlugs);
        if (newSlug !== this.slug) {
            this.slug = newSlug;
        }

        await pool.execute("UPDATE `plans_list` SET `name` = :name, `slug` = :slug WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            slug: this.slug,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `plans_list` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

