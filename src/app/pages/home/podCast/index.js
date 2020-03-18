import React, { Component } from 'react';

import {
    ListItem,
    List,
    ListItemText,
    ListItemAvatar,
    Avatar,
    ListItemSecondaryAction,
    IconButton,
    Typography
} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';

import firebase, { storageRef } from '../../../services/firebase';

import { CustomSnackbar, customConfirm, customConfirmClose } from '../../../services';

class PodCast extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // PodCast List
            podcastList: [],
            hoveredPodcastKey: ''
        };
    }

    // handle hover podcast
    handleHoverPodcast = (key) => {
        this.setState({
            hoveredPodcastKey: key
        });
    }

    // handleDeletePodcast
    handleDeletePodcast = (podcastKey) => {
        const self = this;
        customConfirm({
            title: 'Do you really wanna delete this podcast ?',
            okLabel: 'Delete',
            autoClose: false
        }, (dialogId) => {
            self.handleConfirmDeletePodcast(podcastKey, dialogId);
        });
    }

    // handleConfirmDeletePodcast
    handleConfirmDeletePodcast = (podcastKey, dialogId) => {
        const self = this;
        firebase.database().ref('podcasts/' + podcastKey).once('value')
            .then((snapshot) => {
                const podcast = snapshot.val().podcast;
                if (podcast) {
                    self.handleDeletePodcastOnServer(podcast, () => {
                        firebase.database().ref('podcasts/' + podcastKey).remove();

                        CustomSnackbar.success('Successfully deleted a podcast.');
                        customConfirmClose(dialogId);
                    });
                } else {
                    firebase.database().ref('podcasts/' + podcastKey).remove();
                    CustomSnackbar.success('Successfully deleted a podcast.');
                    customConfirmClose(dialogId);
                }
            });
    }

    // handleDeletePodcast
    handleDeletePodcastOnServer = (podcast, callback) => {
        // Create a reference to the file to delete
        storageRef.child(podcast)
            .delete().then(function () {
                // File deleted successfully
                if (callback) {
                    callback();
                }
            }).catch(function (error) {
                // Uh-oh, an error occurred!
            });
    }

    // Get Formatted File Size
    getReadableFileSizeString = (fileSizeInBytes) => {
        var i = -1;
        var byteUnits = [' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    };

    componentDidMount() {
        const self = this;

        this.podcastsRef = firebase.database().ref('podcasts');
        this.podcastsRef.on('value', function (snapshot) {
            let podcasts = [];

            snapshot.forEach(function (childSnapshot) {
                podcasts.push({
                    key: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            self.setState({
                podcastList: podcasts
            });
        });
    }

    render() {
        const { handleDeletePodcast } = this;
        return (
            <>
                <div className="kt-portlet kt-portlet--height-fluid">
                    <div className="kt-portlet__head">
                        <div className="kt-portlet__head-label">
                            <h3 className="kt-portlet__head-title">Podcasts ({this.state.podcastList.length})</h3>
                        </div>
                    </div>
                    <div className="kt-portlet__body pr-3 pl-3">
                        <div className="kt-widget4">
                            {this.state.podcastList.length === 0 &&
                                "There aren't any podcasts yet."
                            }
                            <List>
                                {this.state.podcastList.map(value => {
                                    return (
                                        <ListItem key={value.key} button
                                            alignItems="flex-start"
                                            onMouseOver={this.handleHoverPodcast.bind(this, value.key)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={`Podcast ${value.key}`}
                                                    src={value.thumbnail}
                                                    className="mr-3"
                                                    style={{
                                                        borderRadius: '0px',
                                                        width: '140px',
                                                        height: '80px',
                                                        border: "solid 1px #c7c7c7"
                                                    }}
                                                />
                                            </ListItemAvatar>

                                            <ListItemText
                                                id={value.key}
                                                primary={
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        className="d-block"
                                                        style={{ textOverflow: 'ellipsis', overflow: "hidden" }}
                                                    >{value.title}</Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="textPrimary"
                                                            className="d-block"
                                                            style={{ textOverflow: 'ellipsis', overflow: "hidden" }}
                                                        >{value.recoderName}</Typography>

                                                        <Typography
                                                            component="span"
                                                            className="d-block mt-2"
                                                        >
                                                            {
                                                                `Size: ${this.getReadableFileSizeString(value.fileSize)}  Play: ${value.playCount}  Download: ${value.downloadCount}`
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            component="span"
                                                            className="d-block mt-2"
                                                        > Uploader: {value.uploader.email} </Typography>
                                                    </>
                                                }
                                            />

                                            <ListItemSecondaryAction style={{ right: 0 }}>

                                                <IconButton aria-label="Delete"
                                                    onClick={handleDeletePodcast.bind(this, value.key)}
                                                    style={{ display: (this.state.hoveredPodcastKey === value.key ? 'inline-block' : 'none') }}>
                                                    <DeleteIcon fontSize="default" />
                                                </IconButton>

                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default PodCast;