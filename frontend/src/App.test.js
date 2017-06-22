import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import App, { Search, Button, Table } from './App';
import 'whatwg-fetch';

describe('App', () => {

	it('renders without crashing', async () => {
		const div = document.createElement('div');
		const app = await ReactDOM.render(<App />, div);
	});

	test('snapshots', async () => {
		const component = await renderer.create(
			<App />
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	})

});

describe('Search', () => {

	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Search>Search</Search>, div);
	});

	test('snapshot', () => {
		const component = renderer.create(
			<Search>Search</Search>
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	})
});

describe('Button', () => {
	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Button>Give Me More</Button>, div);
	});

	test('snapshot', () => {
		const component = renderer.create(
			<Button>Give Me More</Button>
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('Table', () => {
	const props = {
		list: [
			{ shop_name: '1', shop_owner: '1', shop_id: 1 },
			{ shop_name: '2', shop_owner: 2, shop_id: 2 },
		],
	};
	it('renders', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Table { ...props } />, div);
	});
	test('snapshots', () => {
		const component = renderer.create(
			<Table { ...props } />
		);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		it('shows two items in list', () => {
			const element = shallow(
				<Table { ...props } />
			);

			expect(element.find('.table-row').length).toBe(2);
		});

	});

});