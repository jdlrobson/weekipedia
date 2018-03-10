import React from 'react'

const SVGFilter = () => {
  return (
    <svg>
      <filter id="filter-normal-icon" colorInterpolationFilters="sRGB"
        x="0" y="0" height="100%" width="100%">
        <feColorMatrix type="matrix"
          values="0.33 0    0    0 0
                  0    0.35 0    0 0
                  0    0    0.36 0 0
                  0    0    0    1   0" />
      </filter>
      <filter id="filter-progressive-icon" colorInterpolationFilters="sRGB"
        x="0" y="0" height="100%" width="100%">
        <feColorMatrix type="matrix"
          values="0.2 0   0   0 0
                  0   0.4 0   0 0
                  0   0   0.8 0 0
                          0   0   0   1   0" />
      </filter>
    </svg>
  );
};

export default SVGFilter;
