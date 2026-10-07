import test from 'node:test';
import assert from 'node:assert/strict';
import {monthDays,shiftMonth,proposedTimes,bookingMessage,requestMailto,tentativeCalendar} from '../src/lib/booking.mjs';
test('calendrier lundi en premier, année bissextile et changement d’année',()=>{
 assert.equal(monthDays('2024-02').days.length,29);
 assert.equal(monthDays('2026-10').offset,3);
 assert.equal(shiftMonth('2026-12',1),'2027-01');assert.equal(shiftMonth('2027-01',-1),'2026-12');
});
test('créneaux de Lomé : pas de dimanche, de date invalide, de passé ou hors horizon',()=>{
 const now=new Date('2026-10-07T10:05:00Z');
 assert.equal(proposedTimes('2026-10-04',now).length,0);
 assert.equal(proposedTimes('2026-10-11',now).length,0);
 assert.equal(proposedTimes('2026-02-30',now).length,0);
 assert.equal(proposedTimes('2027-05-03',now).length,0);
 assert.equal(proposedTimes('2026-10-07',now)[0],'10:30');
 assert.ok(proposedTimes('2026-10-08',now).includes('09:00'));
});
const fields={day:'2026-10-08',time:'09:00',name:'Client test',email:'test@example.com',service:'Identité, visuelle; projet\nSuite',message:'Bonjour & merci !'};
test('demande email correctement encodée et jamais annoncée comme réservée',()=>{
 const href=requestMailto('joackimdate1@gmail.com',fields),url=new URL(href);
 assert.match(url.searchParams.get('body'),/Bonjour & merci !/);
 assert.match(bookingMessage(fields),/Ce créneau n’est pas réservé/);
 assert.match(url.searchParams.get('subject'),/8 octobre 2026/);
});
test('agenda : UTC, durée 30 min, proposition non bloquante et contenu échappé',()=>{
 const ics=tentativeCalendar(fields,new Date('2026-10-07T12:00:00Z'));
 assert.match(ics,/DTSTART:20261008T090000Z/);assert.match(ics,/DTEND:20261008T093000Z/);
 assert.match(ics,/STATUS:TENTATIVE/);assert.match(ics,/TRANSP:TRANSPARENT/);
 assert.match(ics,/Identité\\, visuelle\\; projet\\nSuite/);
 for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75,'Lignes compatibles avec le format ICS');
});
