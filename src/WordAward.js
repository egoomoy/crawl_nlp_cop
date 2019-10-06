import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

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

export class WordAward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      words: [],
      selectedDate: new Date("2019-10-05T00:00:00")
    };
  }

  updateWord = data => {
    this.setState({ words: data, isLoading: true });
  };

  fetchWord = () => {
    // console.log("fetchTweet");
    fetch("http://localhost:8899/GET/WORD", {
      body: JSON.stringify({
        date: this.state.selectedDate,
        pn: this.props.pn
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => this.updateWord(data))
      // .then(data => console.log(data))
      .catch(e => console.log(e));
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
    this.fetchWord();
    //여기서 날리자
  };

  render() {
    const { selectedDate, isLoading, words } = this.state;

    return (
      <div>
        <div>
          <div>
            <Typography
              variant="h5"
              color="textPrimary"
              style={{ margin: "10px 10px 0px 10px ", float: "left" }}
            >
              Word Award
              {this.props.pn === "1" ? (
                <Emoji symbol="🏅" />
              ) : (
                <Emoji symbol="👿" />
              )}
              <br />
              <Typography style={{ paddingLeft: "30px" }} variant="overline">
                {this.props.pn === "1" ? "<POSITIVE>" : "<NEGATIVE>"}
              </Typography>
            </Typography>

            <div style={{ float: "left" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={selectedDate}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </div>

        <div>
          {isLoading ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">RANKING</TableCell>
                  <TableCell align="center">WORD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {words.data.map(word => (
                  <TableRow key={word.idx}>
                    <TableCell align="center">{word.idx + 1}</TableCell>
                    <TableCell align="center">{word.word}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            "LOADING"
          )}
        </div>
      </div>
    );
  }
}

export default WordAward;
