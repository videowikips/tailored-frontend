import _ from 'lodash'
import request from '../../utils/requestAgent';
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { Sidebar, Segment, Progress, Modal, Button, Icon } from 'semantic-ui-react'
import classnames from 'classnames'
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications';

import EditorSidebar from './EditorSidebar'
import EditorFooter from './EditorFooter'
import EditorSlide from './EditorSlide'
import EditorHeader from './EditorHeader'

import LoaderOverlay from '../../components/LoaderOverlay'

import Viewer from './Viewer'
import EditorTimeline from './EditorTimeline';

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSlideIndex: 0,
      currentSubslideIndex: 0,
      currentSubmediaIndex: 0,
      defaultSlideStartTime: 0,
      playbackSpeed: 1,
      isPlaying: props.autoPlay,
      showTextTransition: true,
      sidebarVisible: props.mode === 'editor' || (props.mode === 'viewer' && props.viewerMode === 'editor') || props.showSidebar,
      showDescription: props.mode === 'editor' || (props.mode === 'viewer' && props.viewerMode === 'editor') || props.showDescription,
      audioLoaded: false,
      modalOpen: false,
    }

    this.handleClose = this.handleClose.bind(this)
    this.resetUploadState = this.resetUploadState.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uploadState === 'loading' && nextProps.uploadState === 'done') {
      const { article, uploadStatus } = nextProps
      const { slideNumber, mimetype, filepath } = uploadStatus

      const updatedArticle = Object.assign({}, article)
      updatedArticle['slides'][slideNumber]['mediaType'] = mimetype
      updatedArticle['slides'][slideNumber]['media'] = filepath

      // this.props.dispatch(articleActions.updateArticle({ article }))
    }
    if (this.props.viewerMode !== nextProps.viewerMode) {
      this.setState({ defaultSlideStartTime: 10, isPlaying: false }, () => {
        this.setState({ defaultSlideStartTime: 0, currentSlideIndex: 0, currentSubmediaIndex: 0, isPlaying: false });
      });
    }
    // If the isPlaying changes from the props, change in the state too
    if (this.props.isPlaying !== nextProps.isPlaying) {
      if (nextProps.isPlaying) {
        const oldSlideIndex = this.state.currentSlideIndex;
        const oldSubslideIndex = this.state.currentSubslideIndex;
        let tmpSlideIndex;
        const tmpSubslideIndex = 0 ;
        if (oldSlideIndex === 0) {
          if (nextProps.article.slides.length === 1) {
            tmpSlideIndex = 0;
          } else {
            tmpSlideIndex = 1;
          }
        } else {
          tmpSlideIndex = 0;
          // if (nextProps.article.slides.length === 1) {
          // } else {
          //   tmpSlideIndex = oldSlideIndex - 1;
          // }
        }
        this.setState({
          isPlaying: false,
          currentSlideIndex: tmpSlideIndex,
          currentSubslideIndex: tmpSubslideIndex,
          showTextTransition: false,
        }, () => {
          setTimeout(() => {
            this.setState({
                isPlaying: true,
                currentSlideIndex: oldSlideIndex,
                currentSubslideIndex: oldSubslideIndex,
                showTextTransition: true,
              });
          }, 50);
        })
      } else {
        this.setState({ isPlaying: nextProps.isPlaying });
      }
    }
    if (this.props.controlled && (nextProps.currentSlideIndex !== this.state.currentSlideIndex || nextProps.currentSubslideIndex !== this.state.currentSubslideIndex)) {
      this._handleNavigateToSlide(nextProps.currentSlideIndex, nextProps.currentSubslideIndex);
    }
    // check for viewerMode update
    if (this.props.viewerMode !== nextProps.viewerMode) {
      if (nextProps.viewerMode === 'editor') {
        this.setState({ showDescription: true, sidebarVisible: true });
      } else {
        this.setState({ showDescription: false, sidebarVisible: false });
      }
    }
  }

  _getTableOfContents() {
    const { article: { slides } } = this.props

    return slides.map((section) =>
      _.pick(section, ['title', 'index']),
    )
  }

  resetUploadState() {
    // this.props.dispatch(articleActions.resetUploadState())
  }

  onSpeedChange(playbackSpeed) {
    this.setState({ playbackSpeed });
  }

  _handleTogglePlay() {
    this.setState({
      isPlaying: !this.state.isPlaying,
    }, () => {
      if (this.state.isPlaying) {
        this.props.onPlay();
      } else {
        this.props.onPause();
      }
    })
  }

  _handleNavigateToSlide(slideIndex, subslideIndex = 0) {
    const { article } = this.props
    const { slides } = article

    const index = slideIndex < 0 ? 0
      : slideIndex >= slides.length ? (slides.length - 1)
        : slideIndex

    this.setState({
      currentSlideIndex: index,
      audioLoaded: false,
      defaultSlideStartTime: 0,
      currentSubmediaIndex: 0,
      currentSubslideIndex: subslideIndex,
    }, () => {
      this.props.onSlideChange(index, subslideIndex);
    })
  }

  _handleSlideBack() {
    const { currentSlideIndex, currentSubslideIndex } = this.state

    const update = {
      currentSubslideIndex: 0,
      currentSubmediaIndex: 0,
      defaultSlideStartTime: 0,
      audioLoaded: false,
    }
    if (currentSubslideIndex === 0 && currentSlideIndex > 0) {
      this.setState({
        currentSlideIndex: currentSlideIndex - 1,
        ...update,
      }, () => {
        this.props.onSlideChange(this.state.currentSlideIndex, this.state.currentSubslideIndex);
      });
    } else if (currentSubslideIndex > 0) {
      this.setState({
        ...update,
        currentSubslideIndex: currentSubslideIndex - 1,
      }, () => {
        this.props.onSlideChange(this.state.currentSlideIndex, this.state.currentSubslideIndex);
      })
    }
  }

  _handleSlideForward() {
    const { currentSlideIndex, currentSubslideIndex } = this.state

    const { article } = this.props
    const { slides } = article
    const currentSlide = slides[currentSlideIndex];
    const update = {
      currentSubmediaIndex: 0,
      defaultSlideStartTime: 0,
      audioLoaded: false,      
    }
    if ((currentSubslideIndex + 1) <= (currentSlide.content.length - 1)) {
      update.currentSubslideIndex  = currentSubslideIndex + 1;
      this.setState(update, () => {
        this.props.onSlideChange(this.state.currentSlideIndex, this.state.currentSubslideIndex);
      });
    } else if (currentSlideIndex < slides.length - 1) {
      update.currentSlideIndex = currentSlideIndex  + 1;
      update.currentSubslideIndex = 0;
      this.setState(update, () => {
        this.props.onSlideChange(this.state.currentSlideIndex, this.state.currentSubslideIndex);
      })
    } else {
      update.isPlaying = false;
      this.setState(update, () => {
        this.props.onPlayComplete();
      })
    }
  }

  _toggleSidebar() {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
    })
  }

  _uploadContent(data, url, mimetype) {
    const { currentSlideIndex } = this.state
    const {  match } = this.props
    const { wikiSource } = queryString.parse(window.location.search)
    if (data) {
      // dispatch(articleActions.uploadContent({
      //   title: match.params.title,
      //   slideNumber: currentSlideIndex,
      //   file,
      // }))
      // dispatch(articleActions.uploadContentRequest())

      const uploadRequest = request
        .post('/api/wiki/article/upload')
        .field('title', match.params.title)
        .field('wikiSource', wikiSource)
        .field('slideNumber', currentSlideIndex)

      // attach given fields in the request
      Object.keys(data).forEach((key) => {
        uploadRequest.field(key, data[key])
      })

      // finally attach the file to the form
      uploadRequest
        .attach('file', data.file)
        .on('progress', (event) => {
          // dispatch(articleActions.updateProgress({ progress: event.percent }))
        })
        .end((err, { body }) => {
          if (err) {
            // dispatch(articleActions.uploadContentFailed())
          } else {
            NotificationManager.success("Success! Don't forget to click on the publish icon to save your changes", '', 3000);
          }
          // dispatch(articleActions.uploadContentReceive({ uploadStatus: body }))
        })
    } else {
      // dispatch(articleActions.uploadImageUrl({
      //   title: match.params.title,
      //   wikiSource,
      //   slideNumber: currentSlideIndex,
      //   url,
      //   mimetype,
      // }))
      NotificationManager.success("Success! Don't forget to click on the publish icon to save your changes", '', 3000)
    }
  }

  _publishArticle() {
    if (this.props.customPublish && this.props.onPublish) {
      return this.props.onPublish();
    }

    // const { dispatch, match } = this.props
    // const { wikiSource } = queryString.parse(window.location.search);
    // const title = match.params.title

    // dispatch(articleActions.publishArticle({ title, wikiSource }))
  }

  _renderLoading() {
    return this.props.publishArticleState === 'loading' ? (
      <LoaderOverlay loaderImage="/img/publish-loader.gif">
        Updating your contribution to the sum of all human knowledge
      </LoaderOverlay>
    ) : null
  }

  _handleMessageDismiss() {
    // this.props.dispatch(articleActions.resetPublishError())
  }

  onDurationsChange(slide, durations) {
    // const { title, wikiSource } = this.props.article;
    if (slide.media && slide.media.length > 1) {
      // this.props.dispatch(articleActions.updateSlideMediaDurations({ title, wikiSource, slideNumber: slide.position, durations }))
    }
  }

  handleClose() {
    const { history, match } = this.props
    const { wikiSource } = queryString.parse(window.location.search);
    const title = match.params.title
    // dispatch(articleActions.resetPublishError())

    return history.push(`/videowiki/${title}?wikiSource=${wikiSource}`)
  }

  _handleTimelineSeekEnd(defaultSlideStartTime) {
    this.setState({ defaultSlideStartTime: defaultSlideStartTime * 1000, isPlaying: false });
  }

  _renderError() {
    const { publishArticleError } = this.props
    return publishArticleError && publishArticleError.response ? (
      <Modal
        open={true}
        onClose={this.handleClose}
        basic
        size="small"
      >
        <Modal.Content>
          <h3 className="c-editor-error-modal">{publishArticleError.response.text}</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={this.handleClose} inverted>
            <Icon name="checkmark" /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
    ) : null
  }

  _renderPublished() {
    const { publishArticleState, mode } = this.props

    if (mode !== 'viewer' &&
      publishArticleState) {
      switch (publishArticleState) {
        case 'done':
          return this._render()
        case 'loading':
          return this._renderLoading()
        case 'failed':
          return this._renderError()
        default:
          return this._render()
      }
    } else {
      return this._render()
    }
  }

  _renderEditorSlide() {
    const { article, mode, uploadState, uploadStatus, uploadProgress, muted } = this.props
    const { wikiSource } = queryString.parse(window.location.search)
    const { slides } = article

    const { currentSlideIndex, isPlaying } = this.state

    const currentSlide = slides[currentSlideIndex]

    const { text, audio, media } = currentSlide
    let mediaUrl, mediaType;
    if (media && media.length > 0) {
      mediaUrl = media[0].url;
      mediaType = media[0].type;
    }

    return (
      <EditorSlide
        articleId={article._id}
        title={article.title}
        wikiSource={wikiSource}
        currentSlideIndex={currentSlideIndex}
        editable={this.props.editable}
        showTextTransition={this.state.showTextTransition}
        showDescription={this.state.showDescription}
        description={text}
        audio={audio}
        muted={muted}
        media={mediaUrl}
        mediaType={mediaType}
        onSlidePlayComplete={() => this._handleSlideForward()}
        isPlaying={isPlaying}
        uploadContent={(data, url, mimetype) => this._uploadContent(data, url, mimetype)}
        mode={mode}
        uploadState={uploadState}
        uploadStatus={uploadStatus}
        uploadProgress={uploadProgress}
        resetUploadState={this.resetUploadState}
        playbackSpeed={this.state.playbackSpeed}
        isLoggedIn={true}
      />
    )
  }

  _renderViewer() {
    const { article, layout } = this.props
    const { slidesHtml, slides } = article
    const { currentSlideIndex, isPlaying } = this.state

    let renderedSlides = slides;
    // check if slidesHtml is available
    if (slidesHtml && slidesHtml.length > 0 && slidesHtml.length === slides.length) {
      renderedSlides = slidesHtml
    }
    return (
      <Viewer
        slides={renderedSlides}
        muted={this.props.muted}
        currentSubslideIndex={this.state.currentSubslideIndex}
        showDescription={this.state.showDescription}
        currentSlideIndex={currentSlideIndex}
        isPlaying={isPlaying && this.state.audioLoaded}
        layout={layout}
        currentSubmediaIndex={this.state.currentSubmediaIndex}
        defaultSlideStartTime={this.state.defaultSlideStartTime}
        onSlidePlayComplete={() => this._handleSlideForward()}
        onAudioLoad={() => this.setState({ audioLoaded: true })}
        playbackSpeed={this.state.playbackSpeed}
        onSubMediaSlideChange={(currentSubmediaIndex) => this.setState({ currentSubmediaIndex })}
      />
    )
  }

  _renderSlide() {
    return this.props.mode === 'viewer' ? this._renderViewer()
      : this._renderEditorSlide()
  }

  _render() {
    const { article, match, mode, uploadState } = this.props
    const title = match.params.title

    if (!article) {
      return (
        <div>Loading...</div>
      )
    }

    const { slides } = article
    const updatedAt = article.updated_at

    const { currentSlideIndex, currentSubslideIndex, sidebarVisible } = this.state
    const currentSlide = slides[currentSlideIndex] || {};

    const mainContentClasses = classnames('c-main-content', {
      'c-main-content__sidebar-visible': sidebarVisible,
      'c-main-content__sidebar-visible--viewer': sidebarVisible && mode === 'viewer',
    })

    const editorClasses = classnames('c-editor', {
      'c-editor__editor': mode !== 'viewer',
      'c-editor__viewer': mode === 'viewer',
    })

    const hideSidebarToggle = mode !== 'viewer'

    return (
      <div className='editor-container'>
        <div className={editorClasses}>
          {/* Header */}
          <EditorHeader
            article={article}
            // showViewerModeDropdown={this.props.showViewerModeDropdown}
            authenticated={true}
            currentSlide={currentSlide || {}}
            mode={mode}
            options={this.props.headerOptions || {}}
            isExportable={article.ns !== 0 || article.slides.length < 50}
            showPublish={this.props.showPublish}
            articleVideo={this.props.articleVideo}
            onPublishArticle={() => this._publishArticle()}
            onPausePlay={() => this.setState({ isPlaying: false })}
            viewerMode={this.props.viewerMode}
            onViewerModeChange={(e, { value }) => this.props.onViewerModeChange(value)}
            onAddHumanVoice={this.props.onAddHumanVoice}
          // onBack={() => this.props.history.push(`/${this.props.language}/videowiki/${this.props.article.title}?wikiSource=${this.props.article.wikiSource}`)}
          />

          {/* Main */}
          <div className="c-editor__content">
            <Sidebar.Pushable as={Segment} className="c-editor__content--all">
              <EditorSidebar
                toc={this._getTableOfContents()}
                visible={sidebarVisible}
                currentSlideIndex={currentSlideIndex}
                currentSubslideIndex={currentSubslideIndex}
                currentNumberOfSlides={currentSlide.content.length}
                navigateToSlide={(slideStartPosition) => this._handleNavigateToSlide(slideStartPosition)}
              />
              <Sidebar.Pusher className={mainContentClasses}>
                {this._renderSlide()}
              </Sidebar.Pusher>
            </Sidebar.Pushable>
            <Progress color="blue" value={currentSlideIndex + 1} total={slides.length} attached="bottom" style={{ zIndex: 2 }} />
          </div>

          {/* Footer */}
          <EditorFooter
            currentSlideIndex={currentSlideIndex}
            totalSlideCount={slides.length}
            uploadState={uploadState}
            onSlideBack={() => this._handleSlideBack()}
            togglePlay={() => this._handleTogglePlay()}
            onCCToggle={() => this.setState({ showDescription: !this.state.showDescription })}
            onSlideForward={() => this._handleSlideForward()}
            isPlaying={this.state.isPlaying}
            toggleSidebar={() => this._toggleSidebar()}
            title={title}
            hideSidebarToggle={hideSidebarToggle}
            onSpeedChange={(value) => this.onSpeedChange(value)}
            updatedAt={updatedAt}
            options={this.props.footerOptions}
          />
        </div>
        {this.props.viewerMode === 'editor' && currentSlide && currentSlide.media && currentSlide.media.length > 0 && (
          <EditorTimeline
            onDurationsChange={this.onDurationsChange.bind(this)}
            currentSlide={currentSlide}
            currentSlideIndex={currentSlideIndex}
            isPlaying={this.state.isPlaying}
            onAudioLoad={() => this.setState({ audioLoaded: true })}
            onPlayComplete={() => this._handleSlideForward()}
            onSeekEnd={this._handleTimelineSeekEnd.bind(this)}
          />
        )}
        {/* {this.props.showReferences && (
            <EditorReferences
              mode={mode}
              defaultVisible={mode === 'editor'}
              article={article}
              currentSlideIndex={currentSlideIndex}
              currentSlide={currentSlide}
              currentSubmediaIndex={this.state.currentSubmediaIndex}
            />
          )} */}
      </div>
    )
  }

  _renderEditor() {
    return this.props.mode === 'viewer' ? this._render()
      : this._renderPublished()
  }

  render() {
    return this._renderEditor();
  }
}


