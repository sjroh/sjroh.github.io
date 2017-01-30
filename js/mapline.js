const START_DATE = 0, END_DATE = 1;
const PATH_STROKE_COLOR = '#FF0000';
const PATH_STROKE_OPACITY = 1.0;
const PATH_STROKE_WEIGHT = 2;

// need to change this somehow BEGIN
var globalEvent;
var map;
var mapline = new Object();
mapline.list = [];
mapline.path = null;
// need to change this somehow END

function compare(a, b) {
  if (a.start < b.start)
    return -1;
  if (a.start > b.start)
    return 1;
  return 0;
}

function drawLines() {
  // sort the list first
  mapline.list.sort(compare);

  if (mapline.list.length > 1) {
    var coordinates = [];

    mapline.list.forEach(function(item){
      coordinates.push({lat: item.lat, lng: item.lng});
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

function addMarkerOnMap(location, map, item) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
    content: item.startDate + " ~ " + item.endDate
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function createMarker() {
  if (validateStartEndDate()) {
    // create marker
    var item = new Object();
    item.lat = globalEvent.latLng.lat();
    item.lng = globalEvent.latLng.lng();
    item.start = document.getElementById("get-start-date").value;
    item.end = document.getElementById("get-end-date").value;
    item.startDate = document.getElementById("generate-start-date").value;
    item.endDate = document.getElementById("generate-end-date").value;

    mapline.list.push(item);

    addMarkerOnMap(globalEvent.latLng, map, item);

    document.getElementById("form-marker-date").reset();
    $('#modal-create-marker').modal('hide');

    // console.log(mapline.list);

    drawLines();
  }
}

function validateDateInList(inputDate) {
  var result = true;

  for (var i = 0; i < mapline.list.length && result; i ++) {
    console.log(mapline.list[i].start);
    console.log(inputDate);
    console.log(mapline.list[i].end);

    if (inputDate == mapline.list[i].start) {
      result = false;
    }
    if (inputDate == mapline.list[i].end) {
      result = false;
    }
    if (inputDate >= mapline.list[i].start && inputDate <= mapline.list[i].end) {
      result = false;
    }
    console.log(result);
    console.log("\n");
  }

  return result;
  //
  // mapline.list.forEach(function(item){
  //   console.log(item.start);
  //   console.log(inputDate);
  //   console.log(item.end);
  //   if (inputDate == item.start) {
  //     console.log("BOOM 1");
  //     return false;
  //   }
  //   if (inputDate == item.end) {
  //     console.log("BOOM 2");
  //     return false;
  //   }
  //   if (inputDate >= item.start && inputDate <= item.end) {
  //     console.log("BOOM 3");
  //     return false;
  //   }
  // });
  // return true;
}

function validateDateValue(inputDate) {
  var pattern = new RegExp(/\d{8}/);
  if (pattern.test(String(inputDate))) {
    var date = parseInt(inputDate) % 100;
    if (date > 0 && date < 32) {
      var month = parseInt(parseInt(inputDate) / 100) % 100;
      if (month > 0 && month < 13) {
        return true;
      }
    }
  }
  return false;
}

function validateStartEndDate() {
  var startDate = parseInt(document.getElementById("get-start-date").value);
  var endDate = parseInt(document.getElementById("get-end-date").value);

  var startDatePassed = false;
  var endDatePassed = false;

  if (validateDateValue(startDate) && validateDateInList(startDate)) {
    $("#form-marker-start-date").removeClass("has-error");
    startDatePassed = true;
  } else {
    $("#form-marker-start-date").addClass("has-error");
  }

  if (validateDateValue(endDate) && validateDateInList(endDate)) {
    $("#form-marker-end-date").removeClass("has-error");
    endDatePassed = true;
  } else {
    $("#form-marker-end-date").addClass("has-error");
  }
  console.log("startDatePassed = " + startDatePassed + "\nendDatePassed = " + endDatePassed);

  if (startDatePassed && endDatePassed) {
    console.log("LAST CHECK");
    if (startDate <= endDate) {
      $("#form-marker-start-date").removeClass("has-error");
      $("#form-marker-end-date").removeClass("has-error");
      return true;
    } else {
      $("#form-marker-start-date").addClass("has-error");
      $("#form-marker-end-date").addClass("has-error");
    }
  }

  return false;
}

function getDate(selector) {
  var selectedDateUTC;
  var parsedDate;
  var selectedDateByUser;
  var selectedDateHidden;

  if(selector == START_DATE) {
    // start date input changed
    selectedDateByUser = new Date(document.getElementById("generate-start-date").value);
    selectedDateHidden = document.getElementById("get-start-date");
  } else {
    // end date input changed
    selectedDateByUser = new Date(document.getElementById("generate-end-date").value);
    selectedDateHidden = document.getElementById("get-end-date");
  }

  // change date into user local time
  selectedDateUTC = new Date(selectedDateByUser.getUTCFullYear(), selectedDateByUser.getUTCMonth(), selectedDateByUser.getUTCDate(),  selectedDateByUser.getUTCHours(), selectedDateByUser.getUTCMinutes(), selectedDateByUser.getUTCSeconds());

  parsedDate = selectedDateUTC.getFullYear();

  // month starts from 0
  if ((selectedDateUTC.getMonth() + 1) < 10) {
    parsedDate += "0" + String(selectedDateUTC.getMonth() + 1);
  } else {
    parsedDate += String(selectedDateUTC.getMonth() + 1);
  }

  if (selectedDateUTC.getDate() < 10) {
    parsedDate += "0" + String(selectedDateUTC.getDate());
  } else {
    parsedDate += String(selectedDateUTC.getDate());
  }

  selectedDateHidden.value = parsedDate;

  // console.log(selectedDateUTC);
  // console.log(parsedDate);
  // console.log(validateStartEndDate());
}

function initMapline() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 27.9316951, lng: -176.4803929},
    zoom: 2
  });

  // map.set('disableDoubleClickZoom', true);
  google.maps.event.addListener(map, 'rightclick', function(event) {
    // open modal to get info
    $('#modal-create-marker').modal('show');
    globalEvent = event;
  });

}
