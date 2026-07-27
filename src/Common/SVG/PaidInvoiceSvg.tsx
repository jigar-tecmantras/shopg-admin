import React from 'react';

const PaidInvoiceSvg: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      // xmlns:xlink="http://www.w3.org/1999/xlink"
      width="400"
      height="250"
      preserveAspectRatio="none"
      viewBox="0 0 400 250">
      <g mask='url("#SvgjsMask1608")' fill="none">
        <path
          d="M390 87L269 208"
          strokeWidth="10"
          stroke="url(#SvgjsLinearGradient1609)"
          strokeLinecap="round"
          className="TopRight"></path>
        <path
          d="M358 175L273 260"
          strokeWidth="8"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M319 84L189 214"
          strokeWidth="10"
          stroke="url(#SvgjsLinearGradient1609)"
          strokeLinecap="round"
          className="TopRight"></path>
        <path
          d="M327 218L216 329"
          strokeWidth="8"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M126 188L8 306"
          strokeWidth="8"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M220 241L155 306"
          strokeWidth="10"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M361 92L427 26"
          strokeWidth="6"
          stroke="url(#SvgjsLinearGradient1609)"
          strokeLinecap="round"
          className="TopRight"></path>
        <path
          d="M391 188L275 304"
          strokeWidth="8"
          stroke="url(#SvgjsLinearGradient1609)"
          strokeLinecap="round"
          className="TopRight"></path>
        <path
          d="M178 74L248 4"
          strokeWidth="10"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M84 52L-56 192"
          strokeWidth="6"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M183 111L247 47"
          strokeWidth="10"
          stroke="url(#SvgjsLinearGradient1610)"
          strokeLinecap="round"
          className="BottomLeft"></path>
        <path
          d="M46 8L209 -155"
          strokeWidth="6"
          stroke="url(#SvgjsLinearGradient1609)"
          strokeLinecap="round"
          className="TopRight"></path>
      </g>
      <defs>
        <mask id="SvgjsMask1608">
          <rect width="400" height="250" fill="#ffffff"></rect>
        </mask>
        <linearGradient
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          id="SvgjsLinearGradient1609">
          <stop stopColor="rgba(var(--tb-success-rgb), 0)" offset="0"></stop>
          <stop stopColor="rgba(var(--tb-success-rgb), 0.1)" offset="1"></stop>
        </linearGradient>
        <linearGradient
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
          id="SvgjsLinearGradient1610">
          <stop stopColor="rgba(var(--tb-success-rgb), 0)" offset="0"></stop>
          <stop stopColor="rgba(var(--tb-success-rgb), 0.1)" offset="1"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default PaidInvoiceSvg;
