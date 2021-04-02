import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './InfoBox.css';
function InfoBox({ title, cases, total, isGreen, isRed, active, ...props }) {
  return (
    <Card
      className={`infoBox ${active && 'infoBox--selected'} ${
        isRed && 'infoBox--red'
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography color='textSecondary' className='infoBox__title'>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${isGreen && 'infoBox__cases--green'}`}>
          {cases}
        </h2>
        <Typography color='textSecondary' className='infoBox__total'>
          {total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
