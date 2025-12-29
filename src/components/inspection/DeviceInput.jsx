import React, { useState, useEffect, useRef } from "react";
import { Smartphone, Search, X } from "lucide-react";

const DeviceInput = ({ deviceName, setDeviceName }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const allDevices = [
    "Apple",
    "Samsung",
    "Google",
    "OnePlus",
    "Xiaomi",
    "Redmi",
    "iPad",
    "Motorola",
    "Nokia",
    "Sony",
    "LG",
    "HTC",
    "Realme",
    "Vivo",
    "Oppo",
    "Nothing",
  ];

  const filteredDevices = allDevices.filter((device) =>
    device.toLowerCase().includes(deviceName.toLowerCase())
  );

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div
      className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm relative z-20"
      ref={wrapperRef}
    >
      <label className="text-xs font-semibold text-blue-400 uppercase  mb-2 flex items-center gap-2">
        <Smartphone size={14} /> Target Device
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder="Type device name (e.g. iPhone)..."
          value={deviceName}
          onChange={(e) => {
            setDeviceName(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full text-sm md:text-md font-semibold text-slate-800 placeholder-slate-300 bg-transparent border-none outline-none focus:ring-0"
        />

        {deviceName ? (
          <button
            onClick={() => {
              setDeviceName("");
              setShowDropdown(false);
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        ) : (
          <Search
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none"
            size={24}
          />
        )}

        {showDropdown && filteredDevices.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200">
            {filteredDevices.map((device, index) => (
              <div
                key={index}
                onClick={() => {
                  setDeviceName(device);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors border-b border-slate-50 last:border-none"
              >
                <Smartphone size={16} className="text-slate-400" />
                <span className="font-medium text-sm">{device}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceInput;
