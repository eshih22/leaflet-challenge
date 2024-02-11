let map = L.map('map', {
    center: [40.73, -74.0059],
    zoom: 4,
});

let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let allEarthquakes = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

let baseMaps = {
    "Street Map": streetmap
};

let overlays = {
    "Earthquakes": allEarthquakes,
};


L.control.layers(baseMaps, overlays).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function getColor(magnitude) {
        if (magnitude > 5) {
            return "#D61F1F";
        }
        if (magnitude > 4) {
            return "#E03C32";
        }
        if (magnitude > 3) {
            return "#FFD301";
        }
        if (magnitude > 2) {
            return "#7BB662";
        }
        if (magnitude > 1) {
            return "#639754";
        }
        return "#006B3D";
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(allEarthquakes);

    allEarthquakes.addTo(map);

    
    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        const magnitudes = [0, 1, 2, 3, 4, 5];
        const colors = [
            "#006B3D",
            "#639754",
            "#7BB662",
            "#FFD301",
            "#E03C32",
            "#D61F1F"
        ];

        for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(map);
});
