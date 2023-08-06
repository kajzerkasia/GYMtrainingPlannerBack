import {RuleEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type RuleRecordResults = [RuleEntity[], FieldPacket[]];

export class RuleRecord implements RuleEntity {
    public id: string;
    public rule: string;
    public createdAt: Date;
    public planId: string;

    constructor(obj: RuleEntity) {
        if (!obj.rule || obj.rule.length > 500) {
            throw new ValidationError('Należy podać zasadę progresji o długości max. 500 znaków.');
        }

        this.id = obj.id;
        this.rule = obj.rule;
        this.createdAt = obj.createdAt;
        this.planId = obj.planId;
    }

    static async findAll(): Promise<RuleEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `progression_rules` ORDER BY `createdAt` ASC") as RuleRecordResults;

        return results.map(obj => new RuleRecord(obj));
    }

    static async findAllWithPlanId(planId: string): Promise<RuleEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `progression_rules` WHERE `planId` = :planId", {
            planId,
        }) as RuleRecordResults;

        return results.map(obj => new RuleRecord(obj));
    }

    static async getOne(id: string): Promise<RuleRecord | null> {
        const [results] = await pool.execute("SELECT * from `progression_rules` WHERE `id` = :id", {
            id,
        }) as RuleRecordResults;
        return results.length === 0 ? null : new RuleRecord(results[0]);
    }

    async insert(): Promise<void> {
        if (!this.id || !this.createdAt) {
            this.id = uuid();
            this.createdAt = new Date();

        } else {
            throw new Error('Nie można dodać czegoś, co już istnieje.');
        }

        await pool.execute("INSERT INTO `progression_rules`(`id`, `rule`, `createdAt`, `planId`) VALUES(:id, :rule, :createdAt, :planId)", this);
    }

    async update() {

        await pool.execute("UPDATE `progression_rules` SET `rule` = :rule WHERE `id` = :id", {
            id: this.id,
            rule: this.rule,
        });

    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `progression_rules` WHERE `id` = :id", {
            id: this.id,
        })
    }
}

