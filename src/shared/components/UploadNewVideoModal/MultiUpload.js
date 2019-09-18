import React from 'react';
import { Tab, Table, Checkbox, Dropdown, Button, TableHeader, Icon, Progress, Grid } from 'semantic-ui-react';
import './multiupload.scss';
import Dropzone from 'react-dropzone';
import { matchVideosWithSubtitels } from '../../utils/helpers';

const DEFAULT_LANG_CODE = 'en-US';

class MultipleUpload extends React.Component {
    state = {
        bulkEditing: false,
        bulkEditingNumberOfSpeakers: 1,
        bulkEditingLangCode: DEFAULT_LANG_CODE,
    }

    onSaveBulkEditing = () => {
        const { bulkEditingLangCode, bulkEditingNumberOfSpeakers } = this.state;
        const { videos } = this.props.value;
        videos.forEach((video) => {
            if (video.selected) {
                video.numberOfSpeakers = bulkEditingNumberOfSpeakers;
                video.langCode = bulkEditingLangCode;
            }
        })
        this.props.onChange({ videos });
        this.setState({ bulkEditing: false, bulkEditingNumberOfSpeakers: 1, bulkEditingLangCode: DEFAULT_LANG_CODE });
    }

    onMultiVideosDrop = (accpetedFiles) => {
        const newVideosNames = accpetedFiles.map((f) => f.name);
        const newAcceptedFiles = this.props.value.videos
            .filter((f) => newVideosNames.indexOf(f.content.name) === -1)
            .concat(accpetedFiles.map((f) => ({ content: f, selected: false, hasSubtitle: false, numberOfSpeakers: 1, langCode: DEFAULT_LANG_CODE })));
        this.props.onChange({ videos: newAcceptedFiles });
    }
    onMultiSubtitlesDrop = (accpetedFiles) => {

        const newSubtitlesNames = accpetedFiles.map((f) => f.name);
        const newAcceptedFiles = this.props.value.subtitles
            .filter((f) => newSubtitlesNames.indexOf(f.content.name) === -1)
            .concat(accpetedFiles.map((f) => ({ content: f, selected: false })));
        this.props.onChange({ subtitles: newAcceptedFiles });
    }

    onSelectAllVideosChange = (checked) => {
        const newvids = this.props.value.videos;
        newvids.forEach(video => {
            video.selected = checked;
        });
        this.props.onChange({ videos: newvids });
    }
    onSelectAllSubtitlesChange = (checked) => {
        const newSubtitles = this.props.value.subtitles;
        newSubtitles.forEach(video => {
            video.selected = checked;
        });
        this.props.onChange({ subtitles: newSubtitles });
    }

    onMultiVideoItemChange(index, field, value) {
        const { videos } = this.props.value;
        videos[index][field] = value;
        this.props.onChange({ videos });
    }

    onMultiSubtitleItemChange(index, field, value) {
        const { subtitles } = this.props.value;
        subtitles[index][field] = value;
        this.props.onChange({ subtitles });
    }

    onDeleteVideo = (index) => {
        const { videos } = this.props.value;
        videos.splice(index, 1);
        this.props.onChange({ videos });
    }

    onDeleteSelectedVideos = () => {
        const { videos } = this.props.value;
        this.props.onChange({ videos: videos.filter(v => !v.selected) });
    }

    onDeleteSelectedSubtitles = () => {
        const { subtitles } = this.props.value;
        this.props.onChange({ subtitles: subtitles.filter((s) => !s.selected) });
    }

