var redirect_hashes = ['introduction', 'installation',
                       'configuring-your-environment-using-ec2',
                       'configuring-a-local-environment'];

//$(document).ready(function() {
//  $('.stacktack').stacktack({'site': 'askubuntu.com', 'answers': 'accepted',
//                         'tags': 'true', 'secure': 'true'});
//});

$(document).ready(function() {
  if($.inArray(window.location.hash, redirect_hashes) > -1) {
    window.location.replace(window.location.pathname + '/' + window.location.hash);
  }

  var url = window.location.pathname;
  var cur_page = url.substring(url.lastIndexOf('/')+1) + window.location.hash;
  $('#navlinks ul li').each(function() {
    if($(this).children('a').attr('href') == cur_page) {
      $(this).addClass('selected');
    }
  });

  var anchor_tpl = $('<a>').addClass('anchor');
  $('h1, h2, h3, h4, h5').each(function() {
    if($(this).attr('id')) {
      var id = $(this).attr('id');
      var link = anchor_tpl.clone();
      link.attr('href', '#'+id);
      $(this).append(link);
    }
  });
  $('.doc-content section.code-example').each(function() {
    var parent = this;
    $(parent).find('nav.control a').each(function() {
      if($(this).hasClass('selected')) {
        var section = $(this).data('action');
        $(parent).find('div[data-section='+section+']').show();
      }

      $(this).click(function(e) {
        e.preventDefault();
        var section = $(this).data('action');
        $(parent).find('div[data-section]').hide();
        $(this).siblings('a').removeClass('selected');
        $(this).addClass('selected');
        $(parent).find('div[data-section='+section+']').show();
        return false;
      });
    });
  });
});


