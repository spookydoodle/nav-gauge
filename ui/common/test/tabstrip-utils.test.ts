import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getVisibleTabCount, getVisibleTabIndexes } from '../src/hud/tabstrip';

describe('getVisibleTabCount', () => {
    it('shows all tabs when they fit without overflow', () => {
        expect(getVisibleTabCount([50, 80, 60], 190, 40)).to.equal(3);
    });

    it('reserves the overflow trigger when tabs do not fit', () => {
        expect(getVisibleTabCount([50, 80, 60], 150, 40)).to.equal(1);
    });

    it('shows only overflow when no tab fits beside its trigger', () => {
        expect(getVisibleTabCount([80, 60], 100, 40)).to.equal(0);
    });
});

describe('getVisibleTabIndexes', () => {
    it('keeps original order when all tabs fit', () => {
        expect(getVisibleTabIndexes([50, 80, 60], 190, 40, 2)).to.deep.equal([0, 1, 2]);
    });

    it('keeps the prefix when the selected tab is already visible', () => {
        expect(getVisibleTabIndexes([50, 80, 60], 150, 40, 0)).to.deep.equal([0]);
    });

    it('pins an overflowed selected tab before other fitting tabs', () => {
        expect(getVisibleTabIndexes([50, 40, 60, 100], 150, 40, 2)).to.deep.equal([2, 0]);
    });

    it('uses the selected tab width when fitting other tabs', () => {
        expect(getVisibleTabIndexes([40, 40, 90, 100], 170, 40, 2)).to.deep.equal([2, 0]);
    });

    it('shows only the selected tab when only it fits beside overflow', () => {
        expect(getVisibleTabIndexes([80, 60], 100, 40, 1)).to.deep.equal([1]);
    });

    it('overflows all tabs when the selected tab cannot fit', () => {
        expect(getVisibleTabIndexes([80, 60], 90, 40, 1)).to.deep.equal([]);
    });
});
