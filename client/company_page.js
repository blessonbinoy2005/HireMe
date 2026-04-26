import axios from 'axios';
import React, { useEffect, useState } from 'react';


function CompanyPage() {
    const [companyID, setCompanyID] = useState('');
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);


    const [formData, setFormData] = useState({
        JobTitle: '',
        JobDescription: ''
    });


    useEffect(() => {
        const storedID = localStorage.getItem('companyID');
        if (storedID) setCompanyID(storedID);
    }, []);


    useEffect(() => {
        if (!companyID) return;


        axios.get(`http://localhost:9000/api/jobs/${companyID}`)
            .then(res => setJobs(res.data))
            .catch(err => console.error(err));
    }, [companyID]);


    const handleEdit = (job) => {
        setEditingJob(job.JobID);
        setFormData({
            JobTitle: job.JobTitle,
            JobDescription: job.JobDescription
        });
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleUpdate = (jobID) => {
        axios.put(`http://localhost:9000/api/jobs/${jobID}`, formData)
            .then(res => {
                setJobs(jobs.map(job =>
                    job.JobID === jobID ? res.data : job
                ));
                setEditingJob(null);
            })
            .catch(err => console.error(err));
    };


    return (
        <div style={{ padding: '20px' }}>
            <h2>Company Dashboard</h2>


            {jobs.map(job => (
                <div key={job.JobID} style={{
                    border: '1px solid gray',
                    margin: '10px',
                    padding: '10px'
                }}>
                    {editingJob === job.JobID ? (
                        <>
                            <input
                                name="JobTitle"
                                value={formData.JobTitle}
                                onChange={handleChange}
                            />
                            <br /><br />


                            <textarea
                                name="JobDescription"
                                value={formData.JobDescription}
                                onChange={handleChange}
                            />
                            <br /><br />


                            <button onClick={() => handleUpdate(job.JobID)}>
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <h3>{job.JobTitle}</h3>
                            <p>{job.JobDescription}</p>
                            <p><b>Salary:</b> {job.SalaryRange}</p>
                            <p><b>Location:</b> {job.Address}</p>


                            <button onClick={() => handleEdit(job)}>
                                Edit
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}


export default CompanyPage;