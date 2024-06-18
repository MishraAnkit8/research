// export async function sendEmail(toEmail: string[], subject: string, message: string) {
//     const NOTIFICATION_URL = process.env.NOTIFICATION_SERVICE_URL
//     if (!NOTIFICATION_URL) return console.error('Notification service URL not found')

//     const body = { toEmail, subject, message, fromAddress: 'noreply-portal@svkm.ac.in' }
//     console.log(JSON.stringify(body))
//     try {
//         const response = await fetch(`${NOTIFICATION_URL}/send-email-enc`, {
//             method: 'POST',
//             body: JSON.stringify(body),
//         })
//         console.log('response:::::::::', response)

//         logger.info('Response from notification service', response.status, response.statusText)
//         logger.info(`Email sent to ${toEmail.join(', ')}`)
//     } catch (error) {
//         logger.error('Error in sending email', error)
//     }
// }


// export async function sendMPCMeetingMail(json : any){

//     console.log("masterFormInsert : ",json.body);
//     const combinedArray = [
//         ...json.body.course_anchor,
//         ...json.body.program_anchor,
//         ...json.body.attendees
//     ];
    
//     const email = await getEmailBySessionLid(combinedArray);
//     console.log("email : ",email);
//     const emails = [...new Set(email.map(user => user.email))]
//     const subject = `Reminder For MPC Meeting`;
//     const message = `<p>Dear Sir/Madam</p><p>&nbsp;&nbsp;&nbsp; This is a gentle reminder that we have a meeting of MPC Name : ${json.body.meeting_name},DATE : ${json.body.meeting_date}</p><p><p><b>Meeting Link & Password :${json.body.meeting_description}</p><b>MPC PORTAL LINK :</b> https://lms.svkm.ac.in/login</p><p>Regards,<br>Portal</p>`
//     const encMessgae = encodeURIComponent(message);
//     await sendEmail(emails,subject,encMessgae);
// }