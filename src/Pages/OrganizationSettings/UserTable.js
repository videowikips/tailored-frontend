import React from 'react'
import { List } from 'semantic-ui-react'

const TableExamplePadded = () => (
    <List divided relaxed>

        <List.Item>

            <List.Icon name='user' size='large' verticalAlign='middle' />

            <List.Content>

                <div>
                    <span  className="invite-name bold-text">Pratik Shetty</span>  pratik.shetty@tlrindia.com

                    <div className="pull-right">
                        <button className="ui red button">Delete</button>
                    </div>

                </div>

                <div>
                    <div className="ui blue horizontal label">Organization Owner</div>
                    <div className="ui blue horizontal label">Admin</div>
                    <div className="ui green horizontal label">Activated</div>
                </div>

            </List.Content>

        </List.Item>

        <List.Item>

            <List.Icon name='user' size='large' verticalAlign='middle' />

            <List.Content>

                <div>
                    <span className="invite-name bold-text">Janith Kasun</span>  janithisipathana@gmail.com
            
                    <div className="pull-right">
                        <button className="ui red button">Delete</button>
                    </div>

                </div>

                <div>
                    <div className="ui blue horizontal label">Organization Owner</div>
                    <div className="ui blue horizontal label">Admin</div>
                    <div className="ui red horizontal label">Not Activated</div>
                </div>

            </List.Content>

        </List.Item>

    </List >
)

export default TableExamplePadded