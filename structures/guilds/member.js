import axios from 'axios';
import {guildRole, guildMemberRoleManager} from "./guildRoles.js";
// https://discord.com/developers/docs/resources/guild#modify-guild-member


export default class member {
    /** @type {Object} */
    user;

    /** @type {guildMemberRoleManager} */
    roles;

    /** @type {String} */
    premium_since;

    /** @type {Boolean} */
    pending;

    /** @type {String} */
    nick;

    /** @type {Boolean} */
    mute;

    /** @type {Strnig} */
    joined_at;

    /** @type {Number} */
    flags;

    /** @type {Boolean} */
    deaf;

    /** @type {String} */
    communication_disabled_until;

    /** @type {String} */
    avatar;

    constructor(o, roles) {
        this.roles = roles;
        for (const k in this) {
            if (o[k] && k != 'roles') {
                this[k] = o[k];
            }
        }
    }
}