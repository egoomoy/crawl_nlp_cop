import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

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

export class NNList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 15,
      page: 0,
      isLoading: false,
      searchWord: "hyundai",
      selectedDate: new Date("2019-10-06T00:00:00"),
      simList: []
    };
  }

  updateSimList = data => {
    this.setState({ simList: data, isLoading: true });
  };

  NNSearch = () => {
    fetch("http://localhost:8899/GET/NN", {
      body: JSON.stringify({
        date: this.state.selectedDate,
        searchWord: this.state.searchWord
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      // .then(data => console.log(data))
      .then(data => this.updateSimList(data))
      .catch(e => console.log(e));
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  textFieldChange = e => {
    console.log(e.target.value);
    this.setState({ searchWord: e.target.value });
  };
  render() {
    const { selectedDate, isLoading, simList } = this.state;

    return (
      <div>
        <div>
          <div style={{ float: "left", position: "relative", width: "50%" }}>
            <Typography
              variant="h5"
              color="textPrimary"
              style={{ margin: "15px 20px 0px 20px" }}
            >
              NN EMBEDDING MOST SIMILAR
              <br />
              <Emoji symbol="🐶🐺🐱🐭🐹🐰🐸🐚🐯🐨🐻🐮🐗" />
            </Typography>
          </div>

          <div style={{ float: "left", position: "relative", width: "130px" }}>
            <TextField
              required
              id="standard-required"
              label="Required"
              defaultValue="hyundai"
              margin="normal"
              onChange={this.textFieldChange}
            />
          </div>

          <div
            style={{
              float: "left",
              marginTop: "10px",
              position: "relative"
            }}
          >
            <IconButton
              color="primary"
              aria-label="add to shopping cart"
              style={{ padding: "6px", marginRight: "10px", marginTop: "12px" }}
            >
              <PlayArrowIcon fontSize="large" onClick={this.NNSearch} />
            </IconButton>
          </div>

          <div style={{ float: "left", position: "relative" }}>
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

        <div>
          {isLoading ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">RANKING</TableCell>
                  <TableCell align="center">WORD</TableCell>
                  <TableCell align="center">RATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {simList.data.map(word => (
                  <TableRow key={word.idx}>
                    <TableCell align="center">{word.idx + 1}</TableCell>
                    <TableCell align="center">{word.word}</TableCell>
                    <TableCell align="center">{word.relative}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            "lo"
          )}
        </div>
      </div>
    );
  }
}

export default NNList;
