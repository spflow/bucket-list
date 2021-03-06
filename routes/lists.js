var express = require('express');
var router = express.Router();
var List = require('../models/list.js');
var Item = require('../models/item.js');

// using url query instead of url params

// router.get('/', function(req, res) {
//   var query = List.find({});
//   query.where('bucketId', req.query.bucketId);
//   query.exec( function(err, lists) {
//     res.json(lists);
//   });
// });

router.get('/:id', function(req, res) {
  var query = List.find({});
  query.where('bucketId', req.params.id);
  query.exec( function(err, lists) {
    res.json(lists);
  });
});

router.post('/', function(req, res) {
  new List({
    title: req.body.title,
    bucketId: req.body.bucketId
  }).save(function(err, list) {
    res.json(list);
  });
});

router.delete('/:id', function(req, res) {
  List.findById(req.params.id, function(err, list) {
    list.remove();
    Item.find({listId: req.params.id}).remove()
      .exec(function(err, item) {
        res.status(200).send({success:true});
      });
  });
});

module.exports = router;
