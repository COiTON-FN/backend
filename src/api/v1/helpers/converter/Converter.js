exports.byteArrayToString = (data) => {
  try {
    // Ensure the input is a string and parse it into an array of numbers
    const byteArray = Array.isArray(data)
      ? data
      : data?.split(",").map((num) => parseInt(num, 10));

    // Convert byte array to string
    const jsonString = String.fromCharCode(...byteArray);
    return jsonString === "" ? {} : JSON.parse(jsonString);
  } catch (error) {
    console.error("Error converting byte array to string:", error);
    return null;
  }
};
