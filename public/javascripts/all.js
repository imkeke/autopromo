$(function() {
  $('.box').on('mousedown', function(event) {
    if (event.button === 2) return

    var $flip = $('<div class="flip"></div>')
      , boxtop = $(this).offset().top
      , boxleft = $(this).offset().left
      , left = event.pageX - boxleft
      , top = event.pageY - boxtop

    $flip.css({
      left: left,
      top: top
    })
    $(this).append($flip)

    $(this).on('mousemove', function(eventIn) {
      var width = eventIn.pageX - boxleft - left
        , height = eventIn.pageY - boxtop - top

      $flip.css({
        width: width,
        height: height
      })
    })

    $(this).on('mouseup', function() {
      $(this).off('mousemove')

      var url = prompt('输入 URL：')
      $flip.append($('<a href="' + url + '" target="_blank">' + url + '</a>'))
    })

    event.preventDefault()
  })
})
