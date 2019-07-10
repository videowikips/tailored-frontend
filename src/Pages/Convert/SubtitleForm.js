import React from 'react';
import PropTypes from 'prop-types';
import { TextArea, Button, Dropdown, Grid, Modal } from 'semantic-ui-react';

function mapSpeakersToDropdownOptions(speakers) {
    return speakers.map((speaker) => ({ text: `Speaker ${speaker.speakerNumber}`, value: speaker.speakerNumber }));
}

export default class SubtitleForm extends React.Component {
    state = {
        text: '',
        speakerNumber: null,
        isDeleteModalVisible: false,
    }

    componentDidMount = () => {
        if (this.props.subtitle) {
            const { text, speakerNumber } = this.props.subtitle;
            this.setState({ text, speakerNumber });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.subtitle !== nextProps.subtitle) {
            const { text, speakerNumber } = nextProps.subtitle;
            this.setState({ text, speakerNumber });
        }
    }

    isSaveDisabled = () => {
        const { subtitle, speakers, loading } = this.props;
        if (!subtitle || !speakers) return true;
        if (subtitle.text === this.state.text && subtitle.speakerNumber === this.state.speakerNumber) return true;
        if (loading) return true;
        return false;
    }

    onSave = () => {
        this.props.onSave({ text: this.state.text, speakerNumber: this.state.speakerNumber });
    }

    onDeleteSubtitle = () => {
        this.setState({ isDeleteModalVisible: true });
    }

    render() {
        const { speakers, subtitle, loading } = this.props;
        return (
            <Grid>
                {subtitle && speakers ? (
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Dropdown
                                    item
                                    value={this.state.speakerNumber}
                                    options={mapSpeakersToDropdownOptions(speakers)}
                                    onChange={(e, { value }) => this.setState({ speakerNumber: value })}
                                />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <TextArea
                                    style={{ width: '100%', height: '200px', padding: 10 }}
                                    value={this.state.text}
                                    onChange={(e, { value }) => this.setState({ text: value })}
                                />
                            </Grid.Column>
                            <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center' }}>
                                <Button icon="trash" onClick={this.onDeleteSubtitle} color="red" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={4}>
                            </Grid.Column>
                            <Grid.Column width={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    color="blue"
                                    onClick={this.onSave}
                                    loading={loading}
                                    disabled={this.isSaveDisabled()}
                                >
                                    Save
                                </Button>
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