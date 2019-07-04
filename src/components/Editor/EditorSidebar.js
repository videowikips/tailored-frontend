import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Sidebar, Menu, Progress } from 'semantic-ui-react'
import { Scrollbars } from 'react-custom-scrollbars'

export default class EditorSidebar extends Component {
  _renderMenuItem () {
    const { toc, currentSlideIndex, currentSubslideIndex, currentNumberOfSlides, navigateToSlide } = this.props
    return toc.map((item, index) => {
      // const title = `${item['tocnumber']} ${item['title']}`

      let active = false
      let percent = 0

      if (currentSlideIndex === index) {
        active = true
        percent = Math.floor(100 * (currentSubslideIndex + 1) / currentNumberOfSlides)
      }

      return active ? (
        <Progress percent={percent} className="c-menu-progress" key={index}>
          <div className="c-menu-progress-item">
            <Menu.Item
              name={ `${index}` }
              content={ index + 1 }
              active={ active }
              className={ `c-sidebar__menu-item--level-1` }
              key= { `c-menu-progress-item-${index}` }
              link={true}
              onClick={() => navigateToSlide(index)}
            />
          </div>
        </Progress>
      ) : (
        <Menu.Item
          name={ `${index}` }
          content={ index + 1 }
          active={ active }
          className={ `c-sidebar__menu-item--level-1` }
          key= { `c-menu-progress-item-${index}` }
          link={true}
          onClick={() => navigateToSlide(index)}
        />
      )
    })
  }

  render () {
    const { visible } = this.props
    return (
      <Sidebar
        as={Menu}
        animation="slide along"
        width="thin"
        visible={visible}
        icon="labeled"
        vertical
        inverted
        className="c-sidebar"
      >
        <Scrollbars>
          { this._renderMenuItem() }
        </Scrollbars>
      </Sidebar>
    )
  }
}

EditorSidebar.propTypes = {
  toc: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  currentSlideIndex: PropTypes.number.isRequired,
  navigateToSlide: PropTypes.func.isRequired,
}
