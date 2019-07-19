import React, { Component } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { removeUser } from '../../actions/organization';

class DeleteUserModal extends Component {
    state = {
        open: false
    }

    close = () => this.setState({ open: false });

    open = () => this.setState({ open: true });

    componentWillReceiveProps(nextProps) {
        if (nextProps.removeUserSuccess) {
            this.close();
        }
    }

    removeUser = () => {
        console.log('REMOVE USER');
        this.props.removeUser(this.props.email);
    }

    render() {
        return (
            <Modal 
                trigger={
                    <Button onClick={this.open} icon color="red">
                        <Icon name='trash' />
                    </Button>
                } 
                basic 
                size='small'
                open={this.state.open}
                closeOnEscape={true}
                closeOnDimmerClick={true}
                onClose={this.close}
            >

                <Header icon='archive' content='Archive Old Messages' />
                
                <Modal.Content>
                    <p>
                        Are you sure you want to remove this user from your organization?
                    </p>
                </Modal.Content>

                <Modal.Actions>
                    <Button basic color='red' inverted onClick={this.close}>
                        <Icon name='remove' /> No
                    </Button>
                    <Button color='green' inverted onClick={this.removeUser}>
                        <Icon name='checkmark'/> Yes
                    </Button>
                </Modal.Actions>

            </Modal>
        )
    }
}

const mapStateToProps = ({ organization }) => ({
    ...organization
})

const mapDispatchToProps = (dispatch) => ({
    removeUser: (email) => dispatch(removeUser(email))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DeleteUserModal)
);