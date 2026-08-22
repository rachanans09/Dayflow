import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_zoayxnx";
const TEMPLATE_ID = "template_756t10j";
const PUBLIC_KEY = "gf1oDHbsRRZZBgahB";

export async function sendLeaveStatusEmail({ toEmail, employeeName, status, comment }) {
  if (!toEmail) return;

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: toEmail,
      employee_name: employeeName || "Employee",
      leave_status: status,
      hr_comment: comment || "No specific feedback provided.",
    },
    PUBLIC_KEY
  );
}