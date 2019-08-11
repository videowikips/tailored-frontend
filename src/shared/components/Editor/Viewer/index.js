import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import SlideShow from '../../../components/SlideShow';
import One from './One';
import Two from './Two'
import Three from './Three'
import Four from './Four'
import Five from './Five'

import AudioPlayer from '../AudioPlayer'

const defaultComponent = (
  <div className="c-editor__content-video-viewer">
    <div className="box__input">
      <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"/></svg>
      <label>Choose a file or drag it here.</label>
    </div>
  </div>
)

class Viewer extends Component {
  constructor (props) {
    super(props)
    this.media = []
    this.playingMedia = null;
    this.layoutStartSlide = 0;
    this.chosenLayout = this._chooseLayout();
  }

  /*
    Selects a layout between 2, 3, 4 and 5 slides randomly.
    If the number of slides are less than 6, return the number of slides as layout
    or 2, whichever is higher.
  */
  _chooseLayout () {
    const { slides } = this.props
    if (this.props.layout === 'random') {
      if (slides.length <= 5) {
        return slides.length > 1 ? slides.length : 2
      } else {
        return Math.floor((Math.random() * 4)) + 2
      }
    } else {
      return this.props.layout;
    }
  }

  showItem (item, isActive) {
    if (!item) return;
    let media;
    if (isActive) {
      media = item.content[this.props.currentSubslideIndex].media;
    } else {
      media = item.content[0].media;
    }
    let component
    const mediaArray = [];
    if (media && media.length > 0) {
      if (isActive) {
        media.forEach((mitem, index) => {
          const array = mitem.url.split('.')
          const format = array[array.length - 1]
          switch (format) {
            case 'mp4':
            case 'ogg':
            case 'ogv':
            case 'webm':
              const playing = this.props.isPlaying && this.props.currentSubmediaIndex === index;
              mitem.playing = playing;
              mediaArray.push(mitem)
              break
            default:
              mediaArray.push(mitem)
              break
          }
        });
      } else {
        const array = media[0].url.split('.')
        const format = array[array.length - 1]
        switch (format) {
          case 'mp4':
          case 'ogg':
          case 'ogv':
          case 'webm':
            media[0].playing = false;
            mediaArray.push(media[0])
            break
          default:
            mediaArray.push(media[0])
            break
        }
      }

      component = (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <SlideShow
            slides={mediaArray}
            playing={this.props.isPlaying && isActive}
            isActive={isActive}
            // key={`slideshow-${this.props.currentSlideIndex}-${this.props.currentSubslideIndex}`}
            defaultStartTime={this.props.defaultSlideStartTime}
            onSlideChange={this.props.onSubMediaSlideChange}
          />
        </div>
      );
    } else {
      component = defaultComponent;
    }

    return isActive ? component
    : (
      <div className="outer-container">
        <div className="inner-container">
          <div className="overlay" />
          <div className="component-wrapper">
            {component}
          </div>
        </div>
      </div>
    )
  }

  renderItems () {
    const { currentSlideIndex, slides } = this.props

    if (this.chosenLayout === 1) {
      this.media = [slides[currentSlideIndex]];
      this.layoutStartSlide = 0;
    } else {
      if (currentSlideIndex === 0) {
        this.layoutStartSlide = 0
        this.media = slides.slice(currentSlideIndex, this.chosenLayout + currentSlideIndex)
      } else if (currentSlideIndex >= this.layoutStartSlide + this.chosenLayout) {
        this.chosenLayout = this._chooseLayout()
        this.layoutStartSlide = currentSlideIndex
        this.media = slides.slice(currentSlideIndex, this.chosenLayout + currentSlideIndex)
      } else if (currentSlideIndex < this.layoutStartSlide) {
        this.chosenLayout = this._chooseLayout()
        this.layoutStartSlide = this.layoutStartSlide - this.chosenLayout
        this.media = slides.slice(this.layoutStartSlide, this.layoutStartSlide + this.chosenLayout)
      }
    }

    // this.chosenLayout = 5;
    const current = currentSlideIndex - this.layoutStartSlide

    let layout
    switch (this.chosenLayout) {
      case 5: layout = <Five media={this.media} current={current} renderItem={(item, isActive) => this.showItem(item, isActive)} />; break;
      case 4: layout = <Four media={this.media} current={current} renderItem={(item, isActive) => this.showItem(item, isActive)} />; break;
      case 3: layout = <Three media={this.media} current={current} renderItem={(item, isActive) => this.showItem(item, isActive)} />; break;
      case 1: layout = <One media={this.media} current={current} renderItem={(item, isActive) => this.showItem(item, isActive)} />; break;
      default:layout = <Two media={this.media} current={current} renderItem={(item, isActive) => this.showItem(item, isActive)} />;
    }
    return <div key={this.chosenLayout} style={{ height: '100%' }}>{layout}</div>
  }

  render () {
    const { currentSlideIndex, slides, onSlidePlayComplete, isPlaying, playbackSpeed } = this.props
    const currentSlide = slides[currentSlideIndex]
    if (!currentSlide || !currentSlide.content[this.props.currentSubslideIndex]) return <div>Loading</div>
    const { audio, text } = currentSlide.content[this.props.currentSubslideIndex];
    return (
      <div className="carousel">
        <ReactCSSTransitionGroup
          transitionName="translate"
          transitionAppear={true}
          transitionLeave={false}
          transitionAppearTimeout={2000}
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={0}
          className="carousel__slide"
        >
          {this.renderItems()}
        </ReactCSSTransitionGroup>
        <AudioPlayer
          description={text}
          showDescription={this.props.showDescription}
          audio={audio}
          onSlidePlayComplete={onSlidePlayComplete}
          isPlaying={isPlaying}
          muted={this.props.muted}
          onAudioLoad={this.props.onAudioLoad}
          showTextTransition={true}
          playbackSpeed={playbackSpeed}
        />
      </div>
    )
  }
}

Viewer.propTypes = {
  slides: PropTypes.array,
  currentSlideIndex: PropTypes.number.isRequired,
  currentSubmediaIndex: PropTypes.number.isRequired,
  currentSubslideIndex: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  showDescription: PropTypes.bool,
  onSlidePlayComplete: PropTypes.func.isRequired,
  playbackSpeed: PropTypes.number.isRequired,
  onSubMediaSlideChange: PropTypes.func,
  onAudioLoad: PropTypes.func,
  muted: PropTypes.bool,
  defaultSlideStartTime: PropTypes.number,
  layout: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Viewer.defaultProps = {
  onSubMediaSlideChange: () => {},
  onAudioLoad: () => {},
  currentcurrentSubmediaIndex: 0,
  currentSubslideIndex: 0,
  defaultSlideStartTime: 0,
  showDescription: true,
  muted: false,
  layout: 'random',
}

export default Viewer;
