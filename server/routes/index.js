var express = require('express');
var router = express.Router();

// DONT SUPPORT IE BROWSER
router.use(function (req, res, next) {
    if (req.headers['user-agent'].indexOf("MSIE") >= 0)
        res.redirect("/error/ie");
    else
        next();
});

/* GET home page. */
router.get('/*', function (req, res) {
    res.render('index', { title: 'Snailcom'});
});

module.exports = router;
