$(function() {
  $('.box').on('mousedown', function(event) {
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

      var url = prompt('输入 URL：')
      $flip.append($('<a href="' + url + '" target="_blank">' + url + '</a>'))
    })

    event.preventDefault()
  })

  // 修改 url
  $('.box').on('click', '.flip', function(event) {
      var url = prompt('输入 URL：')
      $(this).find('a').attr('href', url).text(url)

      event.preventDefault()
  })

  // 生成 html
  $('.js-generate').on('click', function(event) {
    var data = {}
      , pop = window.open('about:blank')

    data.html = $('.box')[0].outerHTML
    data.name = $(this).data('name')

    $.ajax({
      url: '/generate',
      type: 'POST',
      dataType: 'json',
      data: data
    }).done(function(res) {
      if (!res.succ) return
      pop.window.location = res.path
    })
    
    event.preventDefault()
  })
})
