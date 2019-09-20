import React from 'react';
import { Card, Button, Progress } from 'semantic-ui-react';
import './style.scss';
import RoleRenderer from '../../containers/RoleRenderer';

export default class ArticleSummaryCard extends React.Component {
    render() {
        const { article, lang, onTitleClick, onDeleteClick } = this.props;
        console.log(article);
        return (
            <div className='article-summary-card'>
                <RoleRenderer roles={['admin']}>
                    <Button
                        basic
                        icon="times circle outline"
                        size="large"
                        onClick={onDeleteClick}
                        className="article-summary-card__delete_btn"
                    />
                </RoleRenderer>
                <Card fluid>
                    <Card.Header className="article-summary-card__card_header" onClick={onTitleClick}>
                        {lang}
                    </Card.Header>
                    <Card.Content>
                        <Button color="blue" onClick={onTitleClick}>
                            {article.metrics.completed.total}% Completed
                        </Button>
                        <h3 style={{ marginTop: '1rem' }}>Voice translations</h3>
                        {article.metrics.speakersMetrics.map(speakerMetric => (
                            <div key={`speaker-voice-metric-${speakerMetric.speaker.speakerNumber}`}>
                                <p>Speaker {speakerMetric.speaker.speakerNumber} ( {speakerMetric.speaker.speakerGender} )</p>
                                <Progress progress indicating percent={speakerMetric.progress} style={{ marginTop: '0.5rem' }} />
                            </div>
                        ))}
                        <h3 style={{ marginTop: '1rem' }}>Text translations</h3>
                        <Progress progress indicating percent={article.metrics.completed.text} />
                    </Card.Content>
                </Card>
            </div>
        )
    }
}