const opts = require('./clientOpts.js');
const gateWayIntents = require('../gateway/intents.js');
const gateWayEvents = require('../gateway/dispatch.js');
var WebSocketClient = require('websocket').client;
const WebSocketConnection = require('websocket').connection;
const handleResponses = require('./handleEvents.js');
const { EventEmitter } = require('events');



class Client extends EventEmitter {
    /** @type {WebSocketClient} */
    ws;

    /** @type {Number} */
    heartBeatInterval;

    /** @type {Array<opts.intents>} */
    gwintents;
    
    /** @type {String} */
    #token;

    /** @type {WebSocketConnection}*/
    connection;

    /** @type {Object} */
    user_settings;
    
    /** @type {Object} */
    user_profile;


    /**
     * @param {opts} input 
     */
    constructor(input) {
        super();
        this.gwintents = input.intents;
    }

    /**
     * @param {Number} hbint
     */
    async #startHeartBeat(hbint)
    {
        this.heartBeatInterval = hbint;
        console.log("INTERVAL SET TO: " + this.heartBeatInterval);

        //Get the user intents
        let iCount = 0;
        for (let i of this.gwintents) {
            iCount += (i) ? i : 0;
        }

        var idObj = {
            op: 2,
            d: {
                token: this.#token,
                intents: this.gwintents.value, //61440,
                properties: {
                    os: "linux",
                    browser: "ion_",
                    device: "my_library"
                }
            }
        };

        this.connection.send(JSON.stringify(idObj));
    }


    messageRecieved(msg) {
        this.emit("messageRecieved", msg);
    }

    ready() {
        this.emit('ready');
    }

    customError(err) {
        this.emit('error', err);
    }


    /**
     * @param {String} token
     */
    async login(token) {
        this.ws = new WebSocketClient({maxReceivedFrameSize: Infinity});
        this.#token = token;

        this.ws.on('connect', async (connection) => {
            connection.on('message', async (msg) => {
                const data = JSON.parse(msg.utf8Data);

                const response = await handleResponses(data);

                if (response.op == 10) { this.#startHeartBeat(response.heartBeat, token); }
                else if (response.op == 0) {
                    if (response.t == gateWayEvents.Ready) {
                        this.user_profile = response.profile;
                        this.user_settings = response.config;
                        this.ready();
                    }
                    else if (response.t == gateWayEvents.MessageCreate) {
                        this.messageRecieved(response.message);
                    }
                    else console.log(response.t);
                } else {
                    console.log(response.t);
                }
            });

            connection.on('close', (code, desc) => {
                console.log(`CONNECTION CLOSED WITH CODE ${code}\nREASON:\n ${desc}`);
            });

            this.connection = connection;
        });

        this.ws.on('connectFailed', (err) => { console.error(err); })

        this.ws.connect("wss://gateway.discord.gg/?v=10&encoding=json");
    }
}


//All client properties will be re-routed through this export
module.exports = { Client, gateWayIntents }