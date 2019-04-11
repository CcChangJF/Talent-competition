import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card } from 'semantic-ui-react';
import CreateJob from '../CreateJob/CreateJob.jsx';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            jobSummaryCards: "",
            loaderData: loader,
            activePage: 1,
            limit: 6,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            hasData: true
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.handPageChange = this.handPageChange.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.loadData();
        this.init();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        var params = {
            activePage: this.state.activePage,
            sortByDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired,
            limit: this.state.limit
        }
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: function (res) {
                let jobsData = null;
                let totalCount = Math.ceil(parseInt(res.totalCount) / this.state.limit);

                if ("" != res.myJobs) {
                    jobsData = res.myJobs
                    //console.log("loadJobs", jobsData)
                    this.setState({ totalPages: totalCount });
                    this.updateWithoutSave(jobsData);
                }
                else {
                    this.setState({ hasData: false });
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    updateWithoutSave(newJobsData) {
        if (null != newJobsData) {
            this.setState({
                hasData: true,
                loadJobs: newJobsData
            }, function () {
                this.setState({ jobSummaryCards: this.updateJobSummaryCards() })
            });
        }
    }

    updateJobSummaryCards() {
        let summaryCard = null;
        let jobsData = this.state.loadJobs;
        if (jobsData != "") {
            summaryCard = jobsData.map((job) =>
                <JobSummaryCard
                    details={job}
                    editFunction={this.editFunction}
                    closeFunction={this.closeFunction}>
                </JobSummaryCard>
            );
        }
        return (<Card.Group itemsPerRow={3}>
                    {summaryCard}
                </Card.Group>
            );
    }

    handPageChange(_activePage) {
        this.setState({ activePage: _activePage },
            function () { this.loadData() });
    }

    render() {
        let summaryCards = (this.state.hasData) ? 
            this.state.jobSummaryCards : (<p>No Jobs Found.</p>);

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <div className="ui grid">
                        <div className="ui row sixteen column">
                            <h2>List of Jobs</h2>
                        </div>
                        <div className="ui row sixteen column">
                            <Icon name="filter" /> Filter &nbsp; &nbsp;
                            <Dropdown
                                placeholder="Choose Filter" /> &nbsp; &nbsp;
                            <Icon name="calendar alternate" /> &nbsp;
                                    Sort by date: &nbsp;&nbsp;
                            <Dropdown
                                placeholder="Newest first" />
                        </div>
                        <div className="ui row sixteen column">
                                {summaryCards}
                        </div>
                        <div className="ui row sixteen column">
                            <div className="ui container fluid">
                            <div className="ui basic segment right floated">
                            <Pagination 
                                activePage={this.state.activePage}
                                totalPages={this.state.totalPages}
                                onPageChange={(e, { activePage }) => this.handPageChange(activePage)}></Pagination>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}