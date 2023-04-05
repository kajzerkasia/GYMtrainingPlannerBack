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

    constructor(obj: PartOfPlanEntity, existingSlugs: string[] = []) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Należy podać nazwę części planu o długości max. 100 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.slug = slugify(obj.slug || obj.name, existingSlugs);
    }

    static async findAll(): Promise<PartOfPlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `parts_of_plan` ORDER BY `name` ASC") as PartOfPlanRecordResults;

        return results.map(obj => new PartOfPlanRecord(obj));
    }

    static async findAllWithSlug(slug: string): Promise<PartOfPlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `parts_of_plan` WHERE `slug` = :slug", {
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

        if (!this.id) {
            this.id = uuid();

        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        if (!this.slug) {
            const [results] = await pool.execute("SELECT `slug` FROM `parts_of_plan`") as PartOfPlanRecordResults;
            const existingSlugs = results.map((row: any) => row.slug);

            this.slug = slugify(this.slug || this.name, existingSlugs);
        }

        await pool.execute("INSERT INTO `parts_of_plan`(`id`, `name`, `slug`) VALUES(:id, :name, :slug)", this);

        return this.id;
    }

    async update(): Promise<void> {

        await pool.execute("UPDATE `parts_of_plan` SET `name` = :name, `slug` = :slug WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            slug: this.slug,
        });

        const [results] = await pool.execute("SELECT `slug` FROM `parts_of_plan`") as PartOfPlanRecordResults;
        const existingSlugs = results.map((row: any) => row.slug);

        this.slug = slugify(this.slug || this.name, existingSlugs);
    }

    async delete(): Promise<void> {
        console.log(this.id)
        await pool.execute("DELETE FROM `parts_of_plan` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

