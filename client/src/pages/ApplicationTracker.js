import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/navbar";



function ApplicationTracker () {
    
    return (
        <>
        <header>
            <h1>Application Tracker Dashboard</h1>
            <Navbar />
        </header>

        <div className="dashboard">
            <div className="apply-status">
                <div className="status-column">
                    <h3>Saved</h3>
                    <div id="saved-list">{renderCards('Saved')}</div>
                </div>

                <div className="status-column">
                    <h3>Applied</h3>
                    <div id="applied-list">{renderCards('Applied')}</div>
                </div>

                <div className="status-column">
                    <h3>Interview</h3>
                    <div id="interview-list">{renderCards('Interview')}</div>
                </div>
            </div>

            <div className="result-status">
                <div className="status-column">
                    <h3>Offer</h3>
                    <div id="offer-list">{renderCards('Offer')}</div>
                </div>

                <div className="status-column">
                    <h3>Rejected</h3>
                    <div id="rejected-list">{renderCards('Rejected')}</div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ApplicationTracker;