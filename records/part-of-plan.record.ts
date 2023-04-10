import {PartOfPlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';
import {slugify} from "../utils/slugify";

type PartOfPlanRecordResults = [PartOfPlanEntity[], FieldPacket[]];

export class PartOfPlanRecord implements PartOfPlanEntity {
    public id: string;
    public name: string;
    public slug: string;
    public createdAt: Date;

    constructor(obj: PartOfPlanEntity, existingSlugs: string[] = []) {
        if (!obj.name || obj.name.length > 50) {
            throw new ValidationError('Należy podać nazwę części planu o długości max. 50 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.slug = slugify(obj.slug || obj.name, existingSlugs);
        this.createdAt = obj.createdAt;
    }

    static async findAll(): Promise<PartOfPlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `parts_of_plan` ORDER BY `createdAt` ASC") as PartOfPlanRecordResults;

        return results.map(obj => new PartOfPlanRecord(obj));
    }

    static async findAllWithSlug(slug: string): Promise<PartOfPlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `parts_of_plan` WHERE `slug` = :slug ORDER BY `createdAt` ASC", {
            slug,
        }) as PartOfPlanRecordResults;

        return results.map(obj => new PartOfPlanRecord(obj));
    }

    static async getOne(id: string): Promise<PartOfPlanRecord | null> {
        const [results] = await pool.execute("SELECT * from `parts_of_plan` WHERE `id` = :id", {
            id,
        }) as PartOfPlanRecordResults;
        return results.length === 0 ? null : new PartOfPlanRecord(results[0]);
    }

    async insert(): Promise<string> {

        if (!this.id || !this.createdAt) {
            this.id = uuid();
            this.createdAt = new Date();

        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        if (!this.slug) {
            const [results] = await pool.execute("SELECT `slug` FROM `parts_of_plan`") as PartOfPlanRecordResults;
            const existingSlugs = results.map((row: any) => row.slug);

            this.slug = slugify(this.slug || this.name, existingSlugs);
        }

        await pool.execute("INSERT INTO `parts_of_plan`(`id`, `name`, `slug`, `createdAt`) VALUES(:id, :name, :slug, :createdAt)", this);

        return this.id;
    }

    async update(): Promise<void> {

        const [rows] = await pool.execute("SELECT `slug` FROM `parts_of_plan`") as PartOfPlanRecordResults;
        const existingSlugs = rows.map(row => row.slug as string);
        const newSlug = slugify(this.slug || this.name, existingSlugs);
        if (newSlug !== this.slug) {
            this.slug = newSlug;
        }

        await pool.execute("UPDATE `parts_of_plan` SET `name` = :name, `slug` = :slug WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            slug: this.slug,
        });
    }

    async delete(): Promise<void> {

        await pool.execute("DELETE FROM `parts_of_plan` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

