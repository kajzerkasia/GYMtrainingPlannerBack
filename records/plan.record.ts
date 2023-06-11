import {PlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type PlanRecordResults = [PlanEntity[], FieldPacket[]];

export class PlanRecord implements PlanEntity {
    public id: string;
    public name: string;
    public createdAt: Date;

    constructor(obj: PlanEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Należy podać nazwę planu treningowego o długości max. 100 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.createdAt = obj.createdAt;
    }

    static async findAll(): Promise<PlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans_list` ORDER BY `createdAt` ASC") as PlanRecordResults;

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

        await pool.execute("INSERT INTO `plans_list`(`id`, `name`, `createdAt`) VALUES(:id, :name, :createdAt)", this);
    }

    async update() {

        await pool.execute("UPDATE `plans_list` SET `name` = :name WHERE `id` = :id", {
            id: this.id,
            name: this.name,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `plans_list` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

