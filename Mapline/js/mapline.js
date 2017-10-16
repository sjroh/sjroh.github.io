const PATH_STROKE_COLOR = '#FF0000';
const PATH_STROKE_OPACITY = 1.0;
const PATH_STROKE_WEIGHT = 2;
const DATE_FORMAT = "mm/dd/yy";
const MAP_ZOOM_LEVEL = 2;
const MAP_DEFAULT_LAT = 27.9316951;
const MAP_DEFAULT_LNG = -176.4803929;

// need to change this somehow BEGIN
var globalEvent;
var map;
var mapline = new Object();
mapline.list = [];
mapline.path = null;
mapline.marker = [];
var fromDateSelector;
var toDateSelector;
// need to change this somehow END

/****************************************
 * Date related functions BEGIN
 ****************************************/
$(function() {
  fromDateSelector = $("#from-date")
    .datepicker({
      changeMonth: true,
      changeYear: true
    })
    .on("change", function() {
      toDateSelector.datepicker("option", "minDate", getDate(this));
    });
  toDateSelector = $("#to-date").datepicker({
      changeMonth: true,
      changeYear: true
    })
    .on("change", function() {
      fromDateSelector.datepicker("option", "maxDate", getDate(this));
    });
});

function getDate(element) {
  var date;
  try {
    date = $.datepicker.parseDate(DATE_FORMAT, element.value);
    // console.log("Date format acceptable");
  } catch (error) {
    date = null;
    alert("NO");
  }
  return date;
}
/****************************************
 * Date related functions END
 ****************************************/


/****************************************
 * Utility functions BEGIN
 ****************************************/
function compare(a, b) {
  if (a.from < b.from)
    return -1;
  if (a.from > b.from)
    return 1;
  return 0;
}

function validateDateInList(fromDate, toDate) {
  var result = true;
  for (var i = 0; i < mapline.list.length && result; i++) {
    if (fromDate < mapline.list[i].from && mapline.list[i].from < toDate) {
      result = false;
    }
    if (fromDate < mapline.list[i].to && mapline.list[i].to < toDate) {
      result = false;
    }
    if (mapline.list[i].from < fromDate && toDate < mapline.list[i].to) {
      result = false;
    }
  }
  return result;
}

function validatefromtoDate() {
  $("#form-marker-from-date").removeClass("has-error");
  $("#form-marker-to-date").removeClass("has-error");

  var fromDate;
  var toDate;

  try {
    fromDate = new Date($("#from-date").val());
  } catch (error) {
    $("#form-marker-from-date").addClass("has-error");
    return false;
  }

  try {
    toDate = new Date($("#to-date").val());
  } catch (error) {
    $("#form-marker-to-date").addClass("has-error");
    return false;
  }

  try {
    if (validateDateInList(fromDate, toDate)) {
      return true;
    } else {
      $("#form-marker-from-date").addClass("has-error");
      $("#form-marker-to-date").addClass("has-error");
      return false;
    }
  } catch (error) {
    $("#form-marker-from-date").addClass("has-error");
    $("#form-marker-to-date").addClass("has-error");
    return false;
  }
}
/****************************************
 * Utility functions END
 ****************************************/


/****************************************
 * Map functions BEGIN
 ****************************************/
function initMapline() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: MAP_DEFAULT_LAT,
      lng: MAP_DEFAULT_LNG
    },
    zoom: MAP_ZOOM_LEVEL
  });
  google.maps.event.addListener(map, 'rightclick', function(event) {
    // open modal to add marker
    $.datepicker._clearDate($("#from-date"));
    $.datepicker._clearDate($("#to-date"));
    $('#modal-create-marker').modal('show');
    globalEvent = event;
  });
}

function createMarker() {
  if (validatefromtoDate()) {
    try {
      // create marker
      var item = new Object();
      item.lat = globalEvent.latLng.lat();
      item.lng = globalEvent.latLng.lng();
      item.from = new Date($("#from-date").val());
      item.to = new Date($("#to-date").val());
      item.memo = $("#marker-memo").val();
      var fromDateString = (item.from.getUTCMonth() + 1) + "/" + item.from.getUTCDate() + "/" + item.from.getUTCFullYear();
      var toDateString = (item.to.getUTCMonth() + 1) + "/" + item.to.getUTCDate() + "/" + item.to.getUTCFullYear();
      item.title = fromDateString + " ~ " + toDateString;
      mapline.list.push(item);

      addMarkerOnMap(globalEvent.latLng, map, item);

      document.getElementById("form-marker-date").reset();
      $('#modal-create-marker').modal('hide');

      console.log(mapline);

      drawLines();

      $.datepicker._clearDate($("#from-date"));
      $.datepicker._clearDate($("#to-date"));
    } catch (error) {
      console.log("[ERROR] createMarker: " + error);
    }
  }
}

