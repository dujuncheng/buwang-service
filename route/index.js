const addNewNote              = require('../handler/AddNewNote.js');
const AddNewCatalog           = require('../handler/AddNewCatalog.js');
const GetCatalog                = require('../handler/GetCatalog.js');
const GetNoteList               = require('../handler/GetNoteList.js');
const MoveCatalog               = require('../handler/MoveCatalog.js');
const RemoveCatalog             = require('../handler/RemoveCatalog.js');
const RenameCatalog             = require('../handler/RenameCatalog.js');
const ChangeNote                = require("../handler/ChangeNote.js");
const DeleteNote                = require("../handler/DeleteNote.js");
const GetReviewList             = require("../handler/GetReviewList.js");
const HasReviewThis             = require("../handler/HasReviewThis.js");
const SetFrequency           = require("../handler/SetFrequency.js");
const SetReviewThis          = require("../handler/SetReviewThis.js");

const route = async (ctx, next) => {
    let method = ctx.request.query.method || ctx.request.body.method;
    if (method === 'add_note') {
        return await (new addNewNote()).handler(ctx, next);
    } else if (method === 'get_note_list') {
        return await (new GetNoteList()).handler(ctx, next);
    } else if (method === 'change_arr') {
        return await (new ChangeNote()).handler(ctx, next);
    } else if (method === 'delete_note') {
        return await (new DeleteNote()).handler(ctx, next);
    } else if (method === 'get_review_list') {
        return await (new GetReviewList()).handler(ctx, next);
    } else if (method === 'review_this') {
        return await (new HasReviewThis()).handler(ctx, next);
    } else if (method === 'add_catalog') {
        return await (new AddNewCatalog()).handler(ctx, next);
    } else if (method === 'get_catalog') {
        return await (new GetCatalog()).handler(ctx, next);
    } else if (method === 'move_catalog') {
        return await (new MoveCatalog()).handler(ctx, next);
    } else if (method === 'rename_catalog') {
        return await (new RenameCatalog()).handler(ctx, next);
    } else if (method === 'remove_catalog') {
        return await (new RemoveCatalog()).handler(ctx, next);
    } else if (method === 'set_review') {
        return await (new SetReviewThis()).handler(ctx, next);
    } else if (method === 'set_frequency') {
        return await (new SetFrequency()).handler(ctx, next);
    }
}


// export {route};

module.exports = route;
