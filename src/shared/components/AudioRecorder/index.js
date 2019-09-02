import React from 'react';
import PropTypes from 'prop-types';
import WaveStream from 'react-wave-stream';
import Recorder from 'recorder-js';
import NotificationService from '../../utils/NotificationService';
import { Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { formatTime } from '../../utils/helpers';
import RecordRTC from 'recordrtc';
import { getWaveHeader, decodeWaveData } from 'super-tiny-wave-decoder'

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
      startTime: null,
      remainingMS: null,
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

  componentWillUnmount = () => {
    try {
      this.stopMediaStream();
    } catch (e) {
      console.log(e);
    }
  }

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
    if (this.rec) {
      this.setState({ recording: true, startTime: Date.now() }, () => {
        this.rec.startRecording();
        this.props.onStart();
      });
      return;
    }
    if (getUserMedia) {

      getUserMedia(constraints).then((stream) => {
        console.log('getUserMedia() success, stream created, initializing Recorder.js ...');
        this.gumStream = stream;

        this.rec = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 100,
          ondataavailable: (blob) => {
            if (this.state.recording) {
              let remainingMS = null;
              if (this.state.recording && this.props.maxDuration && this.state.startTime) {
                const endTime = moment(this.state.startTime).add(this.props.maxDuration, 'seconds');
                remainingMS = endTime.diff(moment());
                if (remainingMS <= 200) {
                  this.stopRecording();
                }
              }
              this.setState({ remainingMS });
            }
          }
        });

        // start the recording process
        // this.rec.init(stream);
        this.setState({ recording: true, startTime: Date.now() }, () => {
          this.rec.startRecording();
          // this.rec.start();
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

  stopMediaStream = () => {
    if (this.rec) {
      this.rec.stopRecording(() => {
        this.rec.destroy();
        this.gumStream.getAudioTracks().forEach((track) => track.stop());
        this.gumStream = null;
        this.rec = null;
      })
    }
  }

  stopRecording = (cancel) => {
    // tell the recorder to stop the recording
    this.setState({ waveData: null, recording: false, startTime: null, remainingMS: null }, () => {
      if (this.rec) {
        let blob = this.rec.getBlob();
        this.props.onStop(cancel ? null : blob);
        this.stopMediaStream();
      }
    });
  }

  cancelRecording = () => {
    this.stopRecording(true);
  }

  render() {
    // console.log(this.state.startTime, this.props.maxDuration)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
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
        {this.props.maxDuration && this.state.startTime && this.state.remainingMS !== null && (
          <div
            style={{ margin: 10 }}
          >
            {formatTime(this.state.remainingMS)}
          </div>
        )}
        {/* {this.state.waveData && (
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
        )} */}

      </div>
    )
  }
}

AudioRecorder.propTypes = {
  record: PropTypes.bool,
  onStop: PropTypes.func,
  maxDuration: PropTypes.number,
}

AudioRecorder.defaultProps = {
  record: false,
  onStop: () => { },
  maxDuration: 0,
}

export default AudioRecorder;
