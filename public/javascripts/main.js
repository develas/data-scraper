$(document).ready(function() {
    $('.search img').click(function(){
      sendUrl();
    });

    $('.search input').keypress(function(event) {
      if (event.keyCode == 13) {
        sendUrl();
      }
    });

    function sendUrl(){
      var url = $(".search input").val();
      if(url!==''){
        $.post("/", {url: url}, function(data){
          $('body').on('click',"*", function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('custom-select');

            var attributes = [], 
                links = [],
                attrs = this.attributes;

            for (var i in attrs){
             if (attrs.hasOwnProperty(i)){
              attributes.push({name: attrs[i].name, value: attrs[i].value});
             }
            }

            $('a').not('a[href^="#"]').not('a[href^="//"]').not('a[href^="/"]').each(function() {
               links.push( this.href );
            });
            $.post("/search", {element: {tagName: this.tagName, attributes: attributes}, links: links}, function(data){
              
            });

          });

          $('#container').empty().append(data);
        });
      }
    }

    $('body').on('mouseover',"*", function(e){
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('custom-select');
    });

    $('body').on('mouseleave',"*", function(e){
      $(this).removeClass('custom-select');
    });

});