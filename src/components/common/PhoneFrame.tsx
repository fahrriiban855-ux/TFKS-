import React from 'react';
import { Wifi, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  dynamicIslandContent?: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title = 'MotoPilot',
  dynamicIslandContent,
}) => {
  return (
    <div className="mx-auto w-full max-w-[410px] h-[820px] bg-[#000000] rounded-[52px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12),inset_0_0_0_2px_rgba(60,60,65,0.7)] relative flex flex-col select-none ring-1 ring-white/10">
      {/* Outer Titanium Rim Accent */}
      <div className="w-full h-full rounded-[44px] overflow-hidden bg-[#0A0A0C] border border-white/10 relative flex flex-col">
        {/* iOS Dynamic Island & Status Bar */}
        <div className="w-full h-11 px-7 flex items-center justify-between text-white text-[12px] font-semibold shrink-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/[0.04]">
          {/* iOS Clock */}
          <span className="font-semibold tracking-tight text-[#F5F5F7] text-[13px]">
            09:41
          </span>
          
          {/* Apple Dynamic Island */}
          <div className="h-7 px-3.5 bg-black rounded-full border border-white/10 flex items-center gap-2 shadow-inner transition-all duration-300">
            {dynamicIslandContent ? (
              <div className="flex items-center gap-2 text-[10px] font-medium text-[#F5F5F7]">
                <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse shadow-[0_0_6px_#30D158]" />
                <span className="truncate max-w-[140px]">{dynamicIslandContent}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E] ring-1 ring-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0071E3]/80 animate-pulse" />
              </div>
            )}
          </div>

          {/* iOS Indicators: Cellular, WiFi, Battery */}
          <div className="flex items-center gap-2 text-[#F5F5F7]">
            <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <div className="w-[22px] h-[11px] border-[1.2px] border-white/80 rounded-[3.5px] p-[1.5px] flex items-center relative">
              <div className="h-full w-full bg-[#30D158] rounded-[1.5px]" />
              <div className="absolute -right-[3px] top-[2.5px] w-[1.5px] h-[4px] bg-white/60 rounded-r-xs" />
            </div>
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 w-full h-[calc(100%-44px-18px)] overflow-hidden bg-[#0A0A0C] text-[#F5F5F7] relative flex flex-col">
          {children}
        </div>

        {/* Apple Home Indicator */}
        <div className="w-full h-5 flex items-center justify-center shrink-0 z-40 bg-black/80 backdrop-blur-md">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
