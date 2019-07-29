import React from 'react';
import './style.scss'
export default class Tabs extends React.Component {

    render() {
        const {items, activeIndex, onActiveIndexChange} = this.props;

        return (
            <div className="tabs-container">
                {items && items.map((item, index) => (
                    <div className={`tab-item ${activeIndex === index ? 'active' : ''}`} key={`tabs-item-${item.title}`} onClick={() => onActiveIndexChange(index)}>
                        {item.title}
                    </div>
                ))}
            </div>
        )
    }
}