import React from 'react'
import PropTypes from 'prop-types';

const Two = ({ media, current, renderItem }) =>
  <div style={{ height: '100%'}}>
    {media.map((item, index) => {
      const isActive = index === current

      return (
        <div className={isActive ? 'two-active' : 'two'} key={index}>
          {renderItem(item, isActive)}
        </div>
      )
    })}
  </div>

Two.propTypes = {
  media: PropTypes.array.isRequired,
  current: PropTypes.number,
  renderItem: PropTypes.func,
}

export default Two
