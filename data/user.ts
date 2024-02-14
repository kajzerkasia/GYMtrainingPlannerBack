import {UserRecord} from "../records/user.record";
const { NotFoundError } = require('../utils/errors');
import {hash} from 'bcryptjs';
import {UserEntity} from "../types";

async function add(data: UserEntity) {

    const hashedPw = await hash(data.password, 12);

    const user = new UserRecord({...data, password: hashedPw});
    await user.insert();

    return { email: data.email };
}

async function get(email: string) {
    const user = await UserRecord.getEmail(email);
    if (!user) {
        throw new NotFoundError('Could not find user for email ' + email);
    }

    return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
    };
}

exports.add = add;
exports.get = get;