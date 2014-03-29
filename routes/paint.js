
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('paint/index', { title: 'Paint' });
};