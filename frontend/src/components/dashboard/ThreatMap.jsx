import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ThreatMap = () => {
    const [threats, setThreats] = useState([]);

    // Mock generating "live" threats
    useEffect(() => {
        const interval = setInterval(() => {
            const newThreat = {
                name: `Attack #${Math.floor(Math.random() * 1000)}`,
                coordinates: [
                    (Math.random() * 360) - 180, // Longitude
                    (Math.random() * 160) - 80   // Latitude
                ],
                type: Math.random() > 0.5 ? 'phishing' : 'malware',
                timestamp: Date.now()
            };

            setThreats(current => {
                // Keep only last 15 threats
                const updated = [...current, newThreat];
                if (updated.length > 15) return updated.slice(updated.length - 15);
                return updated;
            });
        }, 1200); // New threat every 1.2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[400px] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800 my-8">

            {/* Header Overlay */}
            <div className="absolute top-4 left-6 z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <h3 className="text-white font-bold text-lg tracking-wider">LIVE THREAT MAP</h3>
                </div>
                <p className="text-slate-400 text-xs font-mono">REAL-TIME GLOBAL TELEMETRY</p>
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-6 left-6 z-10 bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 pointer-events-none">
                <div className="flex gap-8 text-white">
                    <div>
                        <div className="text-2xl font-bold font-mono">{1240 + threats.length * 12}</div>
                        <div className="text-xs text-slate-400 uppercase">Attacks Blocked</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-mono text-red-500">12ms</div>
                        <div className="text-xs text-slate-400 uppercase">Avg Latency</div>
                    </div>
                </div>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100,
                    center: [0, 20]
                }}
                className="w-full h-full bg-slate-900"
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#1e293b" // slate-800
                                stroke="#334155" // slate-700
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#334155", outline: "none" },
                                    pressed: { fill: "#475569", outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {threats.map((threat, index) => (
                    <Marker key={threat.timestamp + index} coordinates={threat.coordinates}>
                        <circle r={4} fill="#F43F5E" stroke="#fff" strokeWidth={2} />
                        <circle r={8} fill="#F43F5E" opacity={0.3}>
                            <animate attributeName="r" from="4" to="20" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
};

export default ThreatMap;
