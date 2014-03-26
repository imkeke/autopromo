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

      var url = prompt('输入淘宝客 URL：')
      var taobaourl = prompt('输入淘宝原 URL：')
      $flip.append($('<a href="' + url + '" data-taobao="' + taobaourl + '" target="_blank">' + url + '</a>'))
    })

    event.preventDefault()
  })

  // 修改 url
  $box.on('click', '.flip', function(event) {
    var e = $(this).find('a')
      , o = e.attr('href') // origin href
      , t = e.attr('data-taobao') // origin data-taobao
      , url = prompt('输入 URL：', o)
      , taobaourl = prompt('输入淘宝原 URL：', t)

    e.attr('href', url).attr('data-taobao', taobaourl).text(url)

    event.preventDefault()
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

})
