import { useHistory } from "react-router";
import { updateStatusForRes } from "../utils/api";

export default function CancelButton({ resId }) {
  const history = useHistory();
  async function clickHandler() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const ac = new AbortController();
      await updateStatusForRes(resId, "cancelled", ac.signal);
      history.go(0);
      return () => ac.abort();
    }
  }
  return (
    <button
      // key={resId}
      data-reservation-id-cancel={resId}
      className="btn btn-secondary"
      onClick={() => clickHandler(resId)}
    >
      Cancel
    </button>
  );
}
