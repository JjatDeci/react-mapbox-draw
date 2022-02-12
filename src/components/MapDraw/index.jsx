import * as React from "react";
import { useState, useCallback } from "react";
import Map, { Source, Layer, NavigationControl } from "react-map-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

// import {
//   CircleMode,
//   DragCircleMode,
//   DirectMode,
//   SimpleSelectMode
// } from 'mapbox-gl-draw-circle';

import DrawControl from "./DrawControl";
import ControlPanel from "./ControlPanel";

const TOKEN =
  "pk.eyJ1IjoiZ3VzdGF2b2FydGVhZ2EiLCJhIjoiY2t5YXpodHR6MGFmcTJvbGRydzQzZGhtMCJ9.U1GAsqiLSG-jo13a8f_a2A";

const lon = 84.825754,
  lat = 26.25816;
const radius = 5;
const center = [lon, lat];
const options = { steps: 50, units: "kilometers", properties: { foo: "bar" } };
const circle = turf.circle(center, radius, options);
const line = turf.lineString(...circle.geometry.coordinates);
const polygon = turf.polygon([
  [
    [125, -15],
    [113, -22],
    [154, -27],
    [144, -15],
    [125, -15],
  ],
]);

const MapDraw = () => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "70vh", // , [-87.61694, 41.86625]
    latitude: lat,
    longitude: lon,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      console.log(e);
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      console.log(e);
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const handlerClick = (e) => {
    console.log(e);
  };

  return (
    <>
      <h1>Map Draw</h1>
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={viewport}
        style={{ width: "96%", height: 800, margin: "auto" }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        // onClick={handlerClick}
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          userProperties={true}
          controls={{
            polygon: true,
            line_string: true,
            point: true,
            trash: true,
          }}
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}

        />
        <Source id="my-data" type="geojson" data={circle}>
          <Layer
            id="point-90-hi"
            type="fill"
            paint={{
              "fill-color": "#088",
              "fill-opacity": 0.4,
              "fill-outline-color": "yellow",
            }}
          />
        </Source>
        <Source id="my-line" type="geojson" data={line}>
          <Layer
            id="point-9-hi"
            type="line"
            paint={{
              "line-color": "red",
              "line-width": 4,
            }}
          />
        </Source>
        <Source id="my-polygon" type="geojson" data={polygon}>
          <Layer
            id="fill-hi"
            type="fill"
            paint={{
              "fill-color": "#74e696",
              "fill-opacity": 0.4,
              "fill-outline-color": "#e67474",
            }}
          />
        </Source>
        <NavigationControl />
      </Map>
      <ControlPanel polygons={Object.values(features)} />
    </>
  );
};

export default MapDraw;
