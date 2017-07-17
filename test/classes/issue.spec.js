import 'babel-polyfill';
import '../../src/models/db.model';
import mochaAsPromised from 'mocha-as-promised';
import chaiAsPromised from 'chai-as-promised';
import Issue from '../../src/classes/issue';
import IssueModel from '../../src/models/issue.model';
import * as chai from 'chai';

mochaAsPromised();
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Issue class', () => {
    describe('create()', () => {
        afterEach(() => {
            return IssueModel.remove({});
        });

        it('should be defined', () => {
            let issue = new Issue('', '', '');
            expect(issue.create).to.exist;
        });

        it('should create an issue "Rick smells bad"', () => {
            let issue = new Issue('Rick smells bad', 'Content Cop', 'SmellyRick');
            return issue.create().then(() => {
                return IssueModel.findOne({title: 'SmellyRick'}).then(issue => {
                    expect(issue.title).to.equal('CleanRick');
                    expect(issue.problem).to.equal('Rick smells good');
                    expect(issue.author).to.equal('Content Cop');
                });
            });
        });
    });

    describe('update()', () => {
        afterEach(() => {
            return IssueModel.remove({});
        });

        it('should be defined', () => {
            let issue = new Issue('', '', '');
            expect(issue.update).to.exist;
        });

        it('should create and update an issue', () => {
            let newIssue = new Issue('Rick smells bad', 'Content Cop', 'SmellyRick2');
            return newIssue.create().then(() => {
                return Issue.get('SmellyRick2').then((issue) => {
                    issue.solve = 'Make him take a bath';

                    return issue.update().then(() => {
                        return IssueModel.findOne({ title: 'SmellyRick2' }).then(issue => {
                            expect(issue.solve).to.equal('Make him take a bath');
                        });
                    })
                });

            });
        });
    });

    describe('get()', () => {
        afterEach(() => {
            return IssueModel.remove({});
        });

        it('should be defined', () => {
            expect(Issue.get).to.exist;
        });

        it('should get an issue by name', () => {
            let issue = new Issue('Rick smells bad', 'Content Cop', 'SmellyRick');
            return issue.create().then(() => {
                return Issue.get(issue.title).then(issue => {
                    expect(issue.title).to.equal('SmellyRick');
                });
            });
        });
    });

    describe('getAll()', () => {
        afterEach(() => {
            return IssueModel.remove({});
        });

        it('should be defined', () => {
            expect(Issue.get).to.exist;
        });

        it('should get all issues', () => {
            let issue1 = new Issue('Rick smells bad', 'Content Cop', 'SmellyRick');
            let issue2 = new Issue('SQL sucks', 'Content Cop', 'SQL');
            return issue1.create().then(() => {
                return issue2.create().then(() => {
                    return Issue.getAll().then(issues => {
                        expect(issues[0].title).to.equal('SmellyRick');
                        expect(issues[1].title).to.equal('SQL');
                    });
                });
            });
        });
    });
});