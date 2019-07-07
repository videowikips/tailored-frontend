import React from 'react';

const SCALE = 1;
const SLIDE_DURATION_THREASHOLD = 500;
const DELTA_THREASHOLD = 30000;

function formatTime(milliseconds) {
    if (!milliseconds) return '00:00';
    let seconds = milliseconds / 1000;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    let time = minutes + ':' + seconds;

    return time.substr(0, 8);
}

function durationToPixels(duration, scale) {
    return Math.floor(scale * duration / 10)
}

function pixelsToDuration(width, scale) {
    return width * 10 / scale
}

function drawSecond(ctx, xPos, t) {
    ctx.fillStyle = "white";
    let text = formatTime(t);
    let metrics = ctx.measureText(text);
    let x = xPos - metrics.width / 2;
    ctx.fillText(text, x, 60)
}

function drawTics(ctx, xPos, duration) {
    ctx.strokeStyle = "white";
    let divisions = duration / 250;
    let step = durationToPixels(250, SCALE);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < divisions; i++) {
        let x = Math.floor(.5 + xPos + step * i);
        x += .5;
        ctx.moveTo(x, 60);
        if (i === 2) {
            ctx.lineTo(x, 45)
        } else {
            ctx.lineTo(x, 50)
        }
    }
    ctx.stroke()
}
function drawCanvas(canvasElt, width, height, duration, startTime, endTime) {
    let ctx = canvasElt.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.font = height / 6 + "px Open Sans";
    if (startTime < 0) {
        startTime = 0
    }
    if (duration) {
        endTime = Math.min(endTime, duration)
    }
    for (let t = startTime; t < endTime; t += 1e3) {
        let xPos = durationToPixels(t - startTime, SCALE);
        drawSecond(ctx, xPos, t);
        drawTics(ctx, xPos, Math.min(1e3, endTime - t))
    }
}

function removeMilliseconds(time) {
    return parseInt(time / 1000) * 1000;
}


class VideoTimeline extends React.Component {

    state = {
        deltaMS: 0,
        deltas: [],
        left: 0,
        lastLeft: 0,
        barHalfSize: 0,
    }

    componentDidMount = () => {
        const { duration } = this.props;

        drawCanvas(this.canvasRef, 6000, 65, duration, 0, 60000)
        const barHalfSize = this.canvasRef.parentElement.offsetWidth / 2;
        this.setState({ left: barHalfSize, barHalfSize }, () => {
            const newLeft = this.state.barHalfSize - durationToPixels(this.props.currentTime, SCALE);
            this.setState({ left: newLeft, lastLeft: newLeft });
        });
        window.onresize = () => {
            setTimeout(() => {
                this.setState(({ barHalfSize, left }) => {
                    const newBarHalfSize = this.canvasRef.parentElement.offsetWidth / 2;

                    return {
                        barHalfSize: newBarHalfSize,
                        left: left - barHalfSize + newBarHalfSize
                    };
                });
            }, 0);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentTime !== nextProps.currentTime) {
            console.log(pixelsToDuration(this.state.barHalfSize))
            if ((nextProps.currentTime - this.state.deltaMS + pixelsToDuration(this.state.barHalfSize, SCALE)) >= DELTA_THREASHOLD) {
                // this.setState(({deltaMS}) => ({ deltaMS: deltaMS + DELTA_THREASHOLD }));
                const startTime = removeMilliseconds(nextProps.currentTime - pixelsToDuration(this.state.barHalfSize, SCALE));
                const endTime = removeMilliseconds(nextProps.currentTime + DELTA_THREASHOLD);
                console.log('delta update', nextProps.currentTime, this.state.deltaMS, startTime, endTime);

                const deltaMS = startTime;
                this.setState(({ deltas }) => ({ deltaMS, deltas: [...deltas, { deltaMS, startTime, endTime }] }), () => {
                    drawCanvas(this.canvasRef, 6000, 65, nextProps.duration, startTime, endTime);
                })
            } else if (this.state.deltaMS && (nextProps.currentTime - pixelsToDuration(this.state.barHalfSize, SCALE)) <= this.state.deltaMS) {
                console.log('update backward');
                this.setState(({ deltas }) => {
                    let startTime = 0;
                    let endTime = 60000;
                    let deltaMS = 0;
                    let newDeltas = [...deltas];
                    if ( deltas.length > 0) {
                        const lastDelta = newDeltas.pop();
                        startTime = lastDelta.startTime;
                        endTime = lastDelta.endTime;
                        deltaMS = lastDelta.deltaMS;
                    }

                    drawCanvas(this.canvasRef, 6000, 65, nextProps.duration, startTime, endTime);
                    return { deltas: newDeltas, deltaMS };
                })
            }
        }
    }

    componentWillUnmount = () => {
        window.onresize = null;
    }

