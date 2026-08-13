import React from "react";

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-6 h-16 z-50 flex-shrink-0">
      <div className="flex items-center gap-6 flex-1">
        <h1 className="font-headline-md text-headline-md font-bold text-[#001a48] tracking-tight">
          HYUNDAI GLOVIS
        </h1>
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-[20px]">
            search
          </span>
          <input
            className="w-full h-8 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-full font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search contracts, vessels..."
            type="text"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 shrink-0">
        <button
          aria-label="help"
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>
        <button
          aria-label="settings"
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
        <button
          aria-label="notifications"
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors relative"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2 shrink-0">
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUbv9zXdeMHyyPaiechUH6WKqRTZrrIQ8xkR3y4BPPMs6JTV8Ue3oGlUAQWzP6HcoRIx00PXIZTNsEMdCevWJNG9KXf-r1QTgPGJ5n36Dmu_xEmezCtQRZ7hFMZPY9HW6Z8ibClPKhOFR0HtjCDKZ83rzpBC3BLSm8_uSWcRV1SAaU6AwuGsDrmc3pdiVfRDKhki2lqHXDJ0stYVH_MawKx92rdd6Wy5IPF20mJUYHQmYxv5obwY45"
            onError={(e) => {
              // Fallback image or avatar if external img load fails
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
            }}
          />
        </div>
      </div>
    </header>
  );
};
