import * as React from 'react';

const YuktaLogo = ({
  width = 48,
  height = 48,
  color = 'currentColor',
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 48 48"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill={color}
        fillRule="evenodd"
        d="M17.752.388a.48.48 0 0 0-.693 0l-5.432 5.658a.48.48 0 0 0 0 .665l1.397 1.456a.48.48 0 0 0 .693 0l5.432-5.659a.48.48 0 0 0 0-.664L17.752.388ZM38.606 8.34a.48.48 0 0 0-.692 0l-7.931 8.26a.48.48 0 0 0 0 .665l1.398 1.456a.48.48 0 0 0 .692 0l7.93-8.26a.48.48 0 0 0 0-.665L38.607 8.34Zm-29.335.012a.48.48 0 0 1 .692 0l7.93 8.26a.48.48 0 0 1 0 .665l-1.397 1.456a.48.48 0 0 1-.692 0l-7.931-8.26a.48.48 0 0 1 0-.666L9.27 8.352Zm4.954 15.08a.48.48 0 0 0-.346.148L2.316 35.624a.457.457 0 0 1-.665 0L.253 34.167a.504.504 0 0 1 0-.692l12.225-12.733a.471.471 0 0 1 .13-.097c.169-.083.369-.155.548-.207a.48.48 0 0 1 .134-.02h21.173c.064 0 .124.013.18.036.183.073.388.176.553.285a.478.478 0 0 1 .08.067l12.225 12.733a.504.504 0 0 1 0 .693l-1.398 1.456a.457.457 0 0 1-.665 0L33.813 23.58a.48.48 0 0 0-.346-.148H14.225Zm10-22.856a.48.48 0 0 0-.679 0l-8.667 8.667a.48.48 0 0 0 0 .679l8.667 8.666a.48.48 0 0 0 .679 0l8.667-8.666a.48.48 0 0 0 0-.68L24.225.577Zm-.317 7.158a1.605 1.605 0 1 0 0-3.21 1.605 1.605 0 0 0 0 3.21ZM12.045 36.087a.48.48 0 0 1 0-.68L23.58 23.875a.48.48 0 0 1 .679 0l11.534 11.534a.48.48 0 0 1 0 .679L24.258 47.62a.48.48 0 0 1-.679 0L12.045 36.087Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill={color} d="M0 0h48v48H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default YuktaLogo;
