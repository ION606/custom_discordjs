import gateWayEvents from '../gateway/dispatch.js';
//import WebSocketClient from 'websocket';
//import WebSocketConnection from 'websocket';
import WebSocket from 'ws';
import handleResponses from './handleEvents.js';
import { EventEmitter } from 'events';
import axios from 'axios';
import { exit } from 'process';
import Guild from '../guilds/Guild.js';
import user from '../messages/User.js';



export class Client extends EventEmitter {
    /** @type {WebSocket} */
    ws;

    /** @type {Number} */
    heartBeatInterval;

    /** @type {gateWayEvents[]} */
    gwintents;
    
    /** @type {String} */
    #token;
    
    /** @type {String} */
    id;

    /** @type {WebSocketConnection}*/
    connection;

    /** @type {Object} */
    user_settings;
    
    /** @type {Object} */
    user_profile;

    /** @type {Map<String, Guild>} */
    guilds;


    /**
     * @param {opts} input 
     */
    constructor(input) {
        super();
        this.gwintents = input.intents;
        this.guilds = new Map();
    }

    async #heartbeat(hbInt, hbSequence) {
        const toSend = JSON.stringify({ op: 1, d: 0 });
        this.ws.send((toSend));
        
        setInterval(() => {
            this.ws.send(toSend);
        }, hbInt);
    }

    /**
     * @param {Number} hbint
     */
    async #startHeartBeat(hbint)
    {
        this.heartBeatInterval = hbint;
        console.log("INTERVAL SET TO: " + this.heartBeatInterval);
        this.#heartbeat(hbint);
    }


    //#region Event Emitters
    messageRecieved(msg) {
        this.emit("messageRecieved", msg);
    }

    ready() {
        this.emit('ready');
    }

    customError(err) {
        this.emit('error', err);
    }

    interactionRecieved(interaction) {
        this.emit('interactionRecieved', interaction);
    }

    /**
     * @param {Guild} guild 
     */
    guildCreate(guild) {
        if (!this.guilds.has(guild.id)) {
            this.guilds.set(guild.id, guild);
            this.emit('guildCreate', guild);
        }
    }

    guildDelete(guild) {
        this.emit('guildDelete', guild);
    }

    guildMemberAdd(member) {
        this.emit('guildMemberAdd', member);
    }
    //#endregion


    /**
     * @param {String} token
     */
    async login(token, isUser = false) {
        if (!isUser) token = "Bot " + token;
        
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
            this.#token = token;

            this.ws.on('open', () => {
                //Get the user intents
                let iCount = 0;
                for (let i of this.gwintents) {
                    iCount += (i) ? i : 0;
                }
                
                var idObj = {
                    op: 2,
                    d: {
                        token: token.replace("Bot ", ""),
                        intents: iCount, //61440,
                        properties: {
                            os: "linux",
                            browser: "ion_",
                            device: "my_library"
                        }
                    }
                };
        
                this.ws.send(JSON.stringify(idObj));
            });

            this.ws.on('message', async (msg) => {
                const data = JSON.parse(msg.toString());
                const response = await handleResponses(data, token, this.id);

                if (response.op == 10) { this.#startHeartBeat(response.heartBeat, token); }
                else if (response.op == 0) {
                    if (response.t == gateWayEvents.Ready) {
                        this.user_profile = response.profile;
                        this.user_settings = response.config;
                        this.id = response.profile.id;
                        // console.log(response.guilds);
                        this.ready();
                    }
                    else if (response.t == gateWayEvents.MessageCreate) {
                        if (data["d"]["author"]["id"] != this.user_profile.id){
                            response.message.guild = this.guilds.get(response.message.guild_id);
                            this.messageRecieved(response.message);
                        }
                    }
                    else if (response.t == gateWayEvents.InteractionCreate) {
                        if (data["d"]["member"] && data["d"]["member"]["id"] != this.user_profile.id) {
                            response.interaction.guild = this.guilds.get(response.interaction.guild_id);
                            response.interaction.user = new user(data["d"]["member"]["user"]);
                            this.interactionRecieved(response.interaction);
                        }
                        else if (data["d"]["user"]["id"] != this.user_profile.id) {
                            this.interactionRecieved(response.interaction);
                        }
                    }
                    else if (response.t == gateWayEvents.GuildCreate) this.guildCreate(response.guild);
                    else if (response.t == gateWayEvents.GuildDelete) this.guildDelete(response.guild);
                    else if (response.t == gateWayEvents.GuildMemberAdd) this.guildMemberAdd(response.member);
                    // else console.log(response.t);
                } else {
                    // commmented to avoid heartbeats
                    // console.log(response.t);
                }
            });

            this.ws.on('close', (code, desc) => {
                console.log(`CONNECTION CLOSED WITH CODE ${code}\nREASON:\n ${desc}`);
                exit(1);
            });

            this.ws.on('error', (err) => {
                reject(err);
            });

            this.ws.on('error', (err) => { reject(err); });
        });
    }
}


//All client properties will be re-routed through this export
export {gateWayIntents} from '../gateway/intents.js';