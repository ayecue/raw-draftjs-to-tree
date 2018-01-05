'use strict';

class Range {
    constructor(offset, length) {
        if (length < 0) {
            throw new Error('Invalid length for range.');
        }

        this.offset = offset;
        this.length = length;
        this.end = offset + length;
    }

    getOffset() {
        return this.offset;
    }

    getLength() {
        return this.length;
    }

    getEnd() {
        return this.end;
    }

    isAffected(range) {
        return this.isTouching(range)
            || this.isOutside(range);
    }

    isEqual(range) {
        return range.offset === this.offset && range.length === this.length;
    }

    isEqualAndOutside(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return (start > targetStart && end === targetEnd)
            || (end < targetEnd && start === targetStart);
    }

    isInside(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return start <= targetStart && end > targetStart
            && start < targetEnd && end >= targetEnd;
    }

    isTouching(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return (start <= targetStart && end > targetStart)
            || (start < targetEnd && end >= targetEnd);
    }

    isWrappingLeft(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return start > targetStart
            && start < targetEnd
            && end >= targetEnd;
    }

    isWrappingRight(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return end < targetEnd
            && start <= targetStart
            && end > targetStart;
    }

    isOutside(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return start > targetStart && end < targetEnd;
    }

    isWrapping(range) {
        return this.isOutside(range)
            || this.isWrappingLeft(range)
            || this.isWrappingRight(range);
    }

    isEmpty() {
        return this.length === 0;
    }

    isConnectingTo(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        return end === targetStart
            || targetEnd === start;
    }

    join(range) {
        if (!this.isConnectingTo(range)) {
            throw new Error('You cannot join two ranges when those are not connecting.');
        }

        const start = this.getOffset();
        const end = this.getEnd();
        const targetStart = range.getOffset();
        const targetEnd = range.getEnd();

        if (end === targetStart) {
            return new Range(start, targetEnd - start);
        }

        return new Range(targetStart, end - targetStart);
    }

    cut(range) {
        const start = this.getOffset();
        const end = this.getEnd();
        let rangePositionStart = range.getOffset();
        let rangePositionEnd = range.getEnd();
        let length = range.getLength();

        //Align range if start or end are not aligned correctly
        if (rangePositionStart < start) {
            rangePositionStart = start;
            length = rangePositionEnd - rangePositionStart;
        }

        if (rangePositionEnd > end) {
            rangePositionEnd = end;
            length = rangePositionEnd - rangePositionStart;
        }

        return [{
            description: 'before',
            range: new Range(start, rangePositionStart - start)
        }, {
            description: 'body',
            range: new Range(rangePositionStart, length)
        }, {
            description: 'after',
            range: new Range(rangePositionEnd, end - rangePositionEnd)
        }].filter((item) => item.range.isEmpty() === false);
    }

    toJSON() {
        return {
            offset: this.offset,
            length: this.length
        };
    }

    clone() {
        return new Range(this.offset, this.length);
    }
}

module.exports = Range;
