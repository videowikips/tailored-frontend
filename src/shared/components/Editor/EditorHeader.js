import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { Button, Icon, Popup, Dropdown } from 'semantic-ui-react'
import copy from 'clipboard-copy';
import {
  FacebookShareButton,
  // GooglePlusShareButton,
  TwitterShareButton,
  VKShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  VKIcon,
  RedditIcon,
} from 'react-share'
import { NotificationManager } from 'react-notifications';
import Blinker from '../../components/Blinker';
import UpdateArticleModal from './modals/UpdateArticleModal';
import ExportArticleVideo from './ExportArticleVideo';
import AddHumanVoiceModal from './modals/AddHumanVoiceModal';
// import AuthModal from '../common/AuthModal';

class EditorHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blink: false,
      addHumanVoiceModalVisible: false,
      isLoginModalVisible: false,
    }
  }

  componentDidMount() {
    this.setState({ blink: true })
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentSlide && nextProps.currentSlide.position > -1 &&
      this.props.currentSlide && this.props.currentSlide.position > -1 &&
      this.props.currentSlide.position !== nextProps.currentSlide.position &&
      (!nextProps.currentSlide.media)
    ) {
      this.setState({ blink: true })
    }
  }

  onCopy() {
    copy(window.location.href);
    NotificationManager.success('Link copied to clipboard');
  }

  onAddHumanVoice(lang) {
    this.props.onAddHumanVoice(lang)
    return this.setState({ addHumanVoiceModalVisible: false });
  }

  onTranslateButtonClick() {
    return this.setState({ addHumanVoiceModalVisible: true });
  }

  _renderUpdateButton() {
    if (!this.props.options.showUpdateArticle) return;
    return (
      <UpdateArticleModal title={this.props.article.title} wikiSource={this.props.article.wikiSource} />
    )
  }

  _renderExportArticle() {
    if (!this.props.options.showExportArticle || !this.props.article) return;
    const { article, fetchArticleVideoState, articleVideo, articleLastVideo } = this.props;

    return (
      (
        <ExportArticleVideo
          fetchArticleVideoState={fetchArticleVideoState}
          articleVideo={articleVideo}
          articleLastVideo={articleLastVideo}
          isExportable={this.props.isExportable}
          articleId={article._id}
          title={article.title}
          wikiSource={article.wikiSource}
          authenticated={this.props.authenticated}
          onOpen={this.props.onPausePlay}
        />
      )
    )
  }

  _renderShareButton() {
    return (
      <Button
        basic
        icon
        className="c-editor__toolbar-publish"
        title="Share"
      >
        <Icon name="share alternate" inverted color="grey" />
      </Button>
    )
  }

  _renderShareButtons() {
    if (!this.props.options.showShareButtons) return;
    const { article } = this.props
    const title = article.title.split('_').join(' ')
    const url = window.location.href;
    const description = `Checkout the new VideoWiki article at ${window.location.href}`

    return (
      <span>
        <Popup
          trigger={(
            <span style={{ display: 'inline-block' }}>
              <FacebookShareButton
                url={url}
                title={title}
                picture={article.image}
                description={description}
                className="c-editor__share-icon"
              >
                <FacebookIcon
                  size={32}
                  round
                />
              </FacebookShareButton>
            </span>
            )}
        >
          Facebook
        </Popup>

        <Popup
          trigger={(
            <span style={{ display: 'inline-block' }}>
              <TwitterShareButton
                url={url}
                title={title}
                className="c-editor__share-icon"
              >
                <TwitterIcon
                  size={32}
                  round
                />
              </TwitterShareButton>
            </span>
            )}
        >
          Twitter
        </Popup>

        <Popup
          trigger={(
            <span style={{ display: 'inline-block' }}>
              <VKShareButton
              url={url}
              image={article.image}
              windowWidth={660}
              windowHeight={460}
              className="c-editor__share-icon"
              >
                <VKIcon
                  size={32}
                  round
                />
              </VKShareButton>
            </span>
          )}
        >
          VK
        </Popup>

        <Popup
          trigger={(
            <span style={{ display: 'inline-block' }} >
              <RedditShareButton
                url={url}
                title={title}
                windowWidth={660}
                windowHeight={460}
                className="c-editor__share-icon"
              >
                <RedditIcon
                  size={32}
                  round
                />
              </RedditShareButton>
            </span>
          )}
        >
          Reddit
        </Popup>
        <Popup
          trigger={(
            <Button style={{ position: 'relative', top: -9, width: 32, height: 32 }} circular color="primary" icon="copy" onClick={this.onCopy.bind(this)} />
          )}
        >
          Copy article link
        </Popup>
      </span>
    )
  }

  _renderShareIcon() {
    if (!this.props.options.showShareButtons) return;

    return (
      <Popup
        trigger={this._renderShareButton()}
        hoverable
      >
        {this._renderShareButtons()}
      </Popup>
    )
  }

  _navigateToEditor() {
    const { article } = this.props
    const wikiSource = article.wikiSource || 'https://en.wikipedia.org';

    if (article.mediaSource === 'script') {
      return NotificationManager.info('The media of custom Videowiki articles are editable only in the script page');
    }
    this.props.history.push(`/${this.props.language}/editor/${article.title}?wikiSource=${wikiSource}`)
  }

  _navigateToArticle() {
    const { article } = this.props
    const wikiSource = article.wikiSource || 'https://en.wikipedia.org';
    window.open(`${wikiSource}/wiki/${article.title}`);
  }

  _publishArticle() {
    this.props.onPublishArticle()
  }

  _renderPublishOrEditIcon() {
    if (this.props.options.showPublish) {
      return (
        <Button
          size="huge"
          basic
          icon
          className="c-editor__toolbar-publish"
          title="Publish"
          onClick={() => this._publishArticle()}
        >
          <Icon name="save" inverted color="grey" />
        </Button>
      );
    }
    if (this.props.options.showNavigateToArticle) {
      return (
        <Blinker
          secondary="#1678c2"
          interval={1500}
          repeat={3}
          blink={this.state.blink}
          onStop={() => this.setState({ blink: false })}
        >
          <Button
            basic
            icon
            className="c-editor__toolbar-publish"
            style={{ height: '100%' }}
            title="Verify/Edit text and media"
            onClick={() => this._navigateToArticle()}
          >
            <Icon name="pencil" inverted color="grey" />
          </Button>
        </Blinker>
      )
    }
    return null;
  }

  _renderBackButton() {
    if (!this.props.options.showBackButton) return;
    return (
      <Button
        size="huge"
        basic
        icon
        className="c-editor__toolbar-publish"
        title="Back to article"
        onClick={() => this.props.onBack()}
      >
        <Icon name="chevron left" inverted color="grey" />
      </Button>
    )
  }

  _renderViewerModeDropdown() {
    if (!this.props.options.showViewerModeDropdown) return;

    return (
      <Dropdown
        style={{ paddingTop: '1rem', paddingLeft: '1rem' }}
        value={this.props.viewerMode}
        options={[{ key: 1, text: 'Player Mode', value: 'player' }, { key: 2, text: 'Editor Mode', value: 'editor' }]}
        onChange={this.props.onViewerModeChange}
      />
    )
  }

  _renderTranslateButton() {
    if (!this.props.options.showTranslate) return;
    return (
      // eslint-disable-next-line 
      <a
        className="c-editor__footer-wiki c-editor__footer-sidebar c-editor__toolbar-publish c-app-footer__link "
        style={{ paddingRight: '1.2em', cursor: 'pointer' }}
        // href="javascript:void(0)"
        onClick={this.onTranslateButtonClick.bind(this)}
      >
        <Popup
          position="bottom right"
          trigger={
            <Icon name="translate" inverted color="grey" />
          }
        >
          Translate and export
        </Popup>
      </a>
    )
  }

  _renderAddHumanVoiceModal() {
    return (
      <AddHumanVoiceModal
        open={this.state.addHumanVoiceModalVisible}
        onClose={() => this.setState({ addHumanVoiceModalVisible: false })}
        skippable={false}
        onSubmit={(val) => this.onAddHumanVoice(val)}
      />
    )
  }
  render() {
    const { article } = this.props
    // const wikiSource = article.wikiSource || 'https://en.wikipedia.org';
    return (
      <div className="c-editor__toolbar">
        {this._renderViewerModeDropdown()}
        {this._renderBackButton()}
        <span className="c-editor__toolbar-title">{article.title.split('_').join(' ')}</span>
        {this._renderTranslateButton()}
        {this._renderExportArticle()}
        {this._renderUpdateButton()}
        {this._renderShareIcon()}
        {this._renderPublishOrEditIcon()}
        {this._renderAddHumanVoiceModal()}
      </div>
    )
  }
}

