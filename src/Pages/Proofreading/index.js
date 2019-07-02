import React from 'react';
import UploadFormModal from './UploadFormModal';

class Proofreading extends React.Component {
    state = {
        uploadFormOpen: true,
    }
    
    onSubmit = (params) => {
    }

    render() {
        return (
            <div>
                <button  onClick={() => this.setState({ uploadFormOpen: true })}>
                    Open
                </button>
                <UploadFormModal open={this.state.uploadFormOpen} onClose={() => this.setState({ uploadFormOpen: false })} />
            </div>
        )
    }
}

export default Proofreading;