import {EventEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type EventRecordResults = [EventEntity[], FieldPacket[]];

export class EventRecord implements EventEntity {
    public id: string;
    public planName: string;
    public partName: string;
    public startDate: string;
    public endDate: string;

    constructor(obj: EventEntity) {
        if (!obj.planName || obj.planName.length > 50) {
            throw new ValidationError('Nazwa planu powinna mieć długość max. 50 znaków.');
        }
        if (!obj.partName || obj.partName.length > 50) {
            throw new ValidationError('Nazwa części planu powinna mieć długość max. 50 znaków.');
        }

        this.id = obj.id;
        this.planName = obj.planName;
        this.partName = obj.partName;
        this.startDate = obj.startDate;
        this.endDate = obj.endDate;
    }

    static async findAll(): Promise<EventEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `trainings`") as EventRecordResults;

        return results.map(obj => new EventRecord(obj));
    }

    static async getOne(id: string): Promise<EventRecord | null> {
        const [results] = await pool.execute("SELECT * from `trainings` WHERE `id` = :id", {
            id,
        }) as EventRecordResults;
        return results.length === 0 ? null : new EventRecord(results[0]);
    }

    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        await pool.execute("INSERT INTO `trainings`(`id`, `planName`, `partName`, `startDate`, `endDate`) VALUES(:id, :planName, :partName, :startDate, :endDate)", this);
    }

    async update() {

        await pool.execute("UPDATE `trainings` SET `planName` = :planName, `partName` = :partName, `startDate` = :startDate, `endDate` = :endDate WHERE `id` = :id", {
            id: this.id,
            planName: this.planName,
            partName: this.partName,
            startDate: this.startDate,
            endDate: this.endDate,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `trainings` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

