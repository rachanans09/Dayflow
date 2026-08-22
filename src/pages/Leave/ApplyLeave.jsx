import { useState } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, PageContainer, Button, Input, Select } from "../../components/ui";
import toast from "react-hot-toast";

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("Paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return toast.error("Please pick start and end dates.");

    const user = auth.currentUser;
    if (!user) return toast.error("Session expired. Please log in.");

    setLoading(true);
    try {
      await addDoc(collection(db, "leaves"), {
        uid: user.uid,
        userEmail: user.email,
        leaveType,
        startDate,
        endDate,
        reason,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Leave application submitted!");
      setReason("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      toast.error("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Apply for Leave</h1>
        <p className="text-sm text-slate-500">Submit time-off requests for HR approval</p>
      </div>

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select label="Leave Category" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="Paid">Paid Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              required
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              required
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Input
            label="Reason / Remarks"
            placeholder="e.g. Attending family function"
            value={reason}
            required
            onChange={(e) => setReason(e.target.value)}
          />

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Submitting..." : "Submit Leave Application"}
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}