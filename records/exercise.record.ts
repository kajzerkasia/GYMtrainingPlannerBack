import {ExerciseEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type ExerciseRecordResults = [ExerciseEntity[], FieldPacket[]];

export class ExerciseRecord implements ExerciseEntity {
    public id: string;
    public order: string;
    public name: string;
    public series: number;
    public repetitions: string;
    public pause: string;
    public tips: string;
    public url: string;


    constructor(obj: ExerciseEntity) {
        if (!obj.order || obj.order.length > 50) {
            throw new ValidationError('Należy podać kolejność wykonywania ćwiczeń o długości max. 50 znaków.');
        }

        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Należy podać nazwę ćwiczenia o długości max. 100 znaków.');
        }

        if (obj.series < 0 || obj.series > 127) {
            throw new ValidationError('Ilość serii nie może być mniejsza niż 0 lub większa niż 127.');
        }

        if (!obj.repetitions || obj.repetitions.length > 50) {
            throw new ValidationError('Należy podać ilość powtórzeń lub ich zakres o długości max. 50 znaków.');
        }

        if (!obj.pause || obj.pause.length > 50) {
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
        this.name = obj.name;
        this.series = obj.series;
        this.repetitions = obj.repetitions;
        this.pause = obj.pause;
        this.tips = obj.tips;
        this.url = obj.url;
    }

    static async findAll(): Promise<ExerciseEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans`") as ExerciseRecordResults;

        return results.map(obj => new ExerciseRecord(obj));
    }


    static async getOne(id: string): Promise<ExerciseRecord | null> {
        const [results] = await pool.execute("SELECT * from `plans` WHERE `id` = id", {
            id,
        }) as ExerciseRecordResults;
        return results.length === 0 ? null : new ExerciseRecord(results[0]);
    }

    async insert(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        await pool.execute("INSERT INTO `plans`(`id`, `order`, `name`, `series`, `repetitions`, `pause`, `tips`, `url`) VALUES(:id, :order, :name, :series, :repetitions, :pause, :tips, :url)", this);
    }

    async update() {

        await pool.execute("UPDATE `plans` SET `order` = :order, `name` = :name, `series` = :series, `repetitions` = :repetitions, `pause` = :pause, `tips` = :tips, `url` = :url WHERE `id` = :id", {
            id: this.id,
            order: this.order,
            name: this.name,
            series: this.series,
            repetitions: this.repetitions,
            pause: this.pause,
            tips: this.tips,
            url: this.url,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `plans` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

