import {PartOfPlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type PartOfPlanRecordResults = [PartOfPlanEntity[], FieldPacket[]];

export class PartOfPlanRecord implements PartOfPlanEntity {
    public id: string;
    public order: string;
    public exercise: string;
    public series: number;
    public repetitions: string;
    public break: string;
    public tips: string;
    public url: string;


    constructor(obj: PartOfPlanEntity) {
        if (!obj.order || obj.order.length > 50) {
            throw new ValidationError('Należy podać kolejność wykonywania ćwiczeń o długości max. 50 znaków.');
        }

        if (!obj.exercise || obj.exercise.length > 100) {
            throw new ValidationError('Należy podać nazwę ćwiczenia o długości max. 100 znaków.');
        }

        if (obj.series < 0 || obj.series > 127) {
            throw new ValidationError('Ilość serii nie może być mniejsza niż 0 lub większa niż 127.');
        }

        if (!obj.repetitions || obj.repetitions.length > 50) {
            throw new ValidationError('Należy podać ilość powtórzeń lub ich zakres o długości max. 50 znaków.');
        }

        if (!obj.break || obj.break.length > 50) {
            throw new ValidationError('Należy podać długość przerwy między seriami lub jej zakres o długości max. 50 znaków.');
        }

        if (!obj.tips || obj.tips.length > 50) {
            throw new ValidationError('Należy podać wskazówki dotyczące ćwiczeń o długości max. 50 znaków.');
        }

        if (!obj.url || obj.url.length > 100) {
            throw new ValidationError('Link ogłoszenia nie może być pusty ani przekraczać 100 znaków.');
        }

        this.id = obj.id;
        this.order = obj.order;
        this.exercise = obj.exercise;
        this.series = obj.series;
        this.repetitions = obj.repetitions;
        this.break = obj.break;
        this.tips = obj.tips;
        this.url = obj.url;
    }

    static async findAll(): Promise<PartOfPlanEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans`") as PartOfPlanRecordResults;

        return results.map(obj => new PartOfPlanRecord(obj));
    }


    static async getOne(id: string): Promise<PartOfPlanRecord | null> {
        const [results] = await pool.execute("SELECT * from `plans` WHERE `id` = id", {
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

        await pool.execute("INSERT INTO `plans`(`id`, `order`, `exercise`, `series`, `repetitions`, `break`, `tips`, `url`) VALUES(:id, :order, :exercise, :series, :repetitions, :break, :tips, :url)", this);
    }

    async update() {

        await pool.execute("UPDATE `plans` SET `order` = :order, `exercise` = :exercise, `series` = :series, `repetitions` = :repetitions, `break` = :break, `tips` = :tips `url` = :url WHERE `id` = :id", {
            id: this.id,
            order: this.order,
            exercise: this.exercise,
            series: this.series,
            repetitions: this.repetitions,
            break: this.break,
            tips: this.tips,
            url: this.url,
        });

    }
}

