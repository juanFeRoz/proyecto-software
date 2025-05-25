import { Injectable } from '@angular/core';
import { loadGapiInsideDOM, gapi } from 'gapi-script';


@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private CLIENT_ID = '1066874088782-be6vs5lefuvboq2nqhap203sf3nfs8ek.apps.googleusercontent.com';
  private SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  constructor() {
    this.initClient();
  }

  async initClient() {
    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        clientId: this.CLIENT_ID,
        scope: this.SCOPES
      });
    });
  }

  signIn(): Promise<gapi.auth2.GoogleUser> {
    return gapi.auth2.getAuthInstance().signIn();
  }

  signOut(): Promise<void> {
    return gapi.auth2.getAuthInstance().signOut();
  }

  isSignedIn(): boolean {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  async createEvent(summary: string, startDate: string, endDate: string): Promise<string> {
  await gapi.client.load('calendar', 'v3');
  const event = {
    summary,
    start: { dateTime: startDate },
    end: { dateTime: endDate },
  };

  const response = await (gapi.client as any).calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });

  return response.result.id;
  }

  async deleteEvent(eventId: string): Promise<void> {
  await gapi.client.load('calendar', 'v3');
  await (gapi.client as any).calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });
  }
}