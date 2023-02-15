import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'gym_plans',
    namedPlaceholders: true,
    decimalNumbers: true,
});