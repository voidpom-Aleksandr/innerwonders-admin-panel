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

export default function HomePage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard" />
                }
                <Route path="/users" component={Users} />
                <Route path="/videoUpload" component={VideoUpload} />
                <Route path="/instructorVideoUpload" component={InstructorVideoUpload} />
                <Route path="/introVideoUpload" component={IntroVideoUpload} />
                <Route path="/dashboard" component={Dashboard} />
                <Redirect to="/dashboard" />
            </Switch>
            
            <CustomSnackbar />
            <CustomConfirm />
        </Suspense>
    );
}