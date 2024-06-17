export function sendScanRequest(
  unterverzeichnis: string,
  strahlertyp: string,
  strahlernummer: string,
  soll_leistung: number,
  comment: string,
  
) {
  // URL to send the POST request to
  const url = "http://172.16.0.163:8000/api/scan/"; // Replace with your actual API endpoint

  // Request payload
  const data = {
    unterverzeichnis: unterverzeichnis,
    strahlertyp: strahlertyp,
    strahlernummer: strahlernummer,
    soll_leistung: soll_leistung,
    comment: comment,
    ip: "192.168.179.5"
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