    renderMultipleVidoesTable = () => {
        let { videos, subtitles } = this.props.value;
        const { speakersOptions, langsOptions } = this.props;
        videos = matchVideosWithSubtitels(videos, subtitles);
        const renderSubtitlesColumn = videos.some(v => v.hasSubtitle);

        return (
            <Table celled selectable onClick={(e) => e.stopPropagation()} style={{ maxHeight: 500, overflowY: 'scroll' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ display: 'flex', justifyContent: 'center' }}>
                            <Checkbox checked={videos.every((v) => v.selected)} onChange={(e, { checked }) => this.onSelectAllVideosChange(checked)} />
                        </Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Number of speakers</Table.HeaderCell>
                        <Table.HeaderCell>Language</Table.HeaderCell>
                        {renderSubtitlesColumn && (
                            <Table.HeaderCell>Subtitle</Table.HeaderCell>
                        )}
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {videos.map((video, index) => (
                        <Table.Row key={`multi-videos-table-${index}`} className="video-row">
                            <Table.Cell>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Checkbox checked={video.selected} onChange={(e, { checked }) => this.onMultiVideoItemChange(index, 'selected', checked)} />
                                </div>
                            </Table.Cell>
                            <Table.Cell width="6">
                                {video.content.name}
                                {video.progress && video.progress > 0 && (
                                    <Progress size="small" indicating percent={video.progress} style={{ margin: 0 }} />
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown
                                    scrolling
                                    value={video.numberOfSpeakers}
                                    onChange={(e, { value }) => this.onMultiVideoItemChange(index, 'numberOfSpeakers', value)}
                                    options={speakersOptions}
                                />
                            </Table.Cell>
                            <Table.Cell className="video-lang-cell">
                                {video.langCodeEditing ? (
                                    <React.Fragment>

                                        <Dropdown
                                            search
                                            selection
                                            value={video.langCode}
                                            onChange={(e, { value }) => { this.onMultiVideoItemChange(index, 'langCode', value); this.onMultiVideoItemChange(index, 'langCodeEditing', false) }}
                                            options={langsOptions}
                                        />
                                        <Button icon="close" size="tiny" basic onClick={() => this.onMultiVideoItemChange(index, 'langCodeEditing', false)} />
                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            {langsOptions.find((o) => o.value === video.langCode).text}
                                            <Button basic icon="edit" onClick={() => this.onMultiVideoItemChange(index, 'langCodeEditing', true)} className="video-lang-cell-edit" />
                                        </React.Fragment>
                                    )}
                            </Table.Cell>
                            {renderSubtitlesColumn && (
                                <Table.Cell>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {video.hasSubtitle ? <Icon name="check circle outline large" color="green" /> : <Icon name="times circle outline large" />}
                                    </div>
                                </Table.Cell>
                            )}
                            <Table.Cell>
                                <Button icon="trash" color="red" size="tiny" onClick={() => this.onDeleteVideo(index)} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

    renderMultipleUploadVideos = () => {
        const { videos } = this.props.value;
        const marginSpace = { marginRight: 20 };
        return (
            <div>
                <div style={{ margin: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {this.state.bulkEditing && (
                        <div style={{ ...marginSpace }}>
                            <span style={marginSpace}>Number of speakers: </span>
                            <Dropdown
                                style={marginSpace}
                                scrolling
                                value={this.state.bulkEditingNumberOfSpeakers}
                                onChange={(e, { value }) => this.setState({ bulkEditingNumberOfSpeakers: value })}
                                options={this.props.speakersOptions}
                            />
                            <span style={marginSpace}>Language: </span>
                            <Dropdown
                                search
                                selection
                                value={this.state.bulkEditingLangCode}
                                onChange={(e, { value }) => { this.setState({ bulkEditingLangCode: value }) }}
                                options={this.props.langsOptions}
                                style={{ ...marginSpace }}
                            />
                            <Button basic style={{ ...marginSpace }} onClick={() => this.setState({ bulkEditing: false })}>Cancel</Button>
                            <Button color="green" style={{ ...marginSpace }} onClick={this.onSaveBulkEditing} >
                                Save
                            </Button>
                        </div>
                    )}
                    <Dropdown text='Actions' disabled={!videos.some((v) => v.selected)} pointing>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.setState({ bulkEditing: true })}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={this.onDeleteSelectedVideos}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Dropzone
                    // disablePreview={true}
                    accept="video/*"
                    onDrop={this.onMultiVideosDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <section style={{ maxHeight: 500, overflowY: 'scroll' }}>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {this.props.value.videos && this.props.value.videos.length > 0 ? this.renderMultipleVidoesTable()
                                    : (
                                        <div className="dropbox">
                                            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
                                        </div>
                                    )}
                                <p style={{ textAlign: 'center' }}>Click to choose videos or drag them here.</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        )
    }

    onDeleteSubtitle = index => {
        const { subtitles } = this.props.value;
        subtitles.splice(index, 1);
        this.props.onChange({ subtitles });
    }

    renderMultipleSubtitlesTable = () => {
        const { subtitles } = this.props.value;
        return (
            <Table celled selectable onClick={(e) => e.stopPropagation()} style={{ maxHeight: 500, overflowY: 'scroll' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ display: 'flex', justifyContent: 'center' }}>
                            <Checkbox checked={subtitles.every((v) => v.selected)} onChange={(e, { checked }) => this.onSelectAllSubtitlesChange(checked)} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width="14">Name</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {subtitles.map((subtitle, index) => (
                        <Table.Row key={`multi-subtitles-table-${index}`} className="subtitle-row">
                            <Table.Cell style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox checked={subtitle.selected} onChange={(e, { checked }) => this.onMultiSubtitleItemChange(index, 'selected', checked)} />
                            </Table.Cell>
                            <Table.Cell width="12">
                                {subtitle.content.name}
                            </Table.Cell>
                            <Table.Cell style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button icon="trash" color="red" size="tiny" onClick={() => this.onDeleteSubtitle(index)} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

    renderMultipleUploadSubtitles = () => {
        const { subtitles } = this.props.value;
        return (
            <div>
                <div style={{ margin: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Dropdown text='Actions' disabled={!subtitles.some((s) => s.selected)} pointing>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.onDeleteSelectedSubtitles}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Dropzone
                    // disablePreview={true}
                    accept=".srt, .vtt"
                    onDrop={this.onMultiSubtitlesDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <section style={{ maxHeight: 500, overflowY: 'scroll' }}>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {subtitles && subtitles.length > 0 ? this.renderMultipleSubtitlesTable()
                                    : (
                                        <div className="dropbox">
                                            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
                                        </div>
                                    )}
                                <p style={{ textAlign: 'center' }}>Click to choose subtitles or drag them here.</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        )
    }

    isFormValid = () => {
        const { videos } = this.props.value;
        return videos.length > 0;
    }

    render() {
        const panes = [
            { menuItem: 'Videos *', render: () => <Tab.Pane>{this.renderMultipleUploadVideos()}</Tab.Pane> },
            { menuItem: 'Subtitles', render: () => <Tab.Pane>{this.renderMultipleUploadSubtitles()}</Tab.Pane> },
        ]

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Tab panes={panes} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default MultipleUpload;