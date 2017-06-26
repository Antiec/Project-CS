import React, { Component } from 'react';
import './css/App.css';
import Table from './Table';
import Button from './Button';
import SearchWithLoading from './Search';

const DEFAULT_QUERY = '';
const PATH_BASE = 'http://52.59.225.168:1337';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: DEFAULT_QUERY,
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.updateSearchTopStoriesState = this.updateSearchTopStoriesState.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }


  async componentDidMount() {
    const { searchTerm } = this.state;
    try {
      await this.fetchSearchTopStories(searchTerm);
    } catch (err) {
      console.error('componentDidMount: ', err);
    }
  }

  updateSearchTopStoriesState = hits => (prevState) => {
    const { searchKey, results } = prevState;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits,
    ];
    console.log('search results', updatedHits);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits },
        isLoading: false,
      },
    });
  };

  onSearchChange(event) {
    if (event.target.value === 13) {
      this.onSearchSubmit(event);
    } else {
      this.setState({ searchTerm: event.target.value });
    }
    console.log(this.state.searchTerm);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    console.log('searchTerm:', searchTerm);
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
        .then(() => console.log('Fetch Success'))
        .catch(err => console.error('Error in Fetch:', err));
    }
    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits } = results[searchKey];

    const isNotId = item => item.shop_id !== id;

    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits },
      },
    });
  }

  setSearchTopstories(result) {
    const hits = result;

    this.setState(this.updateSearchTopStoriesState(hits));
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }


  async fetchSearchTopStories(searchTerm) {
    this.setState({ isLoading: true });
    try {
      console.info('fetching:', `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`);

      const response = await fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`);

      console.info('before json:', response);
      const jsonResponse = await response.json();
      console.info('after json:', jsonResponse);
      this.setSearchTopstories(jsonResponse);
      this.setState({ isLoading: false });
    } catch (error) {
      console.error(`FetchSearchTopStories - Error: ${error.stack}`);
    }
  }

  render() {
    const {
      results,
      searchKey,
      searchTerm,
      isLoading,
    } = this.state;

    console.log('results', results);
    if (results && results[searchKey]) { console.log('with key', results[searchKey]); }
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) ? results[searchKey].hits : [];

    console.log('list', list);
    return (
      <div className="page">
        <div className="interactions">
          <SearchWithLoading
            isLoading={isLoading}
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
          Search
          </SearchWithLoading>
        </div>
        <Table
          list={list}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;

