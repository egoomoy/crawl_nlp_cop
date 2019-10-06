import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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

// nomalizedtext,created_at, subjectivity, polarity
const columns = [
  { id: "id", label: "ID", maxWidth: 10, align: "center" },
  {
    id: "nomalizedtext",
    label: "nomalizedtext",
    maxWidth: 300,
    align: "center"
  },
  {
    id: "created_at",
    label: "created_at",
    maxWidth: 12,
    align: "center"
  },
  { id: "subjectivity", label: "subjectivity", maxWidth: 5, align: "center" },
  {
    id: "polarity",
    label: "polarity",
    maxWidth: 5,
    align: "center",
    emoji: true
  }
];

export class TweetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 15,
      page: 0,
      isLoading: false,
      twitter: [],
      selectedDate: new Date("2019-10-04T00:00:00")
    };
  }

  updatetweet = data => {
    this.setState({ twitter: data, isLoading: true });
    // console.log(this.state);
  };

  fetchTweet = () => {
    // console.log("fetchTweet");
    fetch("http://localhost:8899/GET/TWEET", {
      body: JSON.stringify(this.state.selectedDate),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => this.updatetweet(data))
      .catch(e => console.log(e));
  };

  handleChangePage = (event, newPage) => {
    // setPage(newPage);
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = event => {
    // setRowsPerPage(+event.target.value);
    this.setState({ rowsPerPage: +event.target.value });
    this.setState({ page: 0 });
    // setPage(0);
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
    // setSelectedDate(date);
  };

  render() {
    const { rowsPerPage, page, selectedDate, isLoading, twitter } = this.state;

    return (
      <Paper square="true">
        <div style={{ display: "flex" }}>
          <Typography
            variant="h5"
            color="textPrimary"
            style={{ flex: 4, margin: "15px 0px 10px 10px " }}
          >
            Twitter <Emoji symbol="🐦" /> Table Of Sentiment <br /> About
            Hyundai Motors Group... <Emoji symbol="🏎" /> :)
          </Typography>
          <div style={{ flex: 2 }}>
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
          <div
            style={{
              flex: 1,
              margin: "25px 0px 0px 0px ",
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={this.fetchTweet}
            >
              REQUEST
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        Width: column.maxWidth,
                        fontWeight: "bold",
                        height: 10,
                        padding: 10,
                        backgroundColor: "#ffffff",
                        borderBottomColor: "#ffffff",
                        color: "#000000"
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {twitter.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map(column => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              style={{
                                backgroundColor: "#ffffff",
                                borderBottomColor: "#e0e0e0",
                                color: "#000000",
                                paddingLeft: 10,
                                paddingRight: 10
                              }}
                              key={column.id}
                              align={column.align}
                            >
                              {column.id !== "polarity" ? (
                                value
                              ) : value < 0 ? (
                                <Emoji symbol="😭" />
                              ) : (
                                <Emoji symbol="😍" />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        ) : (
          "loading"
        )}

        <TablePagination
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
          rowsPerPageOptions={[15, 50, 100]}
          component="div"
          count={isLoading ? twitter.data.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

export default TweetList;

// constructor(props) {
//   super(props);
//   this.state = { isLoading: false, twitter: [] };
// }

// updatetweet = data => {
//   this.setState({ twitter: data, isLoading: true });
//   console.log(this.state);
// };

// fetchTweet = () => {
//   // console.log("fetchTweet");
//   fetch("http://localhost:8899/GET/TWEET", { method: "GET" })
//     .then(response => response.json())
//     .then(data => this.updatetweet(data))
//     .catch(e => console.log(e));
// };

// fetchCloud = () => {
//   console.log("fetchCloud");
//   fetch("http://localhost:8899/GET/CLOUD", { method: "GET" })
//     .then(console.log("fetchCloud"))
//     .catch(e => console.log(e));
// };
