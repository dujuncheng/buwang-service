
const dbConf = {
  dbName: 'notebook',
  reviewTableField: ['birth_time', 'name', 'file_path', 'notify_time', 'has_review', 'is_changed', 'content', 'state', 'gmt_create', 'gmt_modify'],
  catalogTableField: ['id', 'catalog_id', 'user_id', 'parent_id', 'name', 'state', 'gmt_create', 'gmt_modify'],
  noteTableField: [
    'id',
    'note_id',
    'user_id',
    'catalog_id',
    'title',
    'content',
    'need_review',
    'notify_time',
    'frequency',
    'review_num',
    'state',
    'gmt_create',
    'gmt_modify'
  ],
  userTableField: ['id', 'email', 'password', 'nickname', 'avatar', 'status', 'gmt_create', 'gmt_modified'],
};


module.exports = dbConf;
