import React from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button }  from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
root: {
    flexGrow: 1,
},
title: {
    flexGrow: 1,
},
button: {
    color: 'inherit',
    '&:hover': {
        color: '#dddddd'
    }
}
}));

export default function ButtonAppBar(props) {


const classes = useStyles();

console.log(props.isLoggedIn);
console.log(props.logout);


return (
    <div className={classes.root}>
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
                Game Dashboard
            </Typography>
            {props.isLoggedIn 
                ? <Button color="inherit" className={classes.button} onClick ={props.logout}>Logout</Button>
                : <Button color="inherit" className={classes.button} href='/api/discord/login' >Login with Discord</Button>}
        </Toolbar>
    </AppBar>
    </div>
);
}