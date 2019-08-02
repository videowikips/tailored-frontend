import React from 'react';
import PropTypes from 'prop-types';
import { TextArea, Button } from 'semantic-ui-react';
import { debounce } from '../../../../../shared/utils/helpers';

class TranslateBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
    this.saveValue = debounce((value, currentSlideIndex, currentSubslideIndex) => {
      this.props.onSave(value, currentSlideIndex, currentSubslideIndex)
    }, 1000)
  }

  componentDidMount() {
    if (this.state.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if ((this.props.currentSlideIndex !== nextProps.currentSlideIndex || this.props.currentSubslideIndex !== nextProps.currentSubslideIndex) && this.props.value !== this.state.value) {
        this.props.onSave(this.state.value, this.props.currentSlideIndex, this.props.currentSubslideIndex);
      }
      this.setState({ value: nextProps.value });
    }
  }

  onValueChange = (value, currentSlideIndex, currentSubslideIndex) => {
    this.setState({ value })
    this.saveValue(value, currentSlideIndex, currentSubslideIndex);
  }

  render() {
    const { loading } = this.props;
    const { value } = this.state;

    return (
      <div className="c-export-human-voice__translate_box">
        <TextArea
          disabled={this.props.disabled}
          style={{ padding: 20, width: '100%' }}
          rows={5}
          placeholder="Translate slide text"
          value={value}
          onChange={(e, { value }) => {this.onValueChange(value, this.props.currentSlideIndex, this.props.currentSubslideIndex)}}
        />
        {/* <Button
          primary
          title="Click here after translating the text and recording the audio to the slide"
          loading={loading}
          disabled={loading || value.trim() === this.props.value.trim() || !value.trim()}
          onClick={() => this.props.onSave(value)}
        >Save</Button> */}
      </div>
    )
  }
}

TranslateBox.propTypes = {
  value: PropTypes.string,
  loading: PropTypes.bool,
  saveDisabled: PropTypes.bool,
  onSave: PropTypes.func,
}

TranslateBox.defaultProps = {
  value: '',
  saveDisabled: false,
  looading: false,
  onSave: () => {},
}

export default TranslateBox;
