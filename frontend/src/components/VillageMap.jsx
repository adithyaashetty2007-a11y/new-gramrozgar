import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Map as MapIcon,
  CheckCircle2,
} from "lucide-react";


// ===============================
// VILLAGE CENTER
// ===============================

const villageCenter = [12.9833, 75.2944];


// ===============================
// MOCK ECONOMIC DATA
// ===============================

const locations = [
  {
    position: [12.9870, 75.2980],
    name: "Existing Dairy Unit",
    distance: "1.8 km",
    type: "enterprise",
  },

  {
    position: [12.9760, 75.2890],
    name: "Existing Dairy Unit",
    distance: "4.1 km",
    type: "enterprise",
  },

  {
    position: [12.9810, 75.2960],
    name: "Milk Collection Hub",
    distance: "0.9 km",
    type: "hub",
  },
];


// ===============================
// CUSTOM MARKERS
// ===============================

const dairyIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      background: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 19px;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
    ">
      🐄
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});


const hubIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 19px;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
    ">
      🥛
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});


// ===============================
// COMPONENT
// ===============================

function VillageMap() {

  return (

    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}

      <div className="mb-5 flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-50 p-3">

            <MapIcon
              size={22}
              className="text-blue-600"
            />

          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Village Economic Map
            </h2>

            <p className="text-sm text-slate-500">
              Local businesses and economic points
            </p>

          </div>

        </div>


        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          LIVE DATA
        </span>

      </div>


      {/* MAP */}

      <div className="overflow-hidden rounded-2xl border border-slate-200">

        <MapContainer
          center={villageCenter}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-[330px] w-full"
        >

          {/* OPENSTREETMAP */}

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />


          {/* MARKERS */}

          {locations.map((location, index) => (

            <Marker
              key={index}
              position={location.position}
              icon={
                location.type === "hub"
                  ? hubIcon
                  : dairyIcon
              }
            >

              <Popup>

                <div className="min-w-[160px]">

                  <p className="font-semibold text-slate-900">
                    {location.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {location.distance} away
                  </p>

                  <p className="mt-2 text-xs text-emerald-600">
                    Verified economic point
                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

        </MapContainer>

      </div>


      {/* LEGEND */}

      <div className="mt-4 flex flex-wrap gap-5">

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-red-500" />

          <span className="text-xs text-slate-600">
            Existing Enterprise
          </span>

        </div>


        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-emerald-500" />

          <span className="text-xs text-slate-600">
            Milk Collection Hub
          </span>

        </div>

      </div>


      {/* MAP INFORMATION */}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            Competition Density
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-600">
            LOW
          </p>

        </div>


        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">

          <CheckCircle2
            size={16}
            className="text-emerald-600"
          />

          <span className="text-xs font-semibold text-emerald-700">
            Panchayat Verified Ground Truth
          </span>

        </div>

      </div>

    </section>

  );
}

export default VillageMap;