import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Grid, Modal } from 'semantic-ui-react';
import { debounce } from '../../shared/utils/helpers';

function mapSpeakersToDropdownOptions(speakers) {
    return speakers.map((speaker) => ({ text: speaker.speakerNumber === -1 ? 'Background Music' : `Speaker ${speaker.speakerNumber}`, value: speaker.speakerNumber }));
}

const DELETE_KEY_CODE = 46;

export default class SubtitleForm extends React.Component {
    state = {
        text: '',
        speakerNumber: null,
        isDeleteModalVisible: false,
    }

    componentDidMount = () => {
        window.onkeyup = (e) => {
            if (!this.props.subtitle) return;
            const key = Object.keys(e).indexOf('which') !== -1 ? e.which : e.keyCode;
            if (key !== DELETE_KEY_CODE) return;
            this.onDeleteSubtitle()
        }

        if (this.props.subtitle) {
            const { text, speakerNumber } = this.props.subtitle;
            this.setState({ text, speakerNumber });
        }
        this.debouncedSave = debounce(() => {
            this.props.onSave({ text: this.state.text, speakerNumber: this.state.speakerNumber });
        }, 3000)
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.subtitle !== nextProps.subtitle) {
            const { text } = nextProps.subtitle;
            const { speakerNumber } = nextProps.subtitle.speakerProfile
            this.setState({ text, speakerNumber });
        }
    }

    componentWillUnmount = () => {
        window.onkeyup = null;
    }

    isSaveDisabled = () => {
        const { subtitle, speakers, loading } = this.props;
        if (!subtitle || !speakers) return true;
        if (subtitle.text === this.state.text && subtitle.speakerNumber === this.state.speakerNumber) return true;
        if (loading) return true;
        return false;
    }

    onSave = () => {
        console.log('on save')
        this.debouncedSave();
    }

    onDeleteSubtitle = () => {
        this.setState({ isDeleteModalVisible: true });
    }

    render() {
        const { speakers, subtitle } = this.props;
        return (
            <Grid>
                {subtitle && speakers ? (
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Dropdown
                                    item
                                    style={{ color: 'white' }}
                                    value={this.state.speakerNumber}
                                    options={mapSpeakersToDropdownOptions(speakers)}
                                    onChange={(e, { value }) => this.setState({ speakerNumber: value }, this.onSave)}
                                />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <textarea
                                    disabled={!this.props.showTextArea}
                                    style={{ width: '100%', height: '100px', padding: 10 }}
                                    value={this.state.text}
                                    onChange={(e) => this.setState({ text: e.target.value }, this.onSave)}
                                />
                                <Button
                                    className="pull-right"
                                    style={{ marginTop: 10 }}
                                    color="blue"
                                    onClick={this.onSave}
                                    loading={this.props.loading}
                                    disabled={this.isSaveDisabled()}
                                >
                                    Save
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center' }}>
                                <Button icon="trash" onClick={this.onDeleteSubtitle} color="red" />
                            </Grid.Column>
                        </Grid.Row>
                    </React.Fragment>
                ) : null}
                <Modal open={this.state.isDeleteModalVisible} size="tiny" onClose={() => this.setState({ isDeleteModalVisible: false })}>
                    <Modal.Header>Delete Subtitle</Modal.Header>
                    <Modal.Content>
                        Are you sure you want to delete this item?
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.setState({ isDeleteModalVisible: false })}>Cancel</Button>
                        <Button color="red" onClick={() => { this.setState({ isDeleteModalVisible: false }); this.props.onDelete() }}>Yes</Button>
                    </Modal.Actions>
                </Modal>
            </Grid>
        )
    }
}

SubtitleForm.propTypes = {
    subtitle: PropTypes.object.isRequired,
    speakers: PropTypes.array.isRequired,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,

}

SubtitleForm.defaultProps = {
    onSave: () => { },
    onDelete: () => { },
}