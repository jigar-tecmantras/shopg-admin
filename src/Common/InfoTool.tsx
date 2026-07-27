import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import InfoCircleSvg from './SVG/InfoCircleSvg';

const TooltipWithInfoIcon = ({text}: {text: string}): JSX.Element => {
  const renderTooltip = (): JSX.Element => (
    <Tooltip id="tooltip">{text}</Tooltip>
  );

  return (
    <div style={{marginLeft: '10px', position: 'relative'}}>
      <OverlayTrigger
        placement="right"
        delay={{show: 300, hide: 400}}
        overlay={renderTooltip()}>
        <div style={{display: 'inline-block', position: 'relative'}}>
          <InfoCircleSvg width="16px" height="16px" />
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default TooltipWithInfoIcon;
