import {PartOfPlanEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type PartOfPlanRecordResults = [PartOfPlanEntity[], FieldPacket[]];

export class PartOfPlanRecord implements PartOfPlanEntity {
    public id: string;
    public exercise: string;
    public series: number;
    public repetitions: string;
    public tempo: number;
    public break: string;
    public url: string;


    constructor(obj: PartOfPlanEntity) {
        if (!obj.exercise || obj.exercise.length > 100) {
            throw new ValidationError('Należy podać nazwę ćwiczenia o długości max. 100 znaków.');
        }

        if (obj.series < 0 || obj.series > 127) {
            throw new ValidationError('Ilość serii nie może być mniejsza niż 0 lub większa niż 127.');
        }

        if (!obj.repetitions || obj.repetitions.length > 50) {
            throw new ValidationError('Należy podać ilość powtórzeń lub ich zakres o długości max. 50 znaków.');
        }

        if (obj.tempo < 0 || obj.tempo > 65535) {
            throw new ValidationError('Tempo nie może być mniejsze niż 0 lub większe niż 65535.');
        }

        if (!obj.break || obj.break.length > 50) {
            throw new ValidationError('Należy podać długość przerwy między seriami lub jej zakres o długości max. 50 znaków.');
        }

        if (!obj.url || obj.url.length > 100) {
            throw new ValidationError('Link ogłoszenia nie może być pusty ani przekraczać 100 znaków.');
        }

        this.id = obj.id;
        this.exercise = obj.exercise;
        this.series = obj.series;
        this.repetitions = obj.repetitions;
        this.tempo = obj.tempo;
        this.break = obj.break;
        this.url = obj.url;
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

        await pool.execute("INSERT INTO `plans`(`id`, `exercise`, `series`, `repetitions`, `tempo`, `break`, `url`) VALUES(:id, :exercise, :series, :repetitions, :tempo, :break, :url)", this);
    }
}

