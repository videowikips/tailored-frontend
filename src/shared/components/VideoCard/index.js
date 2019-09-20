import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import './style.scss';
import RoleRenderer from '../../containers/RoleRenderer';

class VideoCard extends React.Component {
    render() {
        const { title, url, buttonTitle, loading, disabled, onButtonClick, onDeleteVideoClick } = this.props;
        return (
            <div className="video-card">
                <RoleRenderer roles={['admin']}>
                    <Button
                        basic
                        icon="times circle outline"
                        size="large"
                        onClick={onDeleteVideoClick}
                        className="video-card__delete_btn"
                    />
                </RoleRenderer>
                <Card fluid>
                    <Card.Content>
                        <Card.Header className="video-card__header">
                            {title}
                        </Card.Header>
                    </Card.Content>

                    <video src={url} controls preload={'false'} width={'100%'} />

                    <Card.Content style={{ padding: 0 }}>
                        <div style={{ color: 'white' }}>
                            <Button
                                onClick={onButtonClick}
                                fluid
                                color="blue"
                                disabled={loading}
                                loading={disabled}
                            >
                                {buttonTitle}
                            </Button>
                        </div>
                    </Card.Content>

                </Card>
            </div>
        );
    }
}

export default VideoCard;