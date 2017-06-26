import React, { Component } from 'react';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import Button from './Button';

const Sort = ({
                sortKey,
                activeSortKey,
                onSort,
                children,
              }) => {
  const sortClass = ['button-inline'];

  if (sortKey === activeSortKey) {
    sortClass.push('button-active');
  }

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass.join(' ')}
    >
      {children}
    </Button>);
};

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  activeSortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const SORTS = {
  NONE: list => list,
  NAME: list => sortBy(list, 'name'),
  OWNER: list => sortBy(list, 'owner'),
  SPECIALITY: list => sortBy(list, 'speciality'),
};

class Table extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NAME',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss,
    } = this.props;

    const {
      isSortReverse,
    } = this.state;

    let sortedList = list;
    if (list.length > 0) {
      sortedList = SORTS[this.state.sortKey](list);
    }
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <Sort
              sortKey={'NAME'}
              onSort={this.onSort}
              activeSortKey={this.state.sortKey}
            >
          Name
        </Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              sortKey={'OWNER'}
              onSort={this.onSort}
              activeSortKey={this.state.sortKey}
            >Owner</Sort>
          </span>
          <span style={{ width: '30%' }}>
            <Sort
              sortKey={'SPECIALITY'}
              onSort={this.onSort}
              activeSortKey={this.state.sortKey}
            >Speciality</Sort>
          </span>
          <span style={{ width: '10%' }}>
        Archive
      </span>
        </div>
        { reverseSortedList.map(item =>
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
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      shop_id: PropTypes.number.isRequired,
      shop_name: PropTypes.string,
      shop_owner: PropTypes.string,
      shop_speciality: PropTypes.string,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Table;
