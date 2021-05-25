import express from 'express';
import { Controller, Get, Path, Post, Request, Route } from 'tsoa';
import knex from '../config/database';

@Route('user')
export class UserProfileController extends Controller {
    @Get('/profile/{email}')
    public async getProfile(@Path() email: string) {
        const user = await knex('users').select({ id: 'users.email' }).where('email', email);
        if (user.length <= 0) {
            await knex('users').insert({ email: email, fresh: true });
        }
        const x = await knex('users').where('email', email);
        return x[0];
    }

    @Post('/profile/{email}')
    public async updateProfile(@Path() email: string, @Request() request: express.Request) {
        console.log('This is a request for: ' + email);
        console.log(JSON.stringify(request.body));
        const toUpdate = {
            name: request.body.name,
            name_updated: request.body.name != '',
            surname: request.body.surname,
            surname_updated: request.body.surname != '',
            birthday: request.body.birthday ? new Date(request.body.birthday) : null,
            birthday_updated: request.body.birthday != null,
            pesel: request.body.pesel,
            pesel_updated: request.body.pesel != '',
            phone: request.body.phone
        };
        console.log(toUpdate);
        return knex('users')
            .where('email', email)
            .update(toUpdate)
            .then(() => true)
            .catch((err) => false);
    }
}
