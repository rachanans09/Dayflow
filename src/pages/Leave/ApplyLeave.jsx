import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const DUMMY_UID = "test-user-123";

export default function ApplyLeave() {
  const [type, setType] = useState("Paid");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [remarks, setRemarks] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "leaves"), {
      uid: DUMMY_UID,
      type,
      start,
      end,
      remarks,
      status: "Pending",
    });
    alert("Leave request submitted!");
  };

  return (
    <form onSubmit={submit}>
      <h2>Apply for Leave</h2>
      <select onChange={(e) => setType(e.target.value)}>
        <option>Paid</option>
        <option>Sick</option>
        <option>Unpaid</option>
      </select>
      <input type="date" onChange={(e) => setStart(e.target.value)} />
      <input type="date" onChange={(e) => setEnd(e.target.value)} />
      <textarea placeholder="Remarks" onChange={(e) => setRemarks(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}