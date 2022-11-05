var site_url = "";
var listings = [];
var map = null;
console.log(site_url);
$(function () {
  prepareMap();
  prepareList();
});

function prepareMap() {
  $.get(site_url + "fairfield-data.json")
    .done(function (data) {
      // console.log(data);
      setIntheMap(data);
    })
    .fail(function () {
      console.log("Error fetching data....");
    });
}

function prepareList() {
  $.get(site_url + "fairfield-data.json")
    .done(function (data) {
      console.log(data); // setIntheMap(data);
      var listcontent = "";
      if (data.length > 0) {
        $.each(data, function (index, row) {
          listcontent += buildTemplate(index, row);
        });
      } else {
        listcontent = "No record available";
      }

      console.log(listcontent);
      $("#listing-list").html(listcontent);
    })
    .fail(function () {
      console.log("Error fetching data....");
    });
}

function setIntheMap(data) {
  let center = new google.maps.LatLng(33.700591, -78.870947);

  if (data.length > 0) {
    center = new google.maps.LatLng(data[0]["longitude"], data[0]["latitude"]);
  }

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    maxZoom: 17,
    minZoom: 8,
    center: center,
  });

  initMap(data, map);
}

function buildTemplate(index, data) {
  let price = (1 * data.askPrice).toFixed(2);
  let article =
    '<div class="constellation"> <article class="artcl" data-index="' +
    index +
    '" id="property-' +
    data.MLSNo +
    '">' +
    '<div class="boxshd">' +
    '<div class=img-area><img alt="Condo in ' +
    data.address +
    '" src="' +
    data.image +
    '"></div>' +
    '<div class="box-content">' +
    "<div><strong>" +
    "$" +
    price +
    "</strong></div>" +
    "<div>" +
    data.address +
    "</div>" +
    "<div>" +
    data.bedRooms +
    " Br / " +
    data.bathRooms +
    " Ba , " +
    data.totalSqft +
    " SqFt " +
    data.propertyType +
    "</div></div></div></article></div>";

  return article;
}
function initMap(data, map) {
  var markers = [];

  for (let i = 0; i < data.length; i++) {
    var content = "";

    let property = data[i];
    var mlnumber = property.MLSNo;
    var lati = parseFloat(property["latitude"]);
    var long = parseFloat(property["longitude"]);

    const priceTag = document.createElement("div");

    priceTag.className = "price-tag";
    priceTag.textContent = property.askPrice;
    const markerLabel = "$" + property.askPrice;
    const markerIcon = {
      url: site_url + "images/marker-pin-1.png",
      scaledSize: new google.maps.Size(42, 42),
    };

    // Caravan Salon

    var marker = new markerWithLabel.MarkerWithLabel({
      map: map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(property.latitude, property.longitude),
      icon: markerIcon,
      // property: property,
      // MLSNo: property.MLSNo,
      labelContent: markerLabel,
      labelAnchor: new google.maps.Point(-20, 0),
      labelClass: "price-label", // your desired CSS class
      labelInBackground: true,
    });

    markers.push(marker);

    var infowindow = new google.maps.InfoWindow();

    // google.maps.event.addListener(marker, 'click', (function(marker, i) {
    //     return function() {
    //         infowindow.setContent(content);
    //         infowindow.open(map, marker);
    //     }
    // })(marker, i));

    // google.maps.event.addListener(markers[i], 'mouseover', function(e, mlnumber) {
    //     // infowindow.setContent('Marker postion: ' + this.getPosition());
    //     infowindow.setContent($("#property-" + mlnumber).html());
    //     infowindow.setPosition(this.getPosition());
    //     infowindow.open(map);
    // });

    google.maps.event.addListener(
      marker,
      "mouseover",
      (function (marker, content, mlnumber) {
        return function () {
          // console.log(mlnumber);
          let content =
            "<div class='map-market-content'>" +
            $("#property-" + mlnumber + " .img-area").html();
          content +=
            $("#property-" + mlnumber + " .box-content").html() + "</div>";
          infowindow.setContent(content);
          infowindow.setPosition(this.getPosition());
          infowindow.open(map, marker);
        };
      })(marker, content, mlnumber)
    );

    // google.maps.event.addListener(marker, "mouseout", function () {
    //   infowindow.close();
    // });

    // Highlight Icon on hover of sidebar summary

    $(document)
      .on("mouseenter", "#property-" + property.MLSNo, function () {
        let index = $(this).data("index");
        // markers[index].setIcon('https://www.google.com/mapfiles/marker_green.png');
        // markers[index].setAnimation(google.maps.Animation.BOUNCE);
        new google.maps.event.trigger(markers[index], "mouseover");
      })
      .on("mouseleave", "#property-" + property.MLSNo, function () {
        // console.log(property.MLSNo);
        // let index = $(this).data("index");
        // markers[index].setIcon(markerIcon);
      });
  }

  if (markers.length > 0) {
    var bounds = new google.maps.LatLngBounds();
    //  Go through each...
    $.each(markers, function (index, marker) {
      bounds.extend(marker.position);
    });
    //  Fit these bounds to the map
    map.fitBounds(bounds);
  }

  //  Create a new viewpoint bound
}
