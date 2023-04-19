import * as Yup from 'yup';

export const adminComplaintSchema = Yup.object().shape({
    status: Yup.string()
        .oneOf(['New', 'In Progress', 'Resolved'], 'Complaint Status is required')
        .required('Complaint Status is required'),
    adminResponse: Yup.string()
        .max(500, 'Response should not exceed 500 characters')
        .required('Response is required'),
});
