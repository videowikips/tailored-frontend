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
                        <button class="ui red button">Delete</button>
                    </div>

                </div>

                <div>
                    <div class="ui blue horizontal label">Organization Owner</div>
                    <div class="ui blue horizontal label">Admin</div>
                    <div class="ui green horizontal label">Activated</div>
                </div>

            </List.Content>

        </List.Item>

        <List.Item>

            <List.Icon name='user' size='large' verticalAlign='middle' />

            <List.Content>

                <div>
                    <span className="invite-name bold-text">Janith Kasun</span>  janithisipathana@gmail.com
            
                    <div className="pull-right">
                        <button class="ui red button">Delete</button>
                    </div>

                </div>

                <div>
                    <div class="ui blue horizontal label">Organization Owner</div>
                    <div class="ui blue horizontal label">Admin</div>
                    <div class="ui red horizontal label">Not Activated</div>
                </div>

            </List.Content>

        </List.Item>

    </List >
)

export default TableExamplePadded