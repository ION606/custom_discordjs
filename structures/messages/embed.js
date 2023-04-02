import colConvert from '../../utils/color_functions.js';

export class Embed {
    /** @type {Number} */
    color;
    
    /** @type {String} */
    title;

    /** @type {String} */
    description;

    /** @type {String} */
    url;

    /** @type {{name: String, iconUrl: String, url: String}} */
    author;

    /** @type {[{name: String, value: String, inline?: Boolean}]} */
    fields;

    /** @type {String} */
    image;

    /** @type {String} */
    thumbnail;

    /** @type {Boolean} */
    attatchTimeStamp;

    /** @type {{text: String, iconUrl: String}} */
    footer;

    //#region Setters
    
    /**
     * @param {String} colorStr 
     */
    setColor(colorStr) {
        this.color = colConvert(colorStr);
        return this;
    }

    /**
     * @param {String} title 
     */
    setTitle(title) {
        this.title = title;
        return this;
    }

    /**
     * @param {String} desc 
     */
    setDescription(desc) {
        this.description = desc;
        return this;
    }

    /**
     * @param {String} url 
     */
    setUr(url) {
        this.url = url;
        return this;
    }

    /**
     * @param {{name: String, iconUrl: String, url: String}} author
     */
    setAuthor(author) {
        this.author = author;
        return this;
    }

    /**
     * @param {[{name: String, value: String, inline?: Boolean}]} fields 
     */
    setFields(fields) {
        this.fields = fields;
        return this;
    }

    /**
     * @param {String} url 
     */
    setImage(url) {
        this.image = url;
        return this;
    }

    /**
     * @param {String} url 
     */
    setThumbnail(url) {
        this.thumbnail = url;
        return this;
    }

    setTimeStamp() {
        this.attatchTimeStamp = !this.attatchTimeStamp;
        return this;
    }

    /**
     * @param {{text: String, iconUrl: String}} footer 
     */
    setFooter(footer) {
        this.footer = footer;
        return this;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        var retObj = {};
        for (const k in this) {
            if (this[k] != undefined) retObj[k] = this[k];
        }

        return retObj;
    }
    //#endregion
}