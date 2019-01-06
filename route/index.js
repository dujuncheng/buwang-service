const AddNewBlog                = require('../handler/AddNewBlog.js');
const AddNewCatalog             = require('../handler/AddNewCatalog.js');
const ChangeOldBlog             = require("../handler/ChangeOldBlog.js");
const DeleteFile                = require("../handler/DeleteFile.js");
const UpdateBlogNamePath        = require("../handler/UpdateBlogNamePath.js");
const FetchBlogArr              = require("../handler/FetchBlogArr.js");
const HasReviewThis             = require("../handler/HasReviewThis.js");
const FetchAllBlogArr           = require("../handler/FetchAllBlogArr.js");
const CancelReviewThis          = require("../handler/CancelReviewThis.js");

const route = async (ctx, next) => {
    let method = ctx.request.query.method || ctx.request.body.method;
    if (method === 'addNewNote') {
        return await (new AddNewBlog()).handler(ctx, next);
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
    } else if (method === 'AddNewCatalog') {
        return await (new AddNewCatalog()).handler(ctx, next);
    }
}


// export {route};

module.exports = route;
