import {Controller, Get, Path, Route} from "tsoa";
import knex from '../config/database'

@Route("user")
export class UserExistsController extends Controller {
    @Get("/exists/{id}")
    public async userExists(@Path() id: string) {
        const x = await  knex('users').select({id: 'users.id'}).where('id', id).limit(1)
        return {exists: x.length == 0 ? false : true}
    }
}