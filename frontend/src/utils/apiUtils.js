import axios from "axios";

export const sendApiRequest = async (
  apiUrl,
  finalPayload,
  filteredHeaders,
  filteredCustomPayload,
  setApiResponse,
  setIsLoading
) => {
  setIsLoading(true);
  setApiResponse(null);

  try {
    const payloadWithCustomValues = {
      ...finalPayload,
      data: {
        ...finalPayload.data,
        ...filteredCustomPayload, // Use filtered custom payload
      },
    };
    const { data } = await axios.post(apiUrl, payloadWithCustomValues, {
      headers: filteredHeaders, // Use filtered headers
    });
    setApiResponse(data);
  } catch (error) {
    setApiResponse(
      error.response ? error.response.data : { message: error.message }
    );
  } finally {
    setIsLoading(false);
  }
};
