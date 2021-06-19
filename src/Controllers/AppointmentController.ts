import express from 'express';
import { Controller, Get, Path, Route, Request, Post, Delete } from 'tsoa';
import knex from '../config/database';
import { getDocors, getSlots, generateSlotsFromAppointment } from '../slots';
import algoliasearch  from 'algoliasearch';

const MINUTES_TO_MILIS = 60000

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_KEY);
const index = client.initIndex("prod_SLOTS");

@Route('appointment')
export class AppointmentController extends Controller {
    @Get('/{id}')
    public async getAppointment(@Path() id: number) {
        const x = await knex('appointment').where('id', id);
        const details = await knex('appointment_details').where('id', x[0].details);

        return {...x, details: details};
    }

    @Get('/')
    public async getAllAppointment() {
        const x = await knex('appointment');
        const withDetails = x.map( async e => {
            const details = await knex('appointment_details').where('id', e.details);
            return {...e, details: details};
        })
        return  Promise.all(withDetails).then(res => res);
    }

    @Get('/slots/{months}')
    public async getAllSlots(@Path() months: number) {
        const today = new Date()
        const slots =await getSlots(today, new Date(today.getFullYear(), today.getMonth() + 3, today.getDate(),0,0));
        const err = index.replaceAllObjects(slots, { autoGenerateObjectIDIfNotExist: true })
        .then(({ objectIDs }) => console.log(objectIDs)).catch(err => err);
        if(err) {
            return err;
        }
        return slots;
    }

    @Get('/all/{fromDate}/{toDate}')
    public async getAllAppointmentsInGivenRange(@Path() fromDate: string, @Path() toDate: string) {
        const x = await knex('appointment').where('date', '>=', fromDate)
        .where('date', '<', toDate);
        const withDetails = x.map( async e => {
            const details = await knex('appointment_details').where('id', e.details);
            return {...e, details: details};
        })
        return  Promise.all(withDetails).then(res => res);
    }

    @Get('/all/{email}')
    public async getAllUserAppointments(@Path() email: string) {
        const x = await knex('appointment').where('patient', email);
        const withDetails = x.map( async e => {
            const details = await knex('appointment_details').where('id', e.details);
            return {...e, details: details};
        })
        return  Promise.all(withDetails).then(res => res);
    }

    @Get('/allPast/{email}')
    public async getAllUserPastAppointments(@Path() email: string) {
        const x = await knex('appointment').where({
            patient: email,
            isDone:  true
          });
          const withDetails = x.map( async e => {
              const details = await knex('appointment_details').where('id', e.details);
              return {...e, details: details};
          })
          return  Promise.all(withDetails).then(res => res);
    }

    @Get('/allFuture/{email}')
    public async getAllUserFutureAppointments(@Path() email: string) {
        const x = await knex('appointment').where({
            patient: email,
            isDone:  false
          });
          const withDetails = x.map( async e => {
              const details = await knex('appointment_details').where('id', e.details);
              return {...e, details: details};
          })
          return  Promise.all(withDetails).then(res => res);
    }

    @Post('/new/{email}')
    public async createAppointment(@Path() email: string, @Request() request: express.Request) {
        console.log('This is a request for: ' + email);
        console.log(JSON.stringify(request.body));
        const newDetails = {
            date:  new Date(request.body.date), 
            duration:  request.body.duration, 
            price:  request.body.price, 
            notes:  request.body.notes, 
            typeKey:  request.body.typeKey, 
            serviceKey:  request.body.serviceKey
        };
        
        const detail_id = await knex('appointment_details').insert(newDetails, ['id']);
        const newAppointment = {
            patient: email, 
            details: detail_id[0], 
            doctorKey: request.body.doctorKey, 
            date:  new Date(request.body.date),
        };
        const objectsID = []
        await index.browseObjects({
            query: '',
            filters: `doctorKey: ${newAppointment.doctorKey} AND date >= ${request.body.date} AND date < ${request.body.date + request.body.duration*MINUTES_TO_MILIS}`,
            batch: batch => {
                objectsID.push(batch)
            }
          });
        return await knex('appointment').insert(newAppointment, ['id']).then(async () => {
            await index.deleteObjects(objectsID[0].map(e => e.objectID));
            return true;
        })
        .catch((err) => {
            console.log(err)
            return false
        });
    }

    @Post('/setAsDone/{id}')
    public async setAsDone(@Path() id:number) {
        const x = await knex('appointment').where('id', id);

        return knex('users')
            .update({...x, isDone: true})
            .then(() => true)
            .catch((err) => false);
    }
    @Delete('/{id}')
    public async deleteAppointment(@Path() id: number){
        const x = await knex('appointment').where('id', id);
        const y = await knex('appointment_details').where('id', x[0].details);
        await knex('appointment').where('id', id).del()
        await knex('appointment_details').where('id', y[0].id).del()
        .then(async () => {
            const slots = await generateSlotsFromAppointment({...y, ...x})
            await index.saveObjects(slots, { autoGenerateObjectIDIfNotExist: true })
            return true;
        })
        .catch((err) => false);
    }
}