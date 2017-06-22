import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import { sortBy } from 'lodash';
import './css/App.css';


const DEFAULT_QUERY = '';
const PATH_BASE = 'http://52.59.225.168:1337';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


function isSearched(searchTerm) {
	return function (item) {
		return !searchTerm || item.shop_name.toLowerCase().includes(searchTerm.toLowerCase());
	};
}

const Button = ({onClick, className, children}) =>
	(<button
		onClick={onClick}
		className={className}
		type="button"
	>
		{ children }
	</button>);
/*
Button.propTypes = {
	onClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

Button.defaultProps = {
	className: '',
};
*/

const SORTS = {
	NONE: list => list,
	NAME: list => sortBy(list, 'name'),
	OWNER: list => sortBy(list, 'owner'),
	SPECIALITY: list => sortBy(list, 'speciality'),
}

class Search extends Component {

	componentDidMount(){
		this.input.focus();
	}

	render() {
		const {
			value,
			onChange,
			onSubmit,
			children,
		} = this.props;


		return (
			<form onSubmit={onSubmit}>
				<input
					type="text"
					value={value}
					onChange={onChange}
					ref={(node) => { this.input = node; }}
				/>
				<button type="submit">
					{children}
				</button>
			</form>
		);
	}
}

const Sort = ({
	sortKey,
	activeSortKey,
	onSort,
	children,
}) => {
	const sortClass = ['button-inline']

	if( sortKey === activeSortKey ){
		sortClass.push('button-active');
	}

	return (
		<Button
			onClick={() => onSort(sortKey)}
			className={sortClass.join(' ')}>
			{children}
		</Button>);
}

const Loading = () => <div>Loading ...</div>

const Table = ({
	list,
	sortKey,
	isSortReverse,
	onSort,
	onDismiss
}) => {
	const sortedList = SORTS[sortKey](list);
	const reverseSortedList = isSortReverse
		? sortedList.reverse()
			: sortedList;

	return (
		<div className="table">
		<div className="table-header">
			<span style={{ width: '40%'}}>
				<Sort
					sortKey={'NAME'}
					onSort={onSort}
					activeSortKey={sortKey}
				>
					Name
				</Sort>
			</span>
			<span style={{ width: '30%'}}>
				<Sort
				sortKey={'OWNER'}
				onSort={onSort}
				activeSortKey={sortKey}
				>Owner</Sort>
			</span>
			<span style={{ width: '30%'}}>
				<Sort
					sortKey={'SPECIALITY'}
					onSort={onSort}
					activeSortKey={sortKey}
				>Speciality</Sort>
			</span>
			<span style={{ width: '10%'}}>
				Archive
			</span>
		</div>
		{ reverseSortedList.map(item =>
			(<div key={item.shop_id} className="table-row">
				<span style={{width: '40%'}}>{item.shop_name}</span>
				<span style={{width: '30%'}}>{item.shop_owner}</span>
				<span style={{width: '10%'}}>{item.shop_speciality}</span>
				<span style={{width: '10%'}}>
          <Button className="button-inline" onClick={() => onDismiss(item.shop_id)}>
                                        Dismiss
          </Button>
        </span>
			</div>),
		)}
	</div>
	);
}

/*
Table.propTypes = {
	list: PropTypes.arrayOf(
		PropTypes.shape({
			shop_id: PropTypes.number.isRequired,
			shop_name: PropTypes.string,
			shop_owner: PropTypes.string,
			shop_speciality: PropTypes.string,
		})
	).isRequired,
	onDismiss: PropTypes.func.isRequired
}
*/

const withLoading = (Component) => ({ isLoading, ...rest }) =>
	isLoading ? <Loading /> : <Component { ...rest } />


const SearchWithLoading = withLoading(Search);

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			isLoading: false,
			sortKey: 'NONE',
			isSortReverse: false,
		};

		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.setSearchTopstories = this.setSearchTopstories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.onSort = this.onSort.bind(this);
	}

	onSort(sortKey) {
		const isSortReverse = this.state.sortKey  === sortKey && !this.state.isSortReverse;
		this.setState({ sortKey, isSortReverse });
	}

	async componentDidMount() {
		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm})
		try {
			await this.fetchSearchTopStories(searchTerm)

		}catch(err){
			console.error("componentDidMount: ", err);
		}
	}

	needsToSearchTopStories(searchTerm) {
		return !this.state.results[searchTerm];
	}

	onSearchChange(event) {
		if (event.target.value === 13) {
			this.onSearchSubmit(event);
		} else {
			this.setState({searchTerm: event.target.value});
		}
		console.log(this.state.searchTerm);
	}

	setSearchTopstories(result) {
		const hits = result;
		const {searchKey, results} = this.state;
		console.log("search results", result, hits)
		const oldHits = results && results[searchKey]
			? results[searchKey].hits
			: [];

		const updatedHits = [
			...oldHits,
			...hits,
		];
		console.log("search results", updatedHits)
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits},
				isLoading: false,
			}
		});
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
				this.setState({ isLoading: false})
		} catch (error) {
			console.error(`FetchSearchTopStories - Error: ${error.stack}`);
		}

	}


	onSearchSubmit(event) {
		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm});
		console.log("searchTerm:", searchTerm);
		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm)
				.then(() => console.log('Fetch Success'))
				.catch((err) => console.error('Error in Fetch:', err));
		}
		event.preventDefault();
	}



	onDismiss(id) {
		const {searchKey, results} = this.state;
		const {hits} = results[searchKey];

		const isNotId = item => item.shop_id !== id;

		const updatedHits = hits.filter(isNotId);

		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits}
			}
		});
	}

	render() {
		const {
			results,
			searchKey,
			searchTerm,
			isLoading,
			sortKey,
			isSortReverse,
		} = this.state;

		console.log("results", results)
		if (results && results[searchKey])
			console.log("with key", results[searchKey])
		const list = (
			results &&
			results[searchKey] &&
			results[searchKey].hits
		) ? results[searchKey].hits : [];

		console.log("list", list)
		return (
			<div className="page">
				<div className="interactions">
					<SearchWithLoading
						isLoading={isLoading}
							value={searchTerm}
							onChange={this.onSearchChange}
							onSubmit={this.onSearchSubmit}>
					Search
					</SearchWithLoading>
				</div>
				<Table
					list={list}
					sortKey={sortKey}
					isSortReverse={isSortReverse}
					onSort={this.onSort}
					onDismiss={this.onDismiss}
				/>
			</div>
		);
	}
}

export default App;

export{
	Button,
	Search,
	Table,
};

