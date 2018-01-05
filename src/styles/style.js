'use strict';

class Style {
    constructor(type, range, data = {}) {
        this.type = type;
        this.range = range;
        this.data = data;
    }

    getType() {
        return this.type;
    }

    getRange() {
        return this.range;
    }

    getData() {
        return this.data;
    }
}

module.exports = Style;
