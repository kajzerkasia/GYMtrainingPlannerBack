import {DetailEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type DetailRecordResults = [DetailEntity[], FieldPacket[]];

export class DetailRecord implements DetailEntity {
    public id: string;
    public name: string;

    constructor(obj: DetailEntity) {
        if (!obj.name || obj.name.length > 500) {
            throw new ValidationError('Należy podać zasadę progresji o długości max. 500 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
    }

    static async findAll(): Promise<DetailEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plan_details`") as DetailRecordResults;

        return results.map(obj => new DetailRecord(obj));
    }

    static async getOne(id: string): Promise<DetailRecord | null> {
        const [results] = await pool.execute("SELECT * from `plan_details` WHERE `id` = :id", {
            id,
        }) as DetailRecordResults;
        return results.length === 0 ? null : new DetailRecord(results[0]);
    }

    async update() {

        await pool.execute("UPDATE `plan_details` SET `name` = :name WHERE `id` = :id", {
            id: this.id,
            name: this.name,
        });

    }
}

