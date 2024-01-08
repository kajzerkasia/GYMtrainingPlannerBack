const { NotFoundError } = require('../utils/errors');
import {readData, User, writeData} from './util';
import {v4 as generateId} from 'uuid';
import {hash} from 'bcryptjs';

async function add(data: User) {
    const storedData = await readData();
    const userId = generateId();
    const hashedPw = await hash(data.password, 12);
    if (!storedData.users) {
        storedData.users = [];
    }
    storedData.users.push({ ...data, password: hashedPw, id: userId });
    await writeData(storedData);
    return { id: userId, email: data.email };
}

async function get(email: string) {
    const storedData = await readData();
    if (!storedData.users || storedData.users.length === 0) {
        throw new NotFoundError('Could not find any users.');
    }

    const user = storedData.users.find((ev: any) => ev.email === email);
    if (!user) {
        throw new NotFoundError('Could not find user for email ' + email);
    }

    return user;
}

exports.add = add;
exports.get = get;