import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PaperP } from '@containers';
import {
  CloudQueue as CloudIcon,
  Memory as AiIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

import {ItemPromo} from "./$refactor";

export default function Technology() {
  const items = [
    { icon: (sz)=> <CloudIcon fontSize={sz} color="primary" />, label: 'Servicios en la nube' },
    { icon: (sz)=> <AiIcon fontSize={sz} color="primary" />, label: 'Inteligencia Artificial' },
    { icon: (sz)=> <StorageIcon fontSize={sz} color="primary" />, label: 'APIs robustas' },
  ];
  return (
    <PaperP sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Tecnología
        </Typography>
        <hr />
        <br />
        <Grid container spacing={4} justifyContent="center">
          {items.map((item, i) => (
            <ItemPromo item={item} xs={12} sm={4} key={i}/>
          ))}
        </Grid>
    </PaperP>
  );
}