function addMarkerOnMap(location, map, item) {
  try {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    item.from = new Date(item.from);
    item.to = new Date(item.to);
    var infowindow = new google.maps.InfoWindow({
      content: item.title
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    mapline.marker.push(marker);
    drawMaplineList();
  } catch (error) {
    console.log("[ERROR] addMarkerOnMap: " + error);
  }
}

function removeMarker(index) {
  mapline.marker[index].setMap(null);
  mapline.marker.splice(index, 1);
  mapline.list.splice(index, 1);
}

function removeAllMarker() {
  mapline.marker.forEach((x, i) => {
    x.setMap(null);
  });
  mapline.marker = [];
}

function drawLines() {
  if (mapline.path != null) {
    mapline.path.setMap(null);
  }
  mapline.list.sort(compare);
  if (mapline.list.length > 1) {
    var coordinates = [];
    mapline.list.forEach(function(item) {
      coordinates.push({
        lat: item.lat,
        lng: item.lng
      });
    });
    if (mapline.path != null) {
      mapline.path.setMap(null);
    }
    mapline.path = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: PATH_STROKE_COLOR,
      strokeOpacity: PATH_STROKE_OPACITY,
      strokeWeight: PATH_STROKE_WEIGHT
    });
    mapline.path.setMap(map);
  }
}

function drawMapline() {
  removeAllMarker();
  mapline.list.forEach(function(item) {
    var location = {
      lat: item.lat,
      lng: item.lng
    };
    addMarkerOnMap(location, map, item);
  });
  drawLines();
  drawMaplineList();
}
/****************************************
 * Map functions END
 ****************************************/


/****************************************
 * File functions BEGIN
 ****************************************/
$(function() {
  document.getElementById('load-file').addEventListener('change', importFile, false);
});

function openImportFile() {
  $("#load-file").click();
}

function importFile(event) {
  var file = event.target.files; // FileList object
  file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(file) {
    try {
      mapline.list = JSON.parse(file.target.result);
      drawMapline();
    } catch (error) {
      console.log("[ERROR] importFile: " + error);
    }
  };
  reader.readAsText(file);
}

function exportFile() {
  try {
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapline.list));
    $("#download-anchor").attr("href", data);
    $("#download-anchor").attr("download", "Mapline.json");
    // $("#download-anchor").click(); // Why this doesn't work?
    document.getElementById('download-anchor').click();
  } catch (error) {
    console.log("[ERROR] exportFile: " + error);
  }
}
/****************************************
 * File functions END
 ****************************************/


/****************************************
 * Mapline List functions BEGIN
 ****************************************/
$(function() {
  $("#mapline-list-menu-show").click(function() {
    $("#mapline-list-menu-show").toggle();
    $("#mapline-list-menu-hide").toggle();
    $("#mapline-list").toggle();
  });
  $("#mapline-list-menu-hide").click(function() {
    $("#mapline-list-menu-show").toggle();
    $("#mapline-list-menu-hide").toggle();
    $("#mapline-list").toggle();
  });
  // $(".delete-marker").click(function() {
  //   alert("asdf");
  //   removeMarker($(this).attr(index));
  //   drawMapline();
  // });
  $(document).on('click', '.delete-marker', function () {
    console.log($(this));
    removeMarker($(this).attr("index"));
    drawMapline();
  });
});

function drawMaplineList() {
  $("#mapline-list").empty();
  // $("#mapline-list li").remove();
  mapline.list.forEach((x, i) => {
    var li = $('<li/>').text(x.title + "  ");
    var del = $('<button/>').text("X").addClass("btn btn-xs btn-danger delete-marker").attr("index", i);
    li.append(del);
    // var li = document.createElement("li");
    // li.appendChild(document.createTextNode(x.title));
    $("#mapline-list").append(li);
  });
}
/****************************************
 * Mapline List functions END
 ****************************************/
