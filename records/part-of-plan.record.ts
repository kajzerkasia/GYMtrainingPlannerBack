import {PartOfPlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type PartOfPlanRecordResults = [PartOfPlanEntity[], FieldPacket[]];

export class PartOfPlanRecord implements PartOfPlanEntity {
    public id: string;
    public name: string;
    public slug: string;

    constructor(obj: PartOfPlanEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Należy podać nazwę części planu o długości max. 100 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.slug = obj.slug;
    }

    static async findAll(): Promise<PartOfPlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `parts_of_plan`") as PartOfPlanRecordResults;

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

    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        await pool.execute("INSERT INTO `parts_of_plan`(`id`, `name`, `slug`) VALUES(:id, :name, :slug)", this);
    }

    async update() {

        await pool.execute("UPDATE `parts_of_plan` SET `name` = :name, `slug` = :slug WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            slug: this.slug
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `parts_of_plan` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

