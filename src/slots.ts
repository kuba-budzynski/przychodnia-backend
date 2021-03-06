import { filter, some, flatten } from 'lodash';
import { request, gql, GraphQLClient } from 'graphql-request'
import { Controller, Get, Path, Route, Request, Post, Delete } from 'tsoa';
import knex from './config/database';
import e from 'express';
import { Console } from 'console';
import { date } from 'joi';
import algoliasearch  from 'algoliasearch';

const clientAgolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_KEY);
export const index = clientAgolia.initIndex("prod_SLOTS");

const DAY_TO_MILIS = 86400000
const MINUTES_TO_MILIS = 60000
function generateTimes() {
    let quarterHours = ['00', '15', '30', '45'];
    let times = [];
    for (var i = 8; i < 15; i++) {
        for (var j = 0; j < 4; j++) {
            times.push(i + ':' + quarterHours[j]);
        }
    }
    return times;
}

const client = new GraphQLClient(process.env.GRAPHCMS_HOST, {
    headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`
    }
});

export function getDocors() {
    const query = gql`
    {
        doctors {
            id
            name
            surname
            title
            slug
            profile {
                url
                width
                height
                handle
            }
            uslugiLekarzy {
              id
              usluga {
                  nazwa
                }
              cena
              czasTrwania
              }
            specializations
            }
    }
  `

    return client.request(query).then((data) => data)
}

export async function generateSlotsFromAppointment(appointment) {
    const duration = appointment.duration;
    const fromDate = new Date(appointment.date);
    fromDate.setHours(fromDate.getHours())
    let iter = fromDate.getTime();
    const doctors = await getDocors();
    const d = doctors.doctors.find(element => element.id === appointment.doctorKey);
    const appointments = []
    while (iter < fromDate.getTime() + duration * MINUTES_TO_MILIS) {
        appointments.push(d.uslugiLekarzy.map((service) => {
            return {
                date: iter,
                duration: service.czasTrwania,
                price: service.cena,
                notes: '',
                typeKey: '',
                serviceKey: service.id,
                serviceName: service.usluga.nazwa,
                doctorKey: d.id,
                doctorName: d.title +" "+d.name+" "+d.surname,
            };
        }))
        iter = iter + MINUTES_TO_MILIS*15;
    }1
    return flatten(appointments);
}

export async function getSlots(fromDate, toDate) {
    const x = await knex('appointment');
    const withDetails = x.map( async e => {
        const details = await knex('appointment_details').where('id', e.details);
        return {...e, details: details};
    })
    const plannedAppointments = await Promise.all(withDetails).then(res => res);
    const doctors = await getDocors();
    const times = generateTimes();
    const appointments = [];
    let iter = fromDate.getTime();
    while (iter <= toDate.getTime()) {
        const day = new Date()
        day.setTime(iter);
        appointments.push(
            flatten(
                doctors.doctors.map((d) => {
                    const doctorsPlannedVisits = filter(plannedAppointments, (a) => {
                        return a.doctorKey === d.id && new Date(a.date).getDate() === day.getDate() && new Date(a.date).getMonth() === day.getMonth();
                    });
                    const availableHours = filter(times, (hour) => {
                        const hourAsDate = new Date(
                            day.getFullYear(),
                            day.getMonth(),
                            day.getDate(),
                            parseInt(hour.split(':')[0]),
                            parseInt(hour.split(':')[1])
                        );

                        const available = !some(doctorsPlannedVisits, (a) => {
                            const visitDate = new Date(a.date);
                            return (
                                visitDate.getTime() <= hourAsDate.getTime() &&
                                hourAsDate.getTime() < visitDate.setMinutes(visitDate.getMinutes() + a.details[0].duration)
                            );
                        });
                        return available;
                    });

                    return flatten(
                        availableHours.map((hour) => { 
                            return d.uslugiLekarzy.map((service) => {
                                const date = new Date(
                                    day.getFullYear(),
                                    day.getMonth(),
                                    day.getDate(),
                                    parseInt(hour.split(':')[0]),
                                    parseInt(hour.split(':')[1])
                                );
                                return {
                                    date: date.getTime(),
                                    duration: service.czasTrwania,
                                    price: service.cena,
                                    notes: '',
                                    typeKey: '',
                                    serviceKey: service.id,
                                    serviceName: service.usluga.nazwa,
                                    doctorKey: d.id,
                                    doctorName: d.title +" "+d.name+" "+d.surname,
                                };
                            });
                        })
                    );
                })
            )
        );
        iter = iter + DAY_TO_MILIS;
    }
    
    return flatten(appointments);
}

export const deleteSlotsInActive = async () => {
    console.log('deleteSlotsInActive')
    const objectsID = []
    await index.browseObjects({
        query: '',
        filters: `date < ${new Date().getTime()}`,
        batch: batch => {
            objectsID.push(batch)
        }
      });
      await index.deleteObjects(objectsID[0].map(e => e.objectID));
}

export const exportSots = async () => {
    console.log('export data')
    const today = new Date()
       const slots =await getSlots(today, new Date(today.getFullYear(), today.getMonth() + 3, today.getDate(),0,0));
       const err = index.replaceAllObjects(slots, { autoGenerateObjectIDIfNotExist: true })
        .then(({ objectIDs }) => console.log(objectIDs)).catch(err => err);
        if(err) {
            return err;
        }
        return slots;
}