export default withRouter(Editor);

Editor.defaultProps = {
  isLoggedIn: false,
  autoPlay: false,
  showReferences: false,
  editable: false,
  isPlaying: false,
  articleVideo: {
    video: {},
    exported: 'false',
  },
  articleLastVideo: {},
  onSlideChange: () => { },
  onPublish: () => { },
  onPlayComplete: () => { },
  onPlay: () => { },
  onPause: () => {},
  onAddHumanVoice: () => {},
  onViewerModeChange: () => { },
  showPublish: false,
  customPublish: false,
  muted: false,
  currentSlideIndex: 0,
  controlled: false,
  mode: 'viewer',
  viewerMode: 'player',
  layout: 'random',
  headerOptions: {},
  footerOptions: {},
}

Editor.propTypes = {
  match: PropTypes.object.isRequired,
  article: PropTypes.object,
  mode: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  publishArticleState: PropTypes.string,
  publishArticleStatus: PropTypes.object,
  publishArticleError: PropTypes.object,
  uploadState: PropTypes.string,
  uploadStatus: PropTypes.object,
  uploadProgress: PropTypes.number,
  auth: PropTypes.any,
  autoPlay: PropTypes.bool,
  showReferences: PropTypes.bool,
  editable: PropTypes.bool,
  isPlaying: PropTypes.bool,
  fetchArticleVideoState: PropTypes.string,
  articleVideo: PropTypes.object,
  articleLastVideo: PropTypes.object,
  onSlideChange: PropTypes.func,
  customPublish: PropTypes.bool,
  onPublish: PropTypes.func,
  showPublish: PropTypes.bool,
  muted: PropTypes.bool,
  currentSlideIndex: PropTypes.number,
  onPlayComplete: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  controlled: PropTypes.bool,
  onViewerModeChange: PropTypes.func,
  viewerMode: PropTypes.string,
  layout: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerOptions: PropTypes.object,
  footerOptions: PropTypes.object,
}
