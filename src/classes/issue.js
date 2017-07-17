import request from 'request-promise';

export default class Issue {
    //TODO: Add issue type, ie straw, stick, or brick
    constructor(problem, author, title, solve = null, retrospective_id = null, id = null) {
        this._problem = problem;
        this._author = author;
        this._title = title;
        this._solve = solve;
        this._retrospective_id = retrospective_id;
        this._id = id;
    }

    async create() {
        let body = {};

        body.problem = this.problem;
        body.author = this.author;
        body.title = this.title;

        try {
            await request({
                method: 'POST',
                url: 'http://localhost:4000/api/create-issue',
                json: true,
                body
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async update() {
        let body = {
            problem: this.problem,
            author: this.author,
            title: this.title,
            solve: this.solve
        };

        try {
            await request({
                method: 'POST',
                url: `http://localhost:4000/api/update-issue/${this.id}`,
                json: true,
                body
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    static async get(id) {
        let getIssue;

        try {
            getIssue = await request({
                json: true,
                url: `http://localhost:4000/api/issue/${id}`
            });

        } catch (e) {
            throw new Error(e);
        }

        return new Issue(getIssue.problem, getIssue.author, getIssue.title, getIssue.solve, getIssue.retrospective, getIssue._id);
    }

    static async getAll() {
        let issueList;

        try {
            issueList = await request({
                json: true,
                url: 'http://localhost:4000/api/issue-list'
            });
        } catch (e) {
            throw new Error(e);
        }

        return issueList.map(issue => {
            return new Issue(issue.problem, issue.author, issue.title, issue.solve, issue.retrospective, issue._id);
        });
    }

    get problem() {
        return this._problem;
    }

    set problem(value) {
        this._problem = value;
    }

    get solve() {
        return this._solve;
    }

    set solve(value) {
        this._solve = value;
    }

    get retrospective_id() {
        return this._retrospective_id;
    }

    set retrospective_id(value) {
        this._retrospective_id = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}