import React from 'react';
import PropTypes from 'prop-types'
import { Grid, Icon } from 'semantic-ui-react';

function reduceSlidesSubslides(slides) {
  return slides.reduce((acc, slide, slideIndex) => !slide.content || slide.content.length === 0 ? acc : acc.concat(slide.content.map(((subslide, subslideIndex) => ({ ...subslide, slidePosition: slide.position, slideIndex, subslideIndex })))), [])
}

class SlidesList extends React.Component {
  getsubSlideBorderColor(subslide) {
    if (subslide.slideIndex === this.props.currentSlideIndex && subslide.subslideIndex === this.props.currentSubslideIndex) {
      return '#2185d0';
    } else if (subslide.text && subslide.audio) {
      return 'green';
    } else {
      return 'gray';
    }
  }

  renderSubslide(subslide, index) {
    let comp;
    if (subslide.media && subslide.media.length > 0) {
      const url = subslide.media[0].smallThumb || subslide.media[0].url;
      if (subslide.media[0].smallThumb) {
        comp = <img src={url} />;
      } else if (subslide.media[0].mediaType === 'video') {
        comp = <video preload={"false"} src={url} width="100%" height="100%" />;
      } else {
        comp = <img src={url} alt="" />;
      }
    } else {
      comp = null
    }

    return (
      <Grid.Row 
        key={`subslide-list-${subslide.subslideIndex}-${subslide.slideIndex}`} 
        style={{ cursor: 'pointer', margin: 0 }}
        onClick={() => this.props.onSubslideClick(subslide.slideIndex, subslide.subslideIndex)} 
      >

        <Grid.Column width={2}>
          <h4 style={{ margin: 5 }} >
            {index + 1}
          </h4>
        </Grid.Column>
        <Grid.Column width={8}>
          <div style={{ border: `3px solid ${this.getsubSlideBorderColor(subslide)}`, padding: 10, height: 80, marginBottom: 10 }} >
            {comp}
          </div>
        </Grid.Column>
        <Grid.Column width={5}>
          <p>Text {subslide.text && (<Icon name="check circle" color="green" />)}</p>
          <p>Voice {subslide.audio && (<Icon name="check circle" color="green" />)}</p>
        </Grid.Column>
      </Grid.Row>
    )
  }
  render() {
    return (
      <Grid style={{ maxHeight: '850px', overflowY: 'scroll', border: '3px solid #eee', margin: 0 }} >
        {reduceSlidesSubslides(this.props.slides).map((slide, index) => this.renderSubslide(slide, index))}
      </Grid>
    )
  }
}

SlidesList.propTypes = {
  slides: PropTypes.array,
  currentSlideIndex: PropTypes.number,
  translateable: PropTypes.bool,
  onSubslideClick: PropTypes.func,
}

SlidesList.defaultProps = {
  slides: [],
  currentSlideIndex: 0,
  translateable: false,
  onSubslideClick: () => { },
}

export default SlidesList;
