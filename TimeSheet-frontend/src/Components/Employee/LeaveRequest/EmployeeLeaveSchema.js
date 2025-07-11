import * as Yup from 'yup';

export const schemaLeave=Yup.object().shape({
 

    startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required') .test('end-date-after-start', 'End date must be after start date', function(value) {
    const { startDate } = this.parent; // Get the value of startDate from the form values
    return startDate ? Yup.date().min(startDate, 'End date must be after start date').isValidSync(value) : true;
}),
  reason: Yup.string().required('Reason is required'),
  comments: Yup.string().required('Comments are required') .min(3, 'Comments should have at least 3 characters')

})  