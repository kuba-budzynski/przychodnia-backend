import { Controller, Get, Path, Route } from 'tsoa';
import knex from '../config/database';

@Route('appointment')
export class AppointmentController extends Controller {
    @Get('/{id}')
    public async getAppointment(@Path() id: string) {
        const appointment = await knex('appointment').select({ id: 'appointment.id' }).where('id', id);
        if (appointment.length <= 0) {
            await knex('appointment').insert({ id: id, fresh: true });
        }
        const x = await knex('users').where('id', id);
        return x[0];
    }
}
