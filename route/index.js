const addNewNote                = require('../handler/addNewNote.js');
const AddNewCatalog             = require('../handler/AddNewCatalog.js');
const GetCatalog                = require('../handler/GetCatalog.js');
const GetNoteList               = require('../handler/GetNoteList.js');
const MoveCatalog               = require('../handler/MoveCatalog.js');
const RemoveCatalog             = require('../handler/RemoveCatalog.js');
const RenameCatalog             = require('../handler/RenameCatalog.js');
const ChangeOldBlog             = require("../handler/ChangeOldBlog.js");
const DeleteFile                = require("../handler/DeleteFile.js");
const UpdateBlogNamePath        = require("../handler/UpdateBlogNamePath.js");
const FetchBlogArr              = require("../handler/FetchBlogArr.js");
const HasReviewThis             = require("../handler/HasReviewThis.js");
const FetchAllBlogArr           = require("../handler/FetchAllBlogArr.js");
const CancelReviewThis          = require("../handler/CancelReviewThis.js");

const route = async (ctx, next) => {
    let method = ctx.request.query.method || ctx.request.body.method;
    if (method === 'add_note') {
        return await (new addNewNote()).handler(ctx, next);
    } else if (method === 'changeOldBlog') {
        return await (new ChangeOldBlog()).handler(ctx, next);
    } else if (method === 'deleteFile') {
        return await (new DeleteFile()).handler(ctx, next);
    } else if (method === 'updateBlogNamePath') {
        return await (new UpdateBlogNamePath()).handler(ctx, next);
    } else if (method === 'fetchBlogArr') {
        return await (new FetchBlogArr()).handler(ctx, next);
    } else if (method === 'hasReviewThis') {
        return await (new HasReviewThis()).handler(ctx, next);
    } else if (method === 'fetchAllBlogArr') {
        return await (new FetchAllBlogArr()).handler(ctx, next);
    } else if (method === 'cancelReviewThis') {
        return await (new CancelReviewThis()).handler(ctx, next);
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
    } else if (method === 'get_note_list') {
        return await (new GetNoteList()).handler(ctx, next);
    }
}


// export {route};

module.exports = route;
