"use strict";

function formatDate(y, m, d) {
    if (m < 10) {
        if (d < 10) {
            return y.toString() + '0' + m + '0' + d;
        }
        else {
            return y.toString() + '0' + m + d;
        }
    }
    else if (d < 10) {
        return y.toString() + m + '0' + d;
    }

    return y.toString() + m + d;
}

exports.formatDate = formatDate;