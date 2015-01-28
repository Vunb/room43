/**
 * Created by Vunb on 9/9/2014.
 */

var express = require('express');
var router = express.Router();


/* GET front page. */
router.get('/ie', function(req, res) {
    res.render('errors/ie', { title: 'Snailcom'});
});

module.exports = router;
