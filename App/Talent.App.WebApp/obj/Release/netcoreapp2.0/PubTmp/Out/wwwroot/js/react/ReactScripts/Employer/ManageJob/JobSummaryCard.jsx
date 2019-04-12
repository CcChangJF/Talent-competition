import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button, Label, ButtonGroup, Icon } from 'semantic-ui-react';
import moment from 'moment';


export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
        
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    render() {
        let title = this.props.details ? this.props.details.title : "";
        let location = this.props.details ?
            `${this.props.details.location.city}, ${this.props.details.location.country}` : ""
        let description = this.props.details ? this.props.details.summary : "";
        let expiryDate = this.props.details ? this.props.details.expiryDate : "";
        let isExpire = ("" != expiryDate && moment(new Date()).isSameOrBefore(expiryDate)) ? false : true;
        return (
            <Card className="job-summary-card" fluid>
                <Card.Content>
                    <Label as="a" color="black" ribbon="right">
                        <Icon name="user"></Icon>
                        0
                    </Label>
                    <Card.Header>{title}</Card.Header>
                    <Card.Meta>{location}</Card.Meta>
                    <Card.Description>{description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className="ui container">
                        <div className="ui four column grid">
                            <div className="ui column">
                                <Button size="tiny"
                                    color={isExpire ? "red" : "grey"}>Expired</Button>
                            </div>
                            <div className="ui column">
                                <ButtonGroup fluid size="tiny">
                                    <Button onClick={this.props.closeFunction}><Icon name="dont"></Icon>Close</Button>
                                    <Button onClick={this.props.editFunction} ><Icon name="edit"></Icon>Edit </Button>
                                    <Button onClick={this.props.copyFunction} ><Icon name="copy"></Icon>Copy </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>

        );
    }
}