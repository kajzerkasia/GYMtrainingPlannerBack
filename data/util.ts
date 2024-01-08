import {readFile, writeFile} from 'node:fs/promises';

export interface User {
    email: string;
    password: string;
    id: string;
}

interface Event {
    users: User[];
}

async function readData(): Promise<Event> {
    try {
        const data: string = await readFile('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Błąd odczytu danych:', error);

        return { users: [] };
    }
}

async function writeData(data: Event): Promise<void> {
    await writeFile('users.json', JSON.stringify(data));
}

export {readData, writeData};