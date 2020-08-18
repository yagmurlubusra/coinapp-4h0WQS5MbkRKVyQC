import React from 'react';
import './App.css';
import "bootstrap-css";
import ChangeHighlight from "react-change-highlight";

const date = new Date(2020, 7, 7, 10, 0, 0); // date does not matter
const apiUrl = 'https://api.coindesk.com/v1/bpi/currentprice.json';
let interval = null;

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      date: date,
      data: undefined
    }
    this.getRates = this.getRates.bind(this);
    this.changeClicked = this.changeClicked.bind(this);
  }

  componentDidMount() {
    this.getRates();

    interval = setInterval(() => {
      let sDate = this.state.date;
      sDate.setMilliseconds(sDate.getMilliseconds() - 1000);
      this.setState({ date: sDate })

      if (sDate.getSeconds() === 0) {
        this.getRates()
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  getRates() {
    fetch(apiUrl, { method: "GET" })
      .then(function (res) { return res.json() }).then(data => {
        this.setState({ data: data.bpi });
      })
      .catch(function (res) { console.log(res) })
  }

  changeClicked(op, portion) {
    let date = this.state.date;
    if (portion === "h") {
      date.setHours(date.getHours() + (op === "+" ? 1 : -1))
    } else if (portion === "m") {
      date.setMinutes(date.getMinutes() + (op === "+" ? 1 : -1))
    } else if (portion === "s") {
      date.setSeconds(date.getSeconds() + (op === "+" ? 1 : -1))
    }
    this.setState({ date: date });
  }

  render() {

    return (
      <div className="App">
        <TCompContainer date={this.state.date} changeClicked={this.changeClicked} />
     
        <TRateTable data={this.state.data} />
      </div >
    )
  }
}

export default App;


function TRateTable({ data }) {
  return (
    <div className="row" style={{ marginTop: 30 }}>
      <div className="col-md-6 offset-md-3">
        <h3>Rates table (Updates every minutes)</h3>
        {
          data &&
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="text-center">Code</th>
                <th className="text-center">Sybol</th>
                <th className="text-center">Rate</th>
                <th className="text-center">Description</th>
                <th className="text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(data).map(code => {
                  return (
                    <tr key={code}>
                      <td>{data[code].code}</td>
                      <td dangerouslySetInnerHTML={{ __html: data[code].symbol }}></td>
                      <td>{data[code].rate}</td>
                      <td>{data[code].description}</td>
                      <td className="text-right">
                        <ChangeHighlight>
                          <div ref={React.createRef()}>
                            {data[code].rate_float.toFixed(2)}
                          </div>
                        </ChangeHighlight>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}


function TCompContainer({ date, changeClicked }) {
  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div style={{ fontSize: 36, marginTop: 50 }}>
          <TComp date={date.getHours()} portion="h" changeClicked={changeClicked} />
          <TComp date={date.getMinutes()} portion="m" changeClicked={changeClicked} />
          <TComp date={date.getSeconds()} portion="s" changeClicked={changeClicked} />
        </div>
      </div>
    </div>
  )
}


function TComp({ date, portion, changeClicked }) {
  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <button type="button" style={{ fontSize: 18, padding: 8, paddingTop: 2, paddingBottom: 2 }} className="btn btn-warning" onClick={() => changeClicked("-", portion)}>-</button>
        <button type="button" style={{ fontSize: 18, padding: 8, paddingTop: 2, paddingBottom: 2, marginLeft: 5 }} className="btn btn-primary" onClick={() => changeClicked("+", portion)}>+</button>
        <br />
        {`${date < 10 ? "0" + date : date}`}
      </div>
      {
        portion === 'h' || portion === 'm' ?
          <div style={{ display: 'inline-block' }}>:</div>
          : undefined
      }
    </>
  )
}