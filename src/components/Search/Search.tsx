import React from 'react';
import { Menu, Dropdown } from 'antd';

const SearchResults = ({ searchResults, onItemClick }) => {
  const menu = (
    <Menu>
      {searchResults.map((product) => (
        <Menu.Item key={product.id} onClick={() => onItemClick(product)}>
          {product.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <div>Search Results</div>
    </Dropdown>
  );
};

export default SearchResults;
