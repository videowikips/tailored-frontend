import React from 'react';
import PropTypes from 'prop-types';
import WaveStream from 'react-wave-stream';
import Recorder from 'recorder-js';
import NotificationService from '../../utils/NotificationService';
import { Button, Icon } from 'semantic-ui-react';

// shim for AudioContext when it's not avb.
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
const AudioContext = window.AudioContext || window.webkitAudioContext;

function getBrowserUserMedia() {
  let userMediaFunc;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    userMediaFunc = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  } else {
    userMediaFunc = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia).bind(navigator)
  }
  return userMediaFunc;
}

let getUserMedia;

try {

  getUserMedia = getBrowserUserMedia();
} catch (e) {
  alert('Error initilizing mic recorder')
}

class AudioRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: null,
      recording: false,
      blob: null,
      waveData: { data: [], lineTo: 0 },
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.record !== this.props.record) {
  //     if (nextProps.record) {
  //       this.startRecording();
  //     } else {
  //       this.stopRecording();
  //     }
  //   }
  // }

  toggleRecord = () => {
    if (this.state.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    console.log('starting record')

    const constraints = { audio: true, video: false }

    if (getUserMedia) {

      getUserMedia(constraints).then((stream) => {
        console.log('getUserMedia() success, stream created, initializing Recorder.js ...');
        this.audioContext = new AudioContext();
        console.log('audio context', this.audioContext);
        /*  assign to gumStream for later use  */
        this.gumStream = stream;
        /* use the stream */
        this.rec = new Recorder(this.audioContext, {
          numChannels: 1,
          onAnalysed: (waveData) => {
            if (this.state.recording) {
              this.setState({ waveData });
            }
          },
        })

        // start the recording process
        this.rec.init(stream);
        this.setState({ recording: true }, () => {
          this.rec.start();
          this.props.onStart();
        });
      }).catch((err) => {
        console.log(err);
        alert('Something went wrong, Please make sure you\'re using the latest version of your browser');
        this.props.onStop();
      });
    } else {
      NotificationService.info('Your browser doesn\'t support audio recording')
    }
  }

  stopRecording() {
    // tell the recorder to stop the recording
    if (this.rec) {
      console.log('==================== stopRecording ===========================')
      this.rec.stop()
        .then(({ blob }) => {
          this.props.onStop(blob);
          this.setState({ waveData: null, recording: false });
        })

      // stop microphone access
      this.gumStream.getAudioTracks().forEach((track) => track.stop());
    }

  }

  cancelRecording = () => {
    if (this.rec) {
      console.log('==================== canelRecording ===========================')
      this.rec.stop()
        .then(({ blob }) => {
          this.gumStream.getAudioTracks().forEach((track) => track.stop());
          this.props.onStop(null);
          this.setState({ waveData: null, recording: false });
        })
      // stop microphone access
    }

  }

  render() {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}
      >
        <Button
          icon
          primary
          size="large"
          // ="left"
          loading={this.props.loading}
          disabled={this.props.disabled}
          onClick={this.toggleRecord}
        >
          {!this.state.recording ? (
            <Icon name="microphone" />
          ) : (
              <Icon name="stop" />
            )}
          {!this.state.recording ? ' Record' : ' Stop'}
        </Button>
        {this.state.recording && (
          <Button
            onClick={this.cancelRecording}
          >
            Cancel
          </Button>
        )}
        {this.state.waveData && (
          <div
            style={{ 'display': this.state.recording ? 'block' : 'none' }} 
          >
            <WaveStream
              {...this.state.waveData}
              backgroundColor="#2185d0"
              // width={200}
              strokeColor="#000000"
            />
          </div>
        )}

      </div>
    )
  }
}

AudioRecorder.propTypes = {
  record: PropTypes.bool,
  onStop: PropTypes.func,
}

AudioRecorder.defaultProps = {
  record: false,
  onStop: () => { },
}

export default AudioRecorder;
