export class DataManager {
    /** @type {import('./client/client.js').Client} */
    client;

    constructor(c) { this.client = c; Object.defineProperty(this, 'client', { enumerable: false }); }
}