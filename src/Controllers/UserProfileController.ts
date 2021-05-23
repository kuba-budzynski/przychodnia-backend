import {Controller, Get, Path, Route} from "tsoa";
import knex from '../config/database'

@Route("user")
export class UserProfileController extends Controller {
    @Get("/profile/{id}")
    public async getProfile(@Path() id: string) {
        const x = await  knex('users').select({
            id: 'users.id',
            name: 'users.name',
            surname: 'users.surname',
            email: 'users.email',
            birthday: 'users.birthday',
            phone: 'users.phone',
            pesel: 'user.pesel'
        }).where('id', id).limit(1)

        if(x.length == 0){

            const res = await knex('users_login').select({email: 'users_login.email'}).where('id', id).limit(1)
            const res2 = await knex('users').insert({email: res[0].email, id: id })
            return await knex('users').select().where('id', id)
        }
        return x
    }
}