export class BaseStruct {
    /** @type {import('./client/client.js').Client} */
    client;

    constructor(c) { this.client = c; }
}