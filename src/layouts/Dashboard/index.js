import React from 'react';

export default class Dashboard extends React.Component {

    render() {
        return (
            <div className="dashboard">
                {this.props.children}
            </div>
        )
    }
}