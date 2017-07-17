import 'babel-polyfill';
import '../../src/models/db.model';
import mochaAsPromised from 'mocha-as-promised';
import chaiAsPromised from 'chai-as-promised';
import Retro from '../../src/classes/retrospective';
import RetroModel from '../../src/models/retro.model';
import * as chai from 'chai';

mochaAsPromised();
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Retro class', () => {
    describe('get()', () => {
        it('should be defined', () => {
            expect(Retro.get).to.exist;
        });

        it('should return the current Retrospective', () => {
            return Retro.get().then(retro => {
                expect(retro.current).to.equal(true);
            });
        });
    });

    describe('', () => {

    });
});