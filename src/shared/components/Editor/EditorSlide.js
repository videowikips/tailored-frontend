import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone'
import { Message, Progress, } from 'semantic-ui-react'
import classnames from 'classnames'
import AudioPlayer from './AudioPlayer'
import { NotificationManager } from 'react-notifications'
import request from '../../utils/requestAgent';

// import UploadFileInfoModal from '../common/UploadFileInfoModal'
// import AuthModal from '../common/AuthModal';
// import uiActions from '../../actions/UIActionCreators';
import { getWikiFileExtension } from '../../utils/wikiUtils';

const ALLOWED_VIDEO_FORMATS = ['webm', 'ogv']

class EditorSlide extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fileUploadError: false,
      errorMessage: '',
      file: null,
      onDragOver: false,
      isFileUploadModalVisible: false,
      isUploadResume: false,
      isLoginModalVisible: false,
    }
  }

  _onDragLeave() {
    this.setState({
      onDragOver: false,
    })
  }

  _onDragOver() {
    this.setState({
      onDragOver: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isPlaying !== nextProps.isPlaying) {
      if (nextProps.isPlaying) {
        if (this.videoPlayer) {
          this.videoPlayer.play()
        }
      } else {
        if (this.videoPlayer) {
          this.videoPlayer.pause()
        }
      }
    }

    if (this.props !== nextProps) {
      this.setState({
        fileUploadError: false,
        errorMessage: '',
        file: this.state.file,
      })
    }

    if (this.props.uploadState === 'failed' &&
      this.props.description !== nextProps.description) {
      this.props.resetUploadState()
    }

    if (this.props.uploadState === 'loading' &&
      this.props.description !== nextProps.description) {
      this.props.resetUploadState()
    }
  }

  // hasForm() {
  //   const { uploadToCommonsForms, currentSlideIndex, articleId } = this.props;

  //   return uploadToCommonsForms[articleId] && uploadToCommonsForms[articleId][currentSlideIndex];
  // }

  _handleCommonsVideoDrop(fileUrl, mimetype) {
    request
    .post('/api/wiki/commons/video_by_name')
    .field('url', fileUrl)
    .then(response => {
      this._handleImageUrlDrop(response.body.url, mimetype)
    })
    .catch((err) => {
      NotificationManager.error('Oops, could fetch the video file, please try again');
    })
  }

  _handleImageUrlDrop(imageUrlToUpload, imageUrlMimetype) {
    this.setState({
      fileUploadError: false,
      errorMessage: '',
      file: null,
    })

    this.props.uploadContent(null, imageUrlToUpload, imageUrlMimetype)
  }

  _handleFileUpload(acceptedFiles, rejectedFiles, evt) {
    const { uploadState } = this.props;
    if (rejectedFiles.length > 0) {
      const file = rejectedFiles[0]
      let errorMessage = ''

      if (file.size > (10 * 1024 * 1024)) {
        errorMessage = 'Max file size limit is 10MB!'
      } else if (file.type.indexOf('video') === -1 && file.type.indexOf('image') === -1 && file.type.indexOf('gif') === -1) {
        // check if image dropped from container
        if (evt && evt.dataTransfer && evt.dataTransfer.getData('text/html')) {
          const imageElement = evt.dataTransfer.getData('text/html')

          const urlRex = /data-orig="?([^"\s]+)"?\s*/
          // const descriptionUrlRex = /data-orig-desc="?([^"\s]+)"?\s*/
          const mimetypeRex = /data-orig-mimetype="?([^"\s]+)"?\s*/

          const url = urlRex.exec(imageElement)
          // const descriptionUrl = descriptionUrlRex.exec(imageElement)
          const mimetype = mimetypeRex.exec(imageElement)

          if (url && url[1] && mimetype && mimetype[1]) {
            return this._handleImageUrlDrop(url[1], mimetype[1])
          }

          const commonsReg = /src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([^"\s]+)"?\s*/
          // If no match on data-orig, check if it's a commons url
          if (imageElement.match(commonsReg).length === 2) {
            let commonsUrl = '';
            let commonsMimetype = '';
            const commonsMatch = imageElement.match(commonsReg);
            // Remove trailing backslash /
            if (commonsMatch[1].trim().lastIndexOf('/') === commonsMatch[1].length) {
              commonsMatch[1] = commonsMatch[1].trim().substr(0, commonsMatch[1].trim().lastIndexOf('/'));
            }
            let urlParts = commonsMatch[1].split('/');
            const extension = getWikiFileExtension(urlParts.join('/'))
            if (extension === 'gif') {
              // it's a gif
              commonsMimetype = 'image/gif';
              // urlParts.unshift('thumb');
            } else if (ALLOWED_VIDEO_FORMATS.indexOf(extension) !== -1) {
              // It's a video
              urlParts = urlParts.filter((part) => part !== 'thumb');
              // Keep only the first 3 parts of the url
              // 2 parts for the directory, last part for the file name
              while (urlParts.length > 3) {
                urlParts.pop();
              }
              commonsMimetype = `video/${extension}`;
              urlParts.unshift('https://upload.wikimedia.org/wikipedia/commons')
              this._handleImageUrlDrop(urlParts.join('/'), commonsMimetype);
              return;
            } else {
              // It's an image
              if (urlParts[0] !== 'thumb') {
                urlParts.unshift('thumb');
              }
              // Check if it's already a thumbnail of the image
              if (urlParts[urlParts.length - 1].match(/^[0-9]+px-/).length === 0) {
                urlParts.push(`400px-${urlParts[urlParts.length - 1]}`);
              } else {
                const oldFileName = urlParts.pop();
                urlParts.push(oldFileName.replace(/^[0-9]+px-/, '400px-'));
              }
              commonsMimetype = `image/${extension}`;
            }
            urlParts.unshift('https://upload.wikimedia.org/wikipedia/commons');
            commonsUrl = urlParts.join('/');
            this._handleImageUrlDrop(commonsUrl, commonsMimetype);
          }
        } else {
          errorMessage = 'Only images and videos can be uploaded!'
        }
      }

      this.setState({
        fileUploadError: true,
        errorMessage,
        file: null,
      })
    } else {
      if (!this.props.isLoggedIn) {
        this.setState({ isLoginModalVisible: true })
        // NotificationManager.info('Only logged in users can upload files directly. A good chance to sign up! ')
        return
      }

      if (acceptedFiles[0] && acceptedFiles[0].type.indexOf('video') > -1) {
        const videoFormat = acceptedFiles[0].type.split('/')[1]

        if (ALLOWED_VIDEO_FORMATS.indexOf(videoFormat) === -1) {
          NotificationManager.error('Please upload videos with WebM or Ogv file format only')
          return
        }
      }

      if (acceptedFiles.length > 0 && uploadState === 'loading') {
        NotificationManager.info('An upload is already in progress, please hold');
        return;
      }

      this.setState({
        fileUploadError: false,
        errorMessage: '',
        file: acceptedFiles[0],
      })

      // TODO: upload to server
      if (acceptedFiles.length > 0) {
        this.setState({ isFileUploadModalVisible: true })
      }
    }
  }

  _handleDismiss() {
    this.setState({
      fileUploadError: false,
    })
  }

  _handleFileUploadModalClose() {
    if (this.props.showReopenFormNotification) {
      NotificationManager.info('you can re-open the form by clicking on the icon on the top right of the slide');
      // this.props.dispatch(uiActions.showReopenFormNotification({ show: false }));
    }
    this.setState({ isFileUploadModalVisible: false, isUploadResume: false })
  }

  // _renderFileUploadModal() {
  //   if (!this.state.isFileUploadModalVisible) return
  //   return (
  //     <UploadFileInfoModal
  //       articleId={this.props.articleId}
  //       currentSlideIndex={this.props.currentSlideIndex}
  //       title={this.props.title}
  //       wikiSource={this.props.wikiSource}
  //       visible={this.state.isFileUploadModalVisible}
  //       isUploadResume={this.state.isUploadResume}
  //       file={this.state.file}
  //       onClose={() => this._handleFileUploadModalClose()}
  //     />
  //   )
  // }

  // _renderLoginModal() {
  //   return (
  //     <AuthModal open={this.state.isLoginModalVisible} onClose={() => this.setState({ isLoginModalVisible: false })} />
  //   )
  // }

  _renderFileUploadErrorMessage() {
    const { errorMessage } = this.state

    return this.state.fileUploadError ? (
      <Message
        negative
        className="c-editor-message"
        onDismiss={() => this._handleDismiss()}
        content={errorMessage}
      />
    ) : null
  }

  _renderLoading(boxClassnames) {
    if (this.props.uploadProgress === 100) {
      return (
        <div className={boxClassnames}>
          <div className="box__input">
            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
            <label>Saving file...</label>
          </div>
        </div>
      )
    } else {
      const progress = Math.floor(this.props.uploadProgress)
      return (
        <div className={boxClassnames}>
          <div className="box__input">
            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
            <Progress className="c-upload-progress" percent={progress} progress indicating />
            <label>Uploading...</label>
          </div>
        </div>
      )
    }
  }

  _renderDefaultContent() {
    const { isPlaying, media, mediaType, uploadState } = this.props

    const boxClassnames = classnames('c-editor__content-default', {
      box__hover: this.state.onDragOver,
    })

    if (uploadState === 'loading') {
      return this._renderLoading(boxClassnames)
    }

    if (uploadState === 'failed') {
      return (
        <div className={boxClassnames}>
          <div className="box__input">
            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
            <label>Error while uploading! Please try again!</label>
          </div>
        </div>
      )
    }

    return mediaType === 'video' ? (
      <video
        autoPlay={isPlaying}
        ref={(videoPlayer) => { this.videoPlayer = videoPlayer }}
        muted={true}
        className="c-editor__content-video"
        src={media}
      />
    ) : mediaType === 'image' || mediaType === 'gif' ? (
      <img className="c-editor__content-image" src={media} alt="content" />
    ) : (
      <div className={boxClassnames}>
        <div className="box__input">
          <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
          <label>Choose a file or drag it here.</label>
        </div>
      </div>
      )
  }

  _renderDropzone() {
    return this.props.mode === 'editor' && this.props.editable ? (
      <Dropzone
          disablePreview={true}
          accept="image/*, video/*, gif/*"
          onDrop={this._handleFileUpload.bind(this)}
          className="c-editor__content--dropzone"
          maxSize={10 * 1024 * 1024}
          multiple={false}
          onDragOver={this._onDragOver.bind(this)}
          onDragLeave={this._onDragLeave.bind(this)}
      >
        {this._renderDefaultContent()}
      </Dropzone>
    ) : (
      <div className="c-editor__content--dropzone">
        {this._renderDefaultContent()}
      </div>
      )
  }

  render() {
    const { description, audio, onSlidePlayComplete, isPlaying, playbackSpeed, muted } = this.props

    return (
      <div className="c-editor__content-area">
        {/* {this.hasForm() && (
          <Popup
            position="bottom right"
            trigger={
              <Button
                icon
                className="c-editor__resume-edit-btn"
                onClick={() => this.setState({ isFileUploadModalVisible: true, isUploadResume: true })}
              >
                <Icon name="newspaper" />
              </Button>
            }
            content="Show form"
          />
        )} */}
        {this._renderFileUploadErrorMessage()}
        <div className="c-editor__content--media">
          {this._renderDropzone()}
        </div>
        <AudioPlayer
          description={description}
          audio={audio}
          muted={muted}
          showTextTransition={this.props.showTextTransition}
          onSlidePlayComplete={onSlidePlayComplete}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
        />
        {/* {this._renderFileUploadModal()} */}
        {/* {this._renderLoginModal()} */}
      </div>
    )
  }
}

EditorSlide.propTypes = {
  dispatch: PropTypes.func.isRequired,
  articleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  wikiSource: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  audio: PropTypes.string.isRequired,
  media: PropTypes.string,
  mediaType: PropTypes.string,
  currentSlideIndex: PropTypes.number.isRequired,
  onSlidePlayComplete: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  uploadContent: PropTypes.func.isRequired,
  mode: PropTypes.string,
  uploadState: PropTypes.string,
  uploadStatus: PropTypes.object,
  uploadProgress: PropTypes.number,
  resetUploadState: PropTypes.func.isRequired,
  playbackSpeed: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  uploadToCommonsForms: PropTypes.object,
  showReopenFormNotification: PropTypes.bool.isRequired,
  editable: PropTypes.bool,
  showTextTransition: PropTypes.bool,
  muted: PropTypes.bool,
}

EditorSlide.defaultProps = {
  uploadToCommonsForms: {},
  editable: false,
  showTextTransition: true,
  muted: false,
}

// const mapStateToProps = (state) => ({
//   uploadToCommonsForms: state.wiki.uploadToCommonsForms,
//   showReopenFormNotification: state.ui.showReopenFormNotification,
// })

export default EditorSlide;
