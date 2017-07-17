import request from 'request-promise';

export default class Retrospective {
    constructor(startDate = Date.now(), id = null) {
        this._start_date = startDate;
        this._id = id;
        this._end_date = null;
        this._current = true;
        this._issues = [];
        this._chat_log = '';
    }

    static async get() {
        let getRetro;

        try {
            getRetro = await request({
                json: true,
                url: `http://localhost:4000/api/current-retro`
            });
        } catch (e) {
            throw new Error(e);
        }

        return new Retrospective(getRetro.start_date, getRetro._id);
    }

    async create() {
        let body = {};
        body.current = this.current;
        body.start_date = this.start_date;

        try {
            await request({
                method: 'POST',
                url: 'http://localhost:4000/api/create-retro',
                json: true,
                body
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async update() {
        let body = {
            start_date: this.start_date,
            end_date: this.end_date,
            current: this.current
        };

        try {
            await request({
                method: 'POST',
                url: `http://localhost:4000/api/update-retro/${this.id}`,
                json: true,
                body
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    get start_date() {
        return this._start_date;
    }

    set start_date(value) {
        this._start_date = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get current() {
        return this._current;
    }

    set current(value) {
        this._current = value;
    }

    get end_date() {
        return this._end_date;
    }

    set end_date(value) {
        this._end_date = value;
    }

    get issues() {
        return this._issues;
    }

    set issues(value) {
        this._issues = value;
    }

    get chat_log() {
        return this._chat_log;
    }

    set chat_log(value) {
        this._chat_log = value;
    }
}