EditorHeader.propTypes = {
  article: PropTypes.object.isRequired,
  mode: PropTypes.string,
  history: PropTypes.object.isRequired,
  onPublishArticle: PropTypes.func.isRequired,
  currentSlide: PropTypes.object.isRequired,
  showPublish: PropTypes.bool,
  fetchArticleVideoState: PropTypes.string,
  authenticated: PropTypes.bool,
  articleVideo: PropTypes.object,
  articleLastVideo: PropTypes.object,
  onBack: PropTypes.func,
  onTranslate: PropTypes.func,
  onPausePlay: PropTypes.func,
  onViewerModeChange: PropTypes.func,
  viewerMode: PropTypes.string.isRequired,
  showViewerModeDropdown: PropTypes.bool,
  showTranslate: PropTypes.bool,
  options: PropTypes.object,
  isExportable: PropTypes.bool,
}

EditorHeader.defaultProps = {
  authenticated: false,
  fetchArticleVideoState: '',
  showPublish: false,
  articleVideo: {
    video: {},
    exported: false,
  },
  articleLastVideo: {},
  onBack: () => {},
  onTranslate: () => {},
  onPausePlay: () => {},
  onViewerModeChange: () => {},
  onAddHumanVoice: () => {},
  showViewerModeDropdown: false,
  showTranslate: false,
  options: {},
  isExportable: false,
}

export default withRouter(EditorHeader)
