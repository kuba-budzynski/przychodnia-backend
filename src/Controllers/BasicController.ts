import {Controller, Get, Path, Route} from "tsoa";
import knex from '../config/database'

@Route("basic")
export class BasicController extends Controller {
    @Get("/{num}")
    public async getBasic(@Path() num: number) {
        const x = knex('users').select({email: 'users.email'})
        return x
    }
}