"use strict";

// Capture the status of the wiki
var pages = {};

/**
 * Reset all previous processing of edits
 */
function reset() {
    pages = {};
}

/**
 * Process data structure representing edit
 *
 * @param {Object} edit
 */
function process(edit) {
    var page;
    var id = edit.page_id;
    var ts = edit.rev_timestamp;
    var performer = edit.performer;

    if (edit.meta.topic === 'mediawiki.revision-create' &&
      !performer.user_is_bot && edit.page_namespace === 0
    ) {
        if (pages[id]) {
            pages[id].edits++;
            pages[id].updated = ts;
        } else {
            pages[id] = { id: id, edits: 1, from: ts, updated: ts, title: edit.page_title };
        }
    }
}

/**
 * Return unsorted array of objects representing edit activity on pages
 * @return {Array} of all pages that have been processed
 */
function getPages() {
    return Object.values(pages);
}

module.exports = {
    getPages: getPages,
    process: process,
    reset: reset
};
