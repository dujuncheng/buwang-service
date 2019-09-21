const addNewNote = require('../handler/AddNewNote.js');
const AddNewCatalog = require('../handler/AddNewCatalog.js');
const GetCatalog = require('../handler/GetCatalog.js');
const GetNoteList = require('../handler/GetNoteList.js');
const MoveCatalog = require('../handler/MoveCatalog.js');
const RemoveCatalog = require('../handler/RemoveCatalog.js');
const RenameCatalog = require('../handler/RenameCatalog.js');
const ChangeNote = require('../handler/ChangeNote.js');
const DeleteNote = require('../handler/DeleteNote.js');
const GetReviewList = require('../handler/GetReviewList.js');
const HasReviewThis = require('../handler/HasReviewThis.js');
const SetFrequency = require('../handler/SetFrequency.js');
const SetReviewThis = require('../handler/SetReviewThis.js');
const Register = require('../handler/Register.js');
const Login = require('../handler/Login.js');
const GetContent = require('../handler/GetContent.js');
const SetPublish = require('../handler/SetPublish.js');

const map = {
  add_note: addNewNote,
  get_note_list: GetNoteList,
  change_arr: ChangeNote,
  delete_note: DeleteNote,
  get_review_list: GetReviewList,
  add_catalog: AddNewCatalog,
  get_catalog: GetCatalog,
  move_catalog: MoveCatalog,
  review_this: HasReviewThis,
  rename_catalog: RenameCatalog,
  remove_catalog: RemoveCatalog,
  set_review: SetReviewThis,
  set_frequency: SetFrequency,
  set_publish: SetPublish,
  register: Register,
  login: Login,
  get_content: GetContent,
};

const route = async (ctx, next) => {
  const method = ctx.request.query.method || ctx.request.body.method;

  if (map[method]) {
    return await (new map[method]()).handler(ctx, next);
  }
};


module.exports = route;
