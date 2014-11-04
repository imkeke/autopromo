
/*
 * GET home page.
 */

var util = require('util')
  , formidable = require('formidable')
  , fs = require('fs')
  , imagemagick = require('imagemagick')
  , sizeOf = require('image-size')
  , Mustache = require('mustache')

exports.index = function(req, res){
  res.render('index', {
    title: 'image map tool'
  });
};

exports.up = function(req, res) {
  var isAjaxUpload = req.get('X-Requested-With') === 'XMLHttpRequest'
  var form = new formidable.IncomingForm();

  form.uploadDir = './public/images/uploads/' || process.cwd();
  form.keepExtensions = true;

  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
      res.end('error occur');
      return;
    }

    // 统一转换成 jpg
    var path = files.pic.path
      , expath = path.split('.')[0].split('/')
      , newname = expath[expath.length - 1] + '.jpg'

    imagemagick.convert([files.pic.path, '-crop', '1920x400', '-quality', '100', 'public/images/uploads/' + newname], function(err, stdout) {
        if (err) throw err;

        console.log(util.inspect(stdout));
        sizeOf(files.pic.path, function(err, metadata) {
          if (err) throw err;

          var smpic = {
            width: metadata.width,
            height: metadata.height,
            pics: []
          }

          var smpiclength = parseInt(metadata.height / 400)

          if (smpiclength === 0) {
              smpic.pics[0] = '/images/uploads/' + newname;
          } else {
              for (var i = 0; i <= parseInt(metadata.height / 400); i++) {
                  smpic.pics[i] = '/images/uploads/' + newname.replace('.jpg', '-' + i + '.jpg');
              }

          }

          res.render('index', {
              pic: files.pic.path.split('public')[1],
              smpic: smpic,
              name: newname.replace('.jpg', '')
          }, isAjaxUpload && function(err, html) {
            if (err) throw err
            res.json({html: html.split(/(<body>|<\/body>)/gi)[2]})
          })

        })

    })
  })

  form.on('end', function(err, fields, files) {
  });
};

exports.generate = function(req, res) {
  var name = req.param('name')
    , data = req.body
    , path = 'public/html/' + name + '.html'

  fs.readFile('public/template/template.html', function(err, tpl) {
    if (err) throw err

    var output = Mustache.to_html(tpl.toString(), data).replace(/&#x2F;/g, '/')

    fs.writeFile(path, output, function(err) {
      if (err) throw err
      res.json({
        succ: true,
        html: output,
        path: '/html/' + name + '.html'
      })
    })

  })

};
