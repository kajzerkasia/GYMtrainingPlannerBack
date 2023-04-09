import {ExerciseEntity, PartOfPlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type ExerciseRecordResults = [ExerciseEntity[], FieldPacket[]];

export class ExerciseRecord implements ExerciseEntity {
    public id: string;
    public order: string;
    public name: string;
    public series: string;
    public repetitions: string;
    public pause: string;
    public tips: string;
    public url: string;
    public partId: string;


    constructor(obj: ExerciseEntity) {
        if (obj.order.length > 12) {
            throw new ValidationError('Należy podać kolejność wykonywania ćwiczeń o długości max. 12 znaków.');
        }

        if (!obj.name || obj.name.length > 32) {
            throw new ValidationError('Należy podać nazwę ćwiczenia o długości max. 32 znaków.');
        }

        if (obj.series.length > 10) {
            throw new ValidationError('Należy podać ilość serii lub ich zakres o długości max. 10 znaków.');
        }

        if (obj.repetitions.length > 20) {
            throw new ValidationError('Należy podać ilość powtórzeń lub ich zakres o długości max. 20 znaków.');
        }

        if (obj.pause.length > 20) {
            throw new ValidationError('Należy podać długość przerwy między seriami lub jej zakres o długości max. 20 znaków.');
        }

        if (obj.tips.length > 500) {
            throw new ValidationError('Należy podać wskazówki dotyczące ćwiczeń o długości max. 500 znaków.');
        }

        if (obj.url.length > 130) {
            throw new ValidationError('Link do ćwiczenia nie może przekraczać 130 znaków.');
        }

        this.id = obj.id;
        this.order = obj.order;
        this.name = obj.name;
        this.series = obj.series;
        this.repetitions = obj.repetitions;
        this.pause = obj.pause;
        this.tips = obj.tips;
        this.url = obj.url;
        this.partId = obj.partId
    }

    static async findAll(): Promise<ExerciseEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans` ORDER BY `order` ASC") as ExerciseRecordResults;

        return results.map(obj => new ExerciseRecord(obj));
    }

    static async findAllWithPartId(partId: string): Promise<ExerciseEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `plans` WHERE `partId` = :partId ORDER BY `order` ASC", {
            partId,
        }) as ExerciseRecordResults;

        return results.map(obj => new ExerciseRecord(obj));
    }

    static async getOne(id: string): Promise<ExerciseRecord | null> {
        const [results] = await pool.execute("SELECT * from `plans` WHERE `id` = :id", {
            id,
        }) as ExerciseRecordResults;
        return results.length === 0 ? null : new ExerciseRecord(results[0]);
    }

    async insert(): Promise<string> {

        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        await pool.execute("INSERT INTO `plans`(`id`, `order`, `name`, `series`, `repetitions`, `pause`, `tips`, `url`, `partId`) VALUES(:id, :order, :name, :series, :repetitions, :pause, :tips, :url, :partId)", this);

        return this.id;
    }

    async update() {

        await pool.execute("UPDATE `plans` SET `order` = :order, `name` = :name, `series` = :series, `repetitions` = :repetitions, `pause` = :pause, `tips` = :tips, `url` = :url, `partId` = :partId WHERE `id` = :id", {
            id: this.id,
            order: this.order,
            name: this.name,
            series: this.series,
            repetitions: this.repetitions,
            pause: this.pause,
            tips: this.tips,
            url: this.url,
            partId: this.partId,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `plans` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

// TODO: Ogarnąć slugify

