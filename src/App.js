import React from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TweetList from "./TweetList";
import Typography from "@material-ui/core/Typography";
import WordAward from "./WordAward";
import TempPage from "./TempPage";
import NNList from "./NNList";

const Emoji = props => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

const useStyles = makeStyles(theme => ({
  root: {
    overflow: "hidden",
    flexGrow: 1
  },

  gridtable: {
    padding: 4
  }
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h1" style={{ margin: "20px 0px 20px 0px " }}>
        <Emoji symbol="🤦" /> COP => <Emoji symbol="🧟‍♀️" /> CHOI PARK LEE GOO LEE
      </Typography>
      <Grid container spacing={2} className={classes.gridtable}>
        <Grid item xs={12} sm={6}>
          <TweetList />
        </Grid>

        <Grid item xs={12} sm={6} spacing={1}>
          <Grid item xs={12} style={{ display: "flex" }}>
            <Paper style={{ flex: 1, height: 400, marginBottom: "15px" }}>
              <WordAward pn="-1" />
            </Paper>
            <Paper style={{ flex: 1, height: 400, marginBottom: "15px" }}>
              <WordAward pn="1" />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper style={{ height: 500 }}>
              <NNList />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
