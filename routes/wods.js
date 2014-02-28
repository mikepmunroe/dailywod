exports.findAll = function(req, res) {
    res.send([{name:'wod1'}, {name:'wod2'}, {name:'wod3'}]);
};

exports.findById = function(req, res) {
    res.send({id:req.params.id, name: "Name", description: "description"});
};