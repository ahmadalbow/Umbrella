export function sendScanRequest(
  unterverzeichnis: string,
  strahlertyp: string,
  strahlernummer: string,
  soll_leistung: number,
  comment: string
) {
  // URL to send the POST request to
  const url = "http://127.0.0.1:8000/api/scan/"; // Replace with your actual API endpoint

  // Request payload
  const data = {
    unterverzeichnis: unterverzeichnis,
    strahlertyp: strahlertyp,
    strahlernummer: strahlernummer,
    soll_leistung: soll_leistung,
    comment: comment,
  };
  console.log(data);
  // Options for the fetch function
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type as JSON
      // Add any other headers if needed
    },
    body: JSON.stringify(data), // Convert the data object to JSON
  };

  // Use the fetch function to send the POST request
  return fetch(url, options)
    .then((response) => {
      // Check if the response status is in the range 200-299 (indicating success)
      if (response.ok) {
        return response.json(); // Parse the JSON in the response
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    })
    .then((data) => {
      console.log("POST request successful:", data);
      // Handle the response data as needed
    })
    .catch((error) => {
      throw error;
      // Handle the error as needed
    });
}
