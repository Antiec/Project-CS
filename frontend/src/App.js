import React, { Component } from 'react';
import './css/App.css';

const coffeeList = [
  {
    name: 'Beans & Roses',
    roaster: 'Cafetoria',
    roast_level: 'City+',
    roast_date: 2017,
    objectID: 0,
  },
  {
    name: 'Brazil, vaalea',
    roaster: 'Paulig',
    roast_level: 'City+',
    roast_date: 2016,
    objectID: 1,
  },
];

const DEFAULT_QUERY = '';
const PATH_BASE = 'http://52.59.225.168:1337';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


function isSearched(searchTerm) {
  return function (item) {
    return !searchTerm || item.shop_name.toLowerCase().includes(searchTerm.toLowerCase());
  };
}

const Button = ({ onClick, className = '', children }) =>
  (<button
    onClick={onClick}
    className={className}
    type="button"
  >
    { children }
  </button>);

const Search = ({ value, onChange, onSubmit, children }) =>
  (<form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>);


const Table = ({ coffeeList, pattern, onDismiss }) =>
  (<div className="table">
    { coffeeList.map(item =>
      (<div key={item.shop_id} className="table-row">
        <span style={{ width: '40%' }}>{item.shop_name}</span>
        <span style={{ width: '30%' }}>{item.shop_owner}</span>
        <span style={{ width: '10%' }}>{item.shop_speciality}</span>
        <span style={{ width: '10%' }}>
          <Button className="button-inline" onClick={() => onDismiss(item.shop_id)}>
                                        Dismiss
          </Button>
        </span>
      </div>),
    )}
  </div>);


class App extends Component {
  constructor(props) {
    super(props);

    this.state = { result: null, coffeeList, searchTerm: DEFAULT_QUERY };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  onSearchChange(event) {
    if (event.target.value === 13) {
      this.onSearchSubmit(event);
    } else {
      this.setState({ searchTerm: event.target.value });
    }
    console.log(this.state.searchTerm);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    console.log('fetching:', `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`);
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then((response) => {
        console.log('before json:', response);
        return response.json();
      })
      .then((result) => {
        console.log('after json:', result);
        return this.setSearchTopstories(result);
      });
  }


  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
    event.preventDefault();
  }



  onDismiss(id) {
    console.log('id', id);
    const isNotId = item => item.shop_id !== id;
    console.log('before filter', this.state.result);
    const updatedList = this.state.result.filter(isNotId);
    console.log('after filter', updatedList);
    this.setState({ result: updatedList });
  }

  render() {
    const { result, coffeeList, searchTerm } = this.state;


    if (!result) { return null; }


    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >Search</Search>
        </div>
        { result &&
        <Table
          coffeeList={result}
          onDismiss={this.onDismiss}
        />

        }
      </div>
    );
  }
}

export default App;
