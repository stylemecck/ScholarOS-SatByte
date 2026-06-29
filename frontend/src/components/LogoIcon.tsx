import React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  monochrome?: boolean;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ monochrome = false, ...props }) => {
  const strokeColor1 = monochrome ? 'currentColor' : 'url(#logo-grad-yellow)';
  const strokeColor2 = monochrome ? 'currentColor' : 'url(#logo-grad-amber)';

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {!monochrome && (
        <defs>
          <linearGradient id="logo-grad-yellow" x1="216" y1="140" x2="380" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="logo-grad-amber" x1="296" y1="372" x2="132" y2="212" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>
      )}

      {/* Top hook element */}
      <path
        d="M 216 140 L 320 140 C 353.13 140 380 166.87 380 200 L 380 240 C 380 273.13 353.13 300 320 300 L 256 300"
        stroke={strokeColor1}
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Bottom hook element */}
      <path
        d="M 296 372 L 192 372 C 158.87 372 132 345.13 132 312 L 132 272 C 132 238.87 158.87 212 192 212 L 256 212"
        stroke={strokeColor2}
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
export default LogoIcon;
