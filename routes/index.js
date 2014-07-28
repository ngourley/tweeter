module.exports.index = function (req, res) {
    res.render('index', {});
};

module.exports.partials = function (req, res) {
    var partial = req.params.name;
    res.render('partials/' + partial);
};