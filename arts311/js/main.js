$( document ).ready(function() {
    var $img_path = "./pages/";
    var $img_max = 26;
    //var $photobook = document.getElementById("photobook");
    for (var i = 0; i < $img_max; i += 2) {
      var pages = $("<div class='row'></div>");
      var left = $("<div class='col-sm-6 photo-col'><img src='"+$img_path+i+".jpg'></div>");
      var right = $("<div class='col-sm-6 photo-col'><img src='"+$img_path+(i+1)+".jpg'></div>");
      pages.append(left);
      pages.append(right);
      $("#photobook").append(pages);
      console.log(i);
    }
});
