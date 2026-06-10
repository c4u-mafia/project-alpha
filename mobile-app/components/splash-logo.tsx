import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

export const SplashLogo = () => {
  return (
    <Svg width={56} height={51} viewBox="-8 -2 96 88" fill="none">
      {/* House body */}
      <Rect x={0} y={38} width={80} height={48} rx={4} fill="#FAF7F2" />
      {/* Roof triangle */}
      <Path d="M -8 42 L 40 -2 L 88 42 Z" fill="#FAF7F2" />
      {/* Chevron accent on roof */}
      <Path
        d="M 26 22 L 40 8 L 54 22"
        fill="none"
        stroke="#0E7C7B"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Doorknob */}
      <Circle cx={40} cy={62} r={5} fill="#F2A65A" />
    </Svg>
  );
};
