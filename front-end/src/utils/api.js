/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */

// 3
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return null;
    }
    const payload = await response.json();
    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

//--------------------tables-----------------------------
//used in dashboard
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}
// 2 used in readReservation component
export async function updateIdsForTableAndRes(formData, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${formData.table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: formData }),
    signal,
  };
  return await fetchJson(url, options, {});
}

// used in newTable component
export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, {});
}

//used in dashboard.js component to delete resId from table
// changes status of table to free and status of res to finished
export async function deleteHandlerForTableResId(tableId, resId, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({
      data: { table_id: tableId, reservation_id: resId },
    }),
    signal,
  };
  return await fetchJson(url, options, {});
}
// export async function deleteHandlerForResStatus(resId, status, signal) {
//   const url = new URL(`${API_BASE_URL}/reservations/${resId}/status`);
//   const options = {
//     method: "PUT",
//     headers,
//     body: JSON.stringify({ data: { status } }),
//     signal,
//   };
//   return await fetchJson(url, options, {});
// }

//------------------reservations----------------------------------
//used in dashboard
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//used in newReservation component
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options);
}
// examine where im located
export async function reservationGrab(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  return await fetchJson(url, { signal }, {});
}
//supposed to update
//used in dashboard
export async function updateStatusForRes(resId, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${resId}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status } }),
    signal,
  };
  return await fetchJson(url, options, {});
}

//-----------------------------------------------------------
