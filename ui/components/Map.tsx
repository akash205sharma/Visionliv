// components/Map.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix marker icon issue in Leaflet + Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapProps {
  lat: number
  lng: number
}

export default function Map({ lat, lng }: MapProps) {
  useEffect(() => {
    // Fix map size bug in SSR
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)
  }, [])

  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>Property Location</Popup>
      </Marker>
    </MapContainer>
  )
}
