import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Users from './users';
import VideoUpload from './videoUpload';
import InstructorVideoUpload from './instructorVideoUpload';
import IntroVideoUpload from './introVideoUpload';
import Dashboard from "./Dashboard";
import { LayoutSplashScreen } from "../../../_metronic";

import CustomSnackbar from './serviceComponents/CustomSnackbar';
import CustomConfirm from './serviceComponents/CustomConfirm';

import requireAdmin from '../../services/requireAdmin';
import requireInstructor from '../../services/requireInstructor';

import { firebase, instance } from '../../services';


export default class extends React.Component {
    constructor(props) {
        super(props);
        firebase.auth().currentUser.getIdToken().then((token) => {
            instance.defaults.headers.common['authorization'] = "Bearer " + token;
        });
    }

    render() {
        return (
            <Suspense fallback={<LayoutSplashScreen />}>
                <Switch>
                    {
                        <Redirect exact from="/" to="/dashboard" />
                    }
                    <Route path="/users" component={requireAdmin(Users)} />
                    <Route path="/videoUpload" component={requireAdmin(VideoUpload)} />
                    <Route path="/instructorVideoUpload" component={requireInstructor(InstructorVideoUpload)} />
                    <Route path="/introVideoUpload" component={requireAdmin(IntroVideoUpload)} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Redirect to="/dashboard" />
                </Switch>
                
                <CustomSnackbar />
                <CustomConfirm />
            </Suspense>
        );
    }
}