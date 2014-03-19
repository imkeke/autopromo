
/*
 * GET home page.
 */

var util = require('util')
  , formidable = require('formidable')
  , fs = require('fs')
  , imagemagick = require('imagemagick')
  , sizeOf = require('image-size');

exports.index = function(req, res){
  res.render('index', {
    title: '专题生成器'
  });
};

exports.up = function(req, res) {
  var form = new formidable.IncomingForm();

  form.uploadDir = './public/images/uploads/' || process.cwd();
  form.keepExtensions = true;

  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
      res.end('出错了');
      return;
    }
    // fs.rename(files.pic.path, './public/uploads/' + files.pic.name);
    imagemagick.convert([files.pic.path, '-crop', '1920x150', 'public/images/uploads/' + files.pic.name], function(err, stdout) {
        if (err) throw err;

        console.log(util.inspect(stdout));
        sizeOf(files.pic.path, function(err, metadata) {
          if (err) throw err;

          var smpic = {
            width: metadata.width,
            height: metadata.height,
            pics: []
          }
          
          for (var i = 0; i <= parseInt(metadata.height / 150); i++) {
            smpic.pics[i] = '/images/uploads/' + files.pic.name.replace('.jpg', '-' + i + '.jpg');
          }

          res.render('index', {
              pic: files.pic.path.split('public')[1],
              smpic: smpic,
              name: files.pic.name
          })

        })

    })
  })

  form.on('end', function(err, fields, files) {
  });
};

exports.generate = function(req, res) {
  var name = req.param('name')
    , html = req.param('html')
    , path = 'public/html/' + name + '.html'

  fs.writeFile(path, html, function(err) {
    if (err) throw err
    res.json({
      succ: true,
      html: html,
      path: '/html/' + name + '.html'
    })
  })
};
