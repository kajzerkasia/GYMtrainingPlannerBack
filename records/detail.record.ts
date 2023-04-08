import {DetailEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type DetailRecordResults = [DetailEntity[], FieldPacket[]];

export class DetailRecord implements DetailEntity {
    public id: string;
    public length: string;
    public frequency: string;
    public schedule: string;

    constructor(obj: DetailEntity) {
        if (obj.length.length > 500) {
            throw new ValidationError('Należy podać długość cyklu - max. 500 znaków.');
        }

        if (obj.frequency.length > 500) {
            throw new ValidationError('Należy podać częstotliwość treningów o długości max. 500 znaków.');
        }

        if (obj.schedule.length > 500) {
            throw new ValidationError('Należy podać rozkład treningów o max. 500 znaków.');
        }

        this.id = obj.id;
        this.length = obj.length;
        this.frequency = obj.frequency;
        this.schedule = obj.schedule;
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

        await pool.execute("UPDATE `plan_details` SET `length` = :length, `frequency` = :frequency, `schedule` = :schedule WHERE `id` = :id", {
            id: this.id,
            length: this.length,
            frequency: this.frequency,
            schedule: this.schedule,
        });

    }
}

