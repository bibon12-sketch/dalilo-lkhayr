
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

// Fix: Declare google as any to resolve "Cannot find namespace 'google'" and "Cannot find name 'google'" errors.
declare var google: any;

const DEFAULT_CENTER = { lat: 44.8378, lng: -0.5792 }; // Bordeaux, France
const DEFAULT_ZOOM = 13;

const DISCOVERY_API_ENDPOINT = "/api/discover";

const DiscoverScreen: React.FC<{ language: Language }> = ({ language }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mosque' | 'halal'>('all');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  // Fix: Use any for google.maps.LatLngLiteral type to resolve missing namespace error
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  // Fix: Use any for google.maps.Map type to resolve missing namespace error
  const mapRef = useRef<any | null>(null);
  const googleMapDivRef = useRef<HTMLDivElement>(null);
  // Fix: Use any[] for google.maps.Marker[] type to resolve missing namespace error
  const markersRef = useRef<any[]>([]);
  // Fix: Use any for google.maps.Marker type to resolve missing namespace error
  const userMarkerRef = useRef<any | null>(null);
  const discoveringRef = useRef(false);

  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  const fetchLocations = useCallback(async () => {
    try {
      const data = await supabaseService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  }, []);

  const triggerDiscovery = useCallback(async (center: { lat: number, lng: number }) => {
    if (discoveringRef.current) return;
    
    discoveringRef.current = true;
    setIsDiscovering(true);
    setErrorStatus(null);
    
    try {
      const response = await fetch(DISCOVERY_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: center.lat, lng: center.lng })
      });

      if (response.ok) {
        await fetchLocations();
      } else {
        setErrorStatus("Discovery Unavailable");
      }
    } catch (error) {
      setErrorStatus("Connection Error");
    } finally {
      discoveringRef.current = false;
      setIsDiscovering(false);
    }
  }, [fetchLocations]);

  // Google Maps Initialization
  useEffect(() => {
    // Fix: Access window.google with any casting to handle missing property on Window type
    if (googleMapDivRef.current && !mapRef.current && (window as any).google) {
      mapRef.current = new google.maps.Map(googleMapDivRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        disableDefaultUI: true,
        styles: [
          { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#1B3022" }] },
          { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#F5F5F5" }] },
          { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#E5E7EB" }] },
          { "featureType": "poi", "stylers": [{ "visibility": "off" }] }
        ]
      });

      mapRef.current.addListener('idle', () => {
        const center = mapRef.current?.getCenter();
        if (center) {
          triggerDiscovery({ lat: center.lat(), lng: center.lng() });
        }
      });
    }
  }, [triggerDiscovery]);

  // User Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          if (mapRef.current) {
            mapRef.current.setCenter(coords);
            mapRef.current.setZoom(15);
          }
        },
        () => console.warn("Location permission denied."),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Sync Markers
  useEffect(() => {
    // Fix: Access window.google with any casting to handle missing property on Window type
    if (!mapRef.current || !(window as any).google) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // User Marker
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(userLocation);
      } else {
        userMarkerRef.current = new google.maps.Marker({
          position: userLocation,
          map: mapRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 4,
            scale: 10,
          },
          title: "Your Location"
        });
      }
    }

    // Business Markers
    locations
      .filter(loc => activeFilter === 'all' || loc.type === activeFilter)
      .forEach(loc => {
        const isMosque = loc.type === 'mosque';
        const color = isMosque ? '#1B3022' : '#C5A059';
        
        const marker = new google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map: mapRef.current!,
          title: loc.name_en,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 8,
          }
        });

        marker.addListener('click', () => {
          setSelectedLocation(loc);
          setSheetExpanded(true);
          mapRef.current?.panTo({ lat: loc.lat, lng: loc.lng });
        });

        markersRef.current.push(marker);
      });
  }, [locations, userLocation, activeFilter]);

  const handleCenterOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(15);
    }
  };

  const handleManualSync = () => {
    const center = mapRef.current?.getCenter();
    if (center) {
      triggerDiscovery({ lat: center.lat(), lng: center.lng() });
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
        ref={googleMapDivRef} 
        className="absolute inset-0 z-0"
      ></div>

      {/* Sync State Overlay */}
      {(isDiscovering || errorStatus) && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[1000] animate-8k w-max">
          <div className={`${errorStatus ? 'bg-red-500' : 'bg-[#1B3022]'} backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3`}>
             {errorStatus ? <AlertTriangle size={14} className="text-white" /> : <Zap size={14} className="text-[#C5A059] animate-pulse" />}
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
               {errorStatus || "Syncing with n8n..."}
             </span>
             {!errorStatus && <RefreshCw size={12} className="text-[#C5A059] animate-spin" />}
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
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
               className={`w-11 h-11 bg-white border border-black/5 rounded-xl shadow-xl flex items-center justify-center transition-all active:scale-95 ${isDiscovering ? 'opacity-50 cursor-not-allowed' : 'text-[#1B3022]'}`}
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

      {/* Detail Slide Up Sheet */}
      <div 
        className={`absolute bottom-0 start-0 end-0 z-[2000] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${selectedLocation ? 'translate-y-0' : 'translate-y-[85%]'}`}
        style={{ height: sheetExpanded ? '60vh' : '10vh' }}
      >
        <div className={`h-full bg-[#FBFCF8] rounded-t-[3.5rem] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-[#D4AF37]/20 relative flex flex-col ${!sheetExpanded && 'cursor-pointer'}`} onClick={() => !sheetExpanded && setSheetExpanded(true)}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1B3022]/10 rounded-full"></div>
          
          {!selectedLocation ? (
            <div className="h-full flex items-center justify-center">
               <p className="text-[10px] font-black text-[#1B3022]/20 uppercase tracking-[0.4em]">Explore nearby halal services</p>
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
