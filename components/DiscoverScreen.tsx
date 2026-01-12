
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Compass, Search, MapPin, Star, Navigation, X, 
  ShoppingBag, Building2 as MosqueIcon, LocateFixed, 
  Mic, Phone, Share2, Bookmark, ChevronUp, Clock,
  RefreshCw, Sparkles, Zap, AlertTriangle
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { LocationData, Language } from '../types';
import { TRANSLATIONS, COLORS } from '../constants';

const DEFAULT_CENTER: [number, number] = [44.8378, -0.5792]; // Bordeaux, France
const DEFAULT_ZOOM = 13;

/**
 * Pointing to the Vercel API route proxy.
 * This resolves the "Mixed Content" error (HTTPS -> HTTP) by handling
 * the request server-side.
 */
const N8N_PROXY_ENDPOINT = "/api/n8n";

const DiscoverScreen: React.FC<{ language: Language }> = ({ language }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mosque' | 'halal'>('all');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const discoveringRef = useRef(false);
  const mapRef = useRef<any>(null);
  const leafletMapRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  const fetchLocations = useCallback(async () => {
    try {
      const data = await supabaseService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  }, []);

  /**
   * Triggers the n8n discovery via our local proxy.
   * This ensures the request is sent over HTTPS to our own backend,
   * which then forwards it to the HTTP n8n server.
   */
  const triggerDiscovery = useCallback(async (center: { lat: number, lng: number }) => {
    if (discoveringRef.current) return;
    
    discoveringRef.current = true;
    setIsDiscovering(true);
    setErrorStatus(null);
    
    console.log(`[Sync] Triggering discovery via proxy: ${center.lat}, ${center.lng}`);
    
    try {
      const response = await fetch(N8N_PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lat: center.lat,
          lng: center.lng
        })
      });

      if (response.ok) {
        console.log("[Sync] Success: n8n triggered successfully.");
        // Refresh local data from Supabase
        await fetchLocations();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = `[Sync] Proxy failed: ${response.status} ${errorData.error || ''}`;
        console.error(errorMsg);
        setErrorStatus("Discovery Error");
      }
    } catch (error) {
      const connError = "[Sync] Could not reach proxy endpoint.";
      console.error(connError, error);
      setErrorStatus("Connection Error");
    } finally {
      discoveringRef.current = false;
      setIsDiscovering(false);
    }
  }, [fetchLocations]);

  // Handle initialization
  useEffect(() => {
    fetchLocations();
    triggerDiscovery({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
  }, [fetchLocations, triggerDiscovery]);

  // Request user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          if (mapRef.current) {
            mapRef.current.setView(coords, DEFAULT_ZOOM, { animate: true });
          }
        },
        () => console.warn("Location access denied."),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Map Lifecycle
  useEffect(() => {
    if (typeof (window as any).L !== 'undefined' && leafletMapRef.current && !mapRef.current) {
      const L = (window as any).L;
      mapRef.current = L.map(leafletMapRef.current, { 
        zoomControl: false, 
        attributionControl: false 
      }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
        maxZoom: 19 
      }).addTo(mapRef.current);

      mapRef.current.on('moveend', () => {
        const center = mapRef.current.getCenter();
        triggerDiscovery({ lat: center.lat, lng: center.lng });
      });

      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 300);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [triggerDiscovery]);

  // Update Markers
  useEffect(() => {
    if (mapRef.current && typeof (window as any).L !== 'undefined') {
      const L = (window as any).L;
      markersRef.current.forEach(m => mapRef.current.removeLayer(m));
      markersRef.current = [];

      if (userLocation) {
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(userLocation);
        } else {
          const userIcon = L.divIcon({
            html: `<div class="w-8 h-8 bg-blue-500 border-4 border-white rounded-full shadow-2xl animate-pulse"></div>`,
            className: 'user-location-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current);
        }
      }

      locations
        .filter(loc => activeFilter === 'all' || loc.type === activeFilter)
        .forEach(loc => {
          const isMosque = loc.type === 'mosque';
          const markerColor = isMosque ? '#1B3022' : '#C5A059';
          
          const iconHtml = `
            <div class="marker-container" style="
              background-color: ${markerColor}; 
              width: 48px; 
              height: 48px; 
              border-radius: 24px; 
              border: 3px solid white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            ">
              ${isMosque 
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"></path><rect width="10" height="12" x="7" y="4" rx="2"></rect><path d="M12 11h.01"></path></svg>' 
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>'
              }
            </div>`;
            
          const customIcon = L.divIcon({ 
            html: iconHtml, 
            className: 'custom-map-icon', 
            iconSize: [48, 48], 
            iconAnchor: [24, 48] 
          });
          
          const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapRef.current);
          marker.on('click', () => {
            setSelectedLocation(loc);
            setSheetExpanded(true);
            mapRef.current.setView([loc.lat, loc.lng], 15, { animate: true });
          });
          markersRef.current.push(marker);
        });
    }
  }, [locations, userLocation, activeFilter]);

  const handleCenterOnUser = () => {
    const center = userLocation || DEFAULT_CENTER;
    if (mapRef.current) {
      mapRef.current.setView(center, DEFAULT_ZOOM + 2, { animate: true });
    }
  };

  const handleManualSync = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      triggerDiscovery({ lat: center.lat, lng: center.lng });
    }
  };

  const getName = (loc: LocationData) => {
    if (language === 'ar') return loc.name_ar;
    if (language === 'fr') return loc.name_fr;
    return loc.name_en;
  };

  const getAddress = (loc: LocationData) => {
    if (language === 'ar') return loc.address_ar;
    if (language === 'fr') return loc.address_fr;
    return loc.address_en;
  };

  return (
    <div className="h-screen w-full relative bg-[#F5F5F5] overflow-hidden flex flex-col">
      <div 
        ref={leafletMapRef} 
        className="absolute inset-0 z-0 grayscale-[0.8] brightness-[1.05] contrast-[0.9]"
      ></div>

      {/* Sync Status Overlay */}
      {(isDiscovering || errorStatus) && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[1500] animate-8k w-max">
          <div className={`${errorStatus ? 'bg-red-500' : 'bg-[#1B3022]'} backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3`}>
             {errorStatus ? <AlertTriangle size={14} className="text-white" /> : <Zap size={14} className="text-[#C5A059] animate-pulse" />}
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
               {errorStatus || "Syncing Locations..."}
             </span>
             {!errorStatus && <RefreshCw size={12} className="text-[#C5A059] animate-spin" />}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="absolute top-0 start-0 end-0 z-[1000] px-8 pt-[env(safe-area-inset-top,60px)] pb-10 flex flex-col gap-6 pointer-events-none backdrop-blur-[2px] bg-gradient-to-b from-white/30 to-transparent">
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="text-start">
            <h2 className="text-3xl font-amiri font-bold text-[#1B3022] leading-tight">{t('discover_title')}</h2>
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mt-1 opacity-90">{t('discover_sub')}</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={handleManualSync}
               disabled={isDiscovering}
               className={`w-11 h-11 bg-white border border-black/5 rounded-xl shadow-xl flex items-center justify-center transition-all active:scale-95 ${isDiscovering ? 'opacity-50' : 'text-[#1B3022]'}`}
             >
               <RefreshCw size={18} className={isDiscovering ? 'animate-spin' : ''} />
             </button>
             
             <button onClick={handleCenterOnUser} className="w-11 h-11 bg-white border border-black/5 rounded-xl shadow-xl flex items-center justify-center text-[#1B3022] active:scale-95 transition-all">
               <Navigation size={18} />
             </button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl p-1.5 rounded-[2.2rem] border border-white shadow-2xl flex items-center justify-between pointer-events-auto max-w-[320px] mx-auto w-full">
          <button onClick={() => setActiveFilter('all')} className={`flex-1 py-3 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'all' ? 'bg-[#1B3022] text-white shadow-lg' : 'text-[#1B3022]/40'}`}>{t('all')}</button>
          <button onClick={() => setActiveFilter('mosque')} className={`flex-1 py-3 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeFilter === 'mosque' ? 'bg-[#1B3022] text-white shadow-lg' : 'text-[#1B3022]/40'}`}><MosqueIcon size={12} /> {t('mosques')}</button>
          <button onClick={() => setActiveFilter('halal')} className={`flex-1 py-3 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeFilter === 'halal' ? 'bg-[#1B3022] text-white shadow-lg' : 'text-[#1B3022]/40'}`}><ShoppingBag size={12} /> {t('halal')}</button>
        </div>
      </div>

      <button onClick={handleCenterOnUser} className="absolute bottom-52 end-8 z-[1000] w-12 h-12 bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-center text-[#1B3022] transition-all active:scale-90"><LocateFixed size={20} /></button>

      {/* Bottom Detail Sheet */}
      <div 
        className={`absolute bottom-0 start-0 end-0 z-[2000] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${selectedLocation ? 'translate-y-0' : 'translate-y-[85%]'}`}
        style={{ height: sheetExpanded ? '60vh' : '10vh' }}
      >
        <div className={`h-full bg-[#FBFCF8] rounded-t-[3.5rem] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-[#D4AF37]/20 relative flex flex-col ${!sheetExpanded && 'cursor-pointer'}`} onClick={() => !sheetExpanded && setSheetExpanded(true)}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1B3022]/10 rounded-full"></div>
          
          {!selectedLocation ? (
            <div className="h-full flex items-center justify-center">
               <p className="text-[10px] font-black text-[#1B3022]/20 uppercase tracking-[0.4em]">Explore Nearby</p>
            </div>
          ) : (
            <div className="flex flex-col h-full text-start">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-amiri font-bold text-[#1B3022] mb-1">{getName(selectedLocation)}</h3>
                    <div className="flex items-center gap-2">
                       <Star size={12} fill="#D4AF37" className="text-[#D4AF37]" />
                       <span className="text-xs font-bold text-[#1B3022]">{selectedLocation.rating}</span>
                       <span className="text-[#1B3022]/20">•</span>
                       <span className="text-[10px] font-bold text-[#1B3022]/40 uppercase tracking-widest">{selectedLocation.distance}</span>
                    </div>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); setSelectedLocation(null); setSheetExpanded(false); }} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-[#1B3022]/30"><X size={18} /></button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-10">
                 {[
                   { icon: <Navigation size={20} />, label: 'directions' },
                   { icon: <Phone size={20} />, label: 'call' },
                   { icon: <Share2 size={20} />, label: 'share' },
                   { icon: <Bookmark size={20} />, label: 'save' }
                 ].map((action, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-2">
                      <button className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-[#1B3022] shadow-sm">{action.icon}</button>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#1B3022]/40">{t(action.label)}</span>
                   </div>
                 ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex-1 overflow-y-auto mb-8">
                 <p className="text-sm font-amiri text-[#1B3022]/60 italic leading-relaxed">{getAddress(selectedLocation)}</p>
              </div>

              <div className="mt-auto border-t border-gray-100 pt-6 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B3022]/5 flex items-center justify-center text-[#D4AF37]"><Clock size={20} /></div>
                    <div>
                       <p className="text-[9px] font-black text-[#1B3022]/30 uppercase tracking-widest">Next Prayer</p>
                       <p className="text-lg font-amiri font-bold text-[#1B3022]">العصر • 15:45</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;
