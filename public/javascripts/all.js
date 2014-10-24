"use strict"

$(function() {
  var $box = $('.box')
  $box.on('mousedown', function(event) {
    if (event.button === 2) return

    var $flip = $('<div class="flip"></div>')
      , boxtop = $(this).offset().top
      , boxleft = $(this).offset().left
      , left = event.pageX - boxleft // x 坐标
      , top = event.pageY - boxtop // y 坐标
      , width
      , height

    $flip.css({
      left: left,
      top: top
    })
    $(this).append($flip)

    $(this).on('mousemove', function(eventIn) {
      width = eventIn.pageX - boxleft - left // 绘制宽度
      height = eventIn.pageY - boxtop - top // 绘制高度

      $flip.css({
        width: width,
        height: height
      })
    })

    $(this).one('mouseup', function() {
      $(this).off('mousemove')

      if (!width && !height) { // 如果只点击了一下
        $flip.remove()
        return false
      }

      var url = prompt('Enter URL：')
      $flip.append($('<a href="' + url + '" target="_blank">' + url + '</a>'))
      $flip.append($('<div class="action"><span class="glyphicon glyphicon-edit" title="edit"></span><span class="glyphicon glyphicon-trash" title="delete"></span></div>')) // 丑陋的
      .append('<div class="resize"></div>')
    })

    event.preventDefault()
  })

  // 修改 url
  $box.on('click', '.flip .glyphicon-edit', function(event) {
    var e = $(this).parents('.flip').find('a')
      , o = e.attr('href') // origin href
      , t = e.attr('data-taobao') // origin data-taobao
      , url = prompt('Enter URL：', o)

    e.attr('href', url).attr('data-taobao', taobaourl).text(url)

    event.preventDefault()
  })

  // 删除链接
  $box.on('click', '.flip .glyphicon-trash', function(event) {
    var e = $(this).parents('.flip')

    if (window.confirm('Are you sure？')) {
      e.remove()
    }

    event.preventDefault()
  })
  
  // 移动
  $box.on('mousedown', '.flip', function(event) {
    if (event.button === 2) return

    var e = $(this)
      , left = parseFloat(e.css('left'), 10) // 初始 left
      , top = parseFloat(e.css('top'), 10) // 初始 top
      , x = event.pageX // 鼠标坐标 用来计算划动距离
      , y = event.pageY

    $(document).on('mousemove', function(event) {
      var ix = event.pageX - x // 移动距离 有正负
        , iy = event.pageY - y

      e.css({
          left: left + ix,
          top: top + iy
      })
    }).on('mouseup', function() {
      $(this).off('mousemove')
    })

    event.stopPropagation()
  })

  // resize
  $box.on('mousedown', '.resize', function(event) {
    if (event.button === 2) return

    var e = $(this).parent()
      , width = e.width()
      , height = e.height()
      , x = event.pageX // 鼠标坐标 用来计算划动距离
      , y = event.pageY

    $(document).on('mousemove', function(event) {
      var ix = event.pageX - x
        , iy = event.pageY - y

      $('body').addClass('disable-select')

      e.css({
          width: width + ix,
          height: height + iy
      })
    }).on('mouseup', function() {
      $(this).off('mousemove')
      $('body').removeClass('disable-select')
    })

    event.stopPropagation()
  })

  // 生成 html
  $('.js-generate').on('click', function(event) {
    var data = {
          name: $(this).data('name'),
          width: $box.css('width'),
          height: $box.css('height'),
          images: [],
          links: []
        }
      , pop = window.open('about:blank')

    $.each($box.find('img'), function() {
      var e = $(this)
      data.images.push(e.attr('src'))
    })

    $.each($box.find('.flip'), function(i) {
        var e = $(this)
          , d = {
            width: e.css('width'),
            height: e.css('height'),
            left: e.css('left'),
            top: e.css('top'),
            link: e.find('a').attr('href'),
            taobao: e.find('a').attr('data-taobao'),
            i: i
          }

        data.links.push(d)
    })

    $.ajax({
      url: '/generate',
      type: 'POST',
      dataType: 'json',
      data: data
    }).done(function(res) {
      if (res && !res.succ) return
      pop.window.location = res.path
    })
    
    event.preventDefault()
  })

  // 上传进度条
  $('form').on('click', 'button', function() {
    var file = $('form input[type="file"]').val()
    if (!file) {
        alert('Please select the picture')
        return false
    }
    $('form .progress').show()
  })
})