    onDragCapture = (e) => {
        const currentleft = e.clientX;
        if (currentleft) {
            this.setState(({ left, lastLeft, barHalfSize }) => {
                let newLeft = left;
                if (currentleft < lastLeft) {
                    newLeft = left - 40;
                } else if (currentleft > lastLeft) {
                    newLeft = left + 40;
                } else {
                    newLeft = left;
                }
                if (newLeft >= barHalfSize) {
                    newLeft = barHalfSize;
                }
                if (this.props.onTimeChange) {
                    this.props.onTimeChange(pixelsToDuration(barHalfSize - newLeft, SCALE))
                }
                return { left: newLeft, lastLeft: currentleft };
            })
        }
    }

    onDragStart = (e) => {
        let img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        e.dataTransfer.setDragImage(img, 0, 0);
    }

    onSlideDrag = (e, index) => {
        e.stopPropagation();
        const currentleft = e.clientX;
        if (currentleft) {
            const { slides } = this.props;
            const { startTime, endTime } = slides[index];
            let left = durationToPixels(startTime, SCALE);
            let { lastLeft } = slides[index];
            if (!lastLeft) {
                lastLeft = 0
            }
            let newLeft = left;
            if (currentleft < lastLeft) {
                newLeft = left - 3;
            } else if (currentleft > lastLeft) {
                newLeft = left + 3;
            }
            if (newLeft <= 0) {
                newLeft = 0;
            }
            const diff = slides[index].startTime - pixelsToDuration(newLeft, SCALE)
            slides[index].startTime -= diff
            slides[index].endTime = endTime - diff;
            console.log(slides[index]);
            slides[index].lastLeft = currentleft;
            this.props.onSlidesChange(slides);
            // this.setState(({ slides }) => {
            //     const { left, lastLeft } = slides[index];
            //     let newLeft = left;
            //     if (currentleft < lastLeft) {
            //         newLeft = left - 3;
            //     } else if (currentleft > lastLeft) {
            //         newLeft = left + 3;
            //     }
            //     if (newLeft <= 0) {
            //         newLeft = 0;
            //     }
            //     slides[index].left = newLeft;
            //     slides[index].lastLeft = currentleft;

            //     return { slides };
            // })
        }
    }

    onExpandSlide = (e, index) => {
        e.stopPropagation();
        const currentleft = e.clientX;
        if (currentleft) {
            const { slides } = this.props;
            let { lastLeft } = slides[index];
            if (!lastLeft) {
                lastLeft = 0;
            }
            if (currentleft < lastLeft) {
                slides[index].endTime -= 20;
            } else if (currentleft > lastLeft) {
                slides[index].endTime += 20;
            }

            if ((slides[index].endTime - slides[index].startTime) < SLIDE_DURATION_THREASHOLD) {
                slides[index].endTime = slides[index].startTime + SLIDE_DURATION_THREASHOLD;
            }

            slides[index].lastLeft = currentleft;
            this.props.onSlidesChange(slides);
        }
    }

    render() {
        const left = this.state.barHalfSize - durationToPixels(this.props.currentTime - this.state.deltaMS, SCALE);
        console.log(formatTime(this.props.currentTime), this.props.currentTime - this.state.deltaMS)
        return (
            <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: 65, background: '#1a1a1a' }}>
                <canvas
                    ref={(ref) => this.canvasRef = ref}
                    onDrag={this.onDragCapture}
                    onDragStart={this.onDragStart}
                    draggable={true}
                    width={6000}
                    height={65}
                    style={{ background: '#1a1a1a', position: 'absolute', left }}
                />
                <div style={{ content: '', dispaly: 'block', height: '100%', left: '50%', position: 'absolute', width: 0, zIndex: 2, borderRight: '1px solid #FC0D1B' }}>
                </div>
                <div
                    onDrag={this.onDragCapture}
                    // onDrag={this.onDragStart}
                    onDragStart={this.onDragStart}
                    draggable={true}
                    style={{ position: 'absolute', left, width: 6000, height: 65, color: 'white' }}>
                    {this.props.slides.map((slide, index) => (
                        <React.Fragment key={slide.text + 'fragment'}>
                            <div
                                key={slide.text}
                                style={{
                                    display: 'inline-block',
                                    position: 'absolute',
                                    top: 20,
                                    height: 20,
                                    background: 'white',
                                    color: 'black',
                                    padding: 2,
                                    paddingLeft: 5,
                                    width: durationToPixels(slide.endTime, SCALE) - durationToPixels(slide.startTime, SCALE),
                                    left: durationToPixels( slide.startTime, SCALE),
                                }}
                                draggable
                                onDragStart={this.onDragStart}
                                onDragCapture={(e) => this.onSlideDrag(e, index)}
                            >
                                {slide.text}
                            </div>
                            <div key={slide.text + 'handler'}
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    height: 20,
                                    left: durationToPixels(slide.startTime, SCALE) + durationToPixels(slide.endTime - slide.startTime, SCALE) }}
                                >
                                <span
                                    href="javascript:void(0)"
                                    style={{ background: '#A2A3A4', right: 0, position: 'absolute', cursor: 'col-resize', height: '100%' }}
                                    draggable={true}
                                    onDragStart={this.onDragStart}
                                    onDragCapture={(e) => this.onExpandSlide(e, index)}
                                >
                                    >
                            </span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )
    }
}

export default VideoTimeline;