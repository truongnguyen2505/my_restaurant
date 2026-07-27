import { HttpClient } from "./http-client.js";

export class BookingApi {

    static async create(payload) {

        return HttpClient.request("/api/bookings", {

            method: "POST",

            body: JSON.stringify(payload)

        });

    }

}