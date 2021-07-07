import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightBold,
    color: 'whitesmoke'
  },
  regular:{
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightRegular,
    color: 'whitesmoke'
  },
  rounded: {
    boxShadow: '0px 0px',
    backgroundColor: 'transparent'
  }
}));

export default function CommanderDamageAccordion(props) {
  const classes = useStyles();

  const commanderDamage = props.commanderDamage.map(commander => 
     <AccordionDetails><Typography className={classes.regular}><b>{commander.name}: </b>{commander.damage}</Typography></AccordionDetails>
  )

  return (
    <div className={classes.root}>
      <Accordion classes={{rounded: classes.rounded}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{fill: "whitesmoke"}} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Commander Damage</Typography>
        </AccordionSummary>
        {commanderDamage}
      </Accordion>
    </div>
  );
}
