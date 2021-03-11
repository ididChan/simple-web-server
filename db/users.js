var records = [
    { id: 1, username: 'idchannov', password: '123456', displayName: 'IDCHANNOV', emails: [ { value: 'idchannov@express.com' } ] }
  , { id: 2, username: 'id', password: '111111', displayName: 'ID', emails: [ { value: 'id@express.